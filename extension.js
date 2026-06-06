import * as vscode from "vscode";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { generateKeyPair } from "node:crypto";

// this is the folder where the typings are generated.
const bloxdFolderName = ".bloxd";

// this is the file name
const typingsFileName = ".bloxd_api.d.ts";

//regex to parse the @usebloxdapi comment
const useBloxdApiMarkerPattern = /^\/\/\s*@usebloxdapi\s*$/;
const generationPromises = new Map();
const generatedWorkspaces = new Set();

//#region Extension helper functions
async function regenerateForWorkspace(workspace) {
    // if there is no workspace then return early
    if (!workspace) return;
    const workspaceKey = workspace.uri.toString();

    // Case 1: if the file is already generated for this workspace then return
    if (generatedWorkspaces.has(workspaceKey)) return;

    // Case 2: if the generationPromise for this file has been generated
    if (generationPromises.has(workspaceKey)) {
        // just await it
        await generationPromises.get(workspaceKey);
        return;
    }

    // Case 3: Else create a generation promise
    const generationPromise = regenerate(workspace)
        .then(() => generatedWorkspaces.add(workspaceKey))
        .finally(() => generationPromises.delete(workspaceKey));

    generationPromises.set(workspaceKey, generationPromise);
    await generationPromise;
}

function getTypingsReferencePath(document) {
    // get the workspace
    const workspace =
        vscode.workspace.getWorkspaceFolder(document.uri) ??
        vscode.workspace.workspaceFolders?.[0];

    // if there is no workspace then return
    if (!workspace) return;

    // get the path for generating the file
    const typingsPath = path.join(
        workspace.uri.fsPath,
        bloxdFolderName,
        typingsFileName
    );

    // make it relative
    const relativePath = path
        .relative(path.dirname(document.uri.fsPath), typingsPath)
        .replace(/\\/g, "/");

    return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

function hasTypingsReference(document) {
    // check 5 lines to see if the /// <...> is alraedy there
    const linesToCheck = Math.min(document.lineCount, 5);

    for (let lineIndex = 0; lineIndex < linesToCheck; lineIndex++) {
        if (document.lineAt(lineIndex).text.includes(`${bloxdFolderName}/${typingsFileName}`)) {
            return true;
        }
    }

    return false;
}

// create the typings reference
async function ensureTypingsReference(document) {
    if (hasTypingsReference(document)) return;

    const referencePath = getTypingsReferencePath(document);

    if (!referencePath) return;

    const insertPosition = useBloxdApiMarkerPattern.test(document.lineAt(0).text.trim())
        ? new vscode.Position(1, 0)
        : new vscode.Position(0, 0);
    const edit = new vscode.WorkspaceEdit();
    edit.insert(
        document.uri,
        insertPosition,
        `
/// <reference path="${referencePath}" />\n`
    );

    await vscode.workspace.applyEdit(edit);
}

async function regenerateForDocument(document) {
    if (!isBloxdApiDocument(document)) return;

    await ensureTypingsReference(document);

    const workspace =
        vscode.workspace.getWorkspaceFolder(document.uri) ??
        vscode.workspace.workspaceFolders?.[0];

    await regenerateForWorkspace(workspace);
}

async function tryRegenerateForDocument(document) {
    try {
        await regenerateForDocument(document);
    } catch (error) {
        console.error("Bloxd API typings generation failed", error);
    }
}

async function tryRegenerateForCreatedFile(uri) {
    try {
        await regenerateForCreatedFile(uri);
    } catch (error) {
        console.error("Bloxd API typings generation failed", error);
    }
}

async function regenerateForCreatedFile(uri) {
    if (uri.scheme !== "file") return;

    // get he base name
    const fileName = path.basename(uri.fsPath);
    const workspace =
        vscode.workspace.getWorkspaceFolder(uri) ??
        vscode.workspace.workspaceFolders?.[0];

    // Case 1: The file name ends with .blxdapi.js
    if (fileName.endsWith(".blxdapi.js")) {
        await regenerateForWorkspace(workspace);
        return;
    }

    // Case 2: the file name begins with .js
    if (!fileName.endsWith(".js")) return;

    //  read the file and see if the file has a //@usebloxdapi
    const file = await vscode.workspace.fs.readFile(uri);
    const firstLine = new TextDecoder()
        .decode(file)
        .split(/\r?\n/, 1)[0]
        .trim();

    if (useBloxdApiMarkerPattern.test(firstLine)) {
        await regenerateForWorkspace(workspace);
    }
}

// check if the file is a file that uses the bloxd api
function isBloxdApiDocument(document) {
    if (document.uri.scheme !== "file") return false;

    const fileName = path.basename(document.uri.fsPath);

    if (fileName.endsWith(".blxdapi.js")) return true;
    if (!fileName.endsWith(".js")) return false;
    if (document.lineCount === 0) return false;

    return hasTypingsReference(document) ||
        useBloxdApiMarkerPattern.test(document.lineAt(0).text.trim());
}

async function hideInVSCodeExplorer(workspace) {
    const config = vscode.workspace.getConfiguration("files", workspace.uri);
    const exclude = config.get("exclude") ?? {};

    if (exclude[bloxdFolderName] === true) return;

    await config.update(
        "exclude",
        {
            ...exclude,
            [bloxdFolderName]: true
        },
        vscode.ConfigurationTarget.WorkspaceFolder
    );
}

function hideOnWindows(filePath) {
    // check if the platform is actually windows
    if (process.platform !== "win32") return;

    // run a command to hide the file
    spawnSync("attrib", ["+h", filePath], {
        windowsHide: true,
        stdio: "ignore"
    });
}
//#endregion

//#region Helper function to parse the types from the bloxd repo
function fixType(type) {
    return fixObjectType(type
        .replace(/\\\|/g, "|") // replace the \| the developers used to escape | conflicts
        .replace(/\s+/g, " ") // replace too many spaces with a single space
        .trim()); // remove space around
}
function fixObjectType(type) {
    return type.replace(
        // regex to get the object's innerbody
        /\{\s*(.*?)\s*\}/g,
        (_, body) => {
            /**Check if the object is already formatted correctly */
            if (body.includes(",") || body.includes(";")) {
                return `{ ${body} }`;
            }
            
            // find all fields
            const fields = body.match(
                /\w+\??\s*:\s*[^{}]+?(?=\s+\w+\??\s*:|$)/g
            );

            // if  fields couldnt be matched then return the body intact
            if (!fields) {
                return `{ ${body} }`;
            }

            // return the formatted object
            return `{ ${fields.join("; ")} }`;
        }
    );
}
//#endregion

//#region Item name parsing
function generateItemNameUnion(md) {
    return md.split("\n").map(a => `"${a}"`).join("|")
}
//#endregion
/*
//#region Callback parsing
export function generateCallbacks(md) {
    // get all callbacks, ignore the first heading (the Callbacks heading)
    const blocks = md.split("\n## ").slice(1);

    return blocks.map(block => {
        const lines = block.split("\n");
        
        // name of the callback
        // usually the first line
        const name = lines[0].trim();

        // parse the params and get their info
        const params = [
            ...block.matchAll(
                /^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*([^|]*?)\s*\|$/gm
            )
        ].map(([, paramName, type, desc]) => ({
            name: paramName,
            type: fixType(type),
            description: desc.trim()
        }));

        // get the return type
        const returns =
            block.match(/### Returns:\s*`([^`]+)`/)?.[1]?.trim() ?? "void";

        return {
            name,
            params,
            returns
        };
    });
}

export function generateCallbackTypes(callbacks) {
    // use the array parsed from generateCallbacks
    return callbacks.map(cb => {
        const params = cb.params
            .map(p => `${p.name}: ${p.type}`)
            .join(", ");

        return `
/**
 * ${cb.name}
/declare var ${cb.name}:(${params})=> ${fixType(cb.returns)};
`;
    }).join("\n");
}
//#endregion
*/
//#region Icon parsing
function parseIcons(md) {
    const sections = md.split("## ").slice(1);

    const ingame = [];
    const faFull = [];
    const faNames = new Set();
    const kits = [];
    const brands = [];
    const aliases = [];

    for (const section of sections) {
        const title = section.split("\n")[0].trim();
        const body = section;

        if (title.includes("Ingame Icons")) {
            const list = body.match(/```\n([\s\S]*?)```/)?.[1] ?? "";
            ingame.push(
                ...list.split("\n").map(x => x.trim()).filter(Boolean)
            );
        }

        if (title.includes("Font Awesome Icons")) {
            const list = body.match(/```\n([\s\S]*?)```/)?.[1] ?? "";
            for (const line of list.split("\n").map(x => x.trim()).filter(Boolean)) {
                faFull.push(line);

                const parts = line.split(" ");
                faNames.add(parts[parts.length - 1]); // icon name only
            }
        }

        if (title.includes("Custom Kit Icons")) {
            const list = body.match(/```\n([\s\S]*?)```/)?.[1] ?? "";
            kits.push(...list.split("\n").map(x => x.trim()).filter(Boolean));
        }

        if (title.includes("Brand Icons")) {
            const list = body.match(/```\n([\s\S]*?)```/)?.[1] ?? "";
            brands.push(...list.split("\n").map(x => x.trim()).filter(Boolean));
        }
    }

    return { ingame, faFull, faNames: [...faNames], kits, brands, aliases };
}
function buildIconTypes(parsed) {
    const ingame = `
declare type IngameIconName =
${parsed.ingame.map(x => `  | "${x}"`).join("\n")};
`;

    const faNames = `
declare type FontAwesomeIconName =
${parsed.faNames.map(x => `  | "${x}"`).join("\n")};
`;

    const faFull = `
declare type FontAwesomeFullIcon =
${parsed.faFull.map(x => `  | "${x}"`).join("\n")};
`;

    const kits = `
declare type CustomKitIcon =
${parsed.kits.map(x => `  | "${x}"`).join("\n")};
`;

    const brands = `
declare type BrandIcon =
${parsed.brands.map(x => `  | "${x}"`).join("\n")};
`;

    const aliases = `
declare type SimpleIconAlias =
${parsed.aliases.map(x => `  | "${x}"`).join("\n")};
`;

    const union = `
declare type IconName =
  | IngameIconName
  | FontAwesomeIconName
  | CustomKitIcon
  | BrandIcon;
`;

    return [
        ingame,
        faNames,
        faFull,
        kits,
        brands,
        aliases,
        union
    ].join("\n");
}
//#endregion
//#region Block name parsing
function parseBlockNameType(blockText) {
    const blockNames = [];
    const blockNameSet = new Set();

    function addBlockName(blockName) {
        if (blockNameSet.has(blockName)) return;

        blockNameSet.add(blockName);
        blockNames.push(blockName);
    }

    for (const line of blockText.split("\n")) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const match = trimmed.match(/^(.*?)\s*(?:\[([^\]]+)\])?$/);

        if (!match) continue;

        const blockName = match[1].trim();
        const meta = match[2]
            ?.split(",")
            .map(x => x.trim()) ?? [];

        addBlockName(`"${blockName}"`);

        for (const code of meta) {
            switch (code) {
                case "G":
                    addBlockName(`"${blockName}|Growing"`);
                    break;

                case "FG":
                    addBlockName(`"${blockName}|FreshlyGrown"`);
                    break;

                case "RT":
                    addBlockName(`"${blockName}|Roots"`);
                    break;

                case "LV":
                    addBlockName(`"${blockName}|Lava"`);
                    break;

                case "TP":
                    addBlockName(`"${blockName}|Top"`);
                    break;

                case "GR":
                    addBlockName(`"${blockName}|GrassRoots"`);
                    break;

                case "BK":
                    addBlockName(`"${blockName}|Breaking"`);
                    break;

                case "FL":
                    addBlockName(`"${blockName}|Flashing"`);
                    break;

                case "TC":
                    addBlockName(`"${blockName}|TreeCanopy"`);
                    break;

                case "TB":
                    addBlockName(`\`${blockName}|TreeBase|\${WoodType}\``);
                    break;

                case "R":
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}\``);
                    break;

                case "O":
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}|open\``);
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}|closed\``);
                    break;

                case "H":
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}|top\``);
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}|bot\``);
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}|side\``);
                    break;

                case "B":
                    addBlockName(`\`${blockName}|meta|rot\${1|2|3|4}|books\${1|2|3|4|5|6}\``);
                    break;
            }
        }
    }

    const woodType = `declare type WoodType =
    | "Maple"
    | "Pine"
    | "Plum"
    | "Cedar"
    | "Aspen"
    | "Jungle"
;
`;
    const blockName = `declare type BlockName =\n${blockNames.map(x => `    | ${x}`).join("\n")}\n;\n`;

    return `${woodType}\n${blockName}`;
}
//#endregion
/*
//#region Mob parsing
function splitMobSections(md) {
    const regex = /\n## ([^\n]+)/g;

    const sections = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(md))) {
        const title = match[1].trim();
        const start = match.index;

        if (sections.length) {
            sections[sections.length - 1].content = md.slice(lastIndex, start);
        }

        sections.push({ title, content: "" });
        lastIndex = start;
    }

    if (sections.length) {
        sections[sections.length - 1].content = md.slice(lastIndex);
    }

    return sections;
}

function extractType(block) {
    const match = block.match(/\*\*Type:\*\*\s*`([\s\S]*?)`/);
    return fixType(match?.[1] ?? "any");
}
*/
/*
function parseMobSettings(md) {
    const sections = splitMobSections(md);

    return sections
        .filter(s =>
            !s.title.includes("Mob AI") &&
            !s.title.includes("Mob Variations") &&
            /\*\*Type:\*\*//*.test(s.content)
        )
        .map(s => ({
            name: s.title.trim(),
            type: extractType(s.content)
        }));
}

function parseMobTypes(md) {
    const match = md.replace("js", "ts").match(/```js\s*([\s\S]*?)```/);
    if (!match) return [];

    return [...new Set(
        match[1]
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean)
            .map(l => l.split(":")[0].trim())
            .filter(n => n && n !== "Mob AI" && n !== "Mob Variations")
    )];
}

function generateTMobSetting(settings) {
    return `
declare type TMobSetting =
${settings.map(s => `  | "${s.name}"`).join("\n")};
`.trim();
}

function generateTMobType(mobs) {
    return `
declare type TMobType =
${[...new Set(mobs)].map(m => `  | "${m}"`).join("\n")};
`.trim();
}

function generateMobSettingsMap(settings) {
    return `
declare type MobSettings<T extends TMobType> = {
${settings.map(s => `  ${s.name}: ${fixType(s.type)};`).join("\n")}
};
`.trim();
}
*/
//#endregion
/*
//#region Entity Settings parsing
function parseEntitySettings(md) {
    const blocks = md.split("\n## ").slice(1);

    const settings = [];

    for (const block of blocks) {
        const lines = block.split("\n");

        const name = lines[0].trim();

        const typeMatch = block.match(/\*\*Type:\*\*\s*`([^`]+)`/);
        if (!typeMatch) continue;

        const type = typeMatch[1].trim();

        settings.push({ name, type: fixType(type) });
    }

    return settings;
}
function generateSettingType(settings) {
    return `
declare type Setting =
${settings.map(s => `  | "${s.name}"`).join("\n")};
`;
}
function generateOtherEntitySettings(settings) {
    return `
declare type OtherEntitySettings = {
${settings
            .map(s => `  ${s.name}: ${fixType(s.type)}`)
            .join("\n")}
};
`;
}
//#endregion
//#region Client option parsing
function parseClientOptions(md) {
    const blocks = md.split("\n## ").slice(1);

    const options = [];

    for (const block of blocks) {
        const lines = block.split("\n");

        const name = lines[0].trim();

        const typeMatch = block.match(/\*\*Type:\*\*\s*`([^`]+)`/);
        if (!typeMatch) continue;

        const type = typeMatch[1].trim();

        options.push({ name, type });
    }

    return options;
}
function generatePassedOption(options) {
    return `
declare type PassedOption =
${options.map(o => `  | "${o.name}"`).join("\n")};
`;
}
function generateClientOptions(options) {
    return `
declare type ClientOptions = {
${options.map(o => `  ${o.name}: ${fixType(o.type)}`).join("\n")}
};
`;
}
*/
/*
//#endregion
//#region API Method parsing
function parseAPIReference(apiReference){
const sections = apiReference.split("\n## ").slice(1);
    const api = sections.map(section => {
        const lines = section.split("\n");

        const name = lines[0].trim();

        const description = section
            .match(/^[^\n]+\n([\s\S]*?)(?=\n###|$)/)?.[1]
            .trim()
            .replace(/\n+/g, " ") ?? "";

        const params = [
            ...section.matchAll(
                /^\|\s*(\w+)\s*\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|$/gm
            )
        ].map(([, name, type, description]) => ({
            name,
            type: type.replace("/|", "|"),
            description
        }));
        const returnMatch = section.match(
            /### Returns:\s*`([^`]+)`/
        );

        const returns = returnMatch?.[1] ?? "void";
        return {
            name,
            description,
            params,
            returns
        };
    });
    return api
}
function generateAPIDeclaration(api){
    return api.map(cmd => {
        if (cmd.name === "changePlayerIntoSkin") {
            return `

 * ${cmd.description}
 * @param {PlayerId} playerId Player to change
 * @param {CosmeticType} cosmeticType Type of cosmetic
 * @param {Cosmetic<T>} cosmeticName Chosen cosmetic, will be made lowercase automatically
 * @returns {void}
function changePlayerIntoSkin<T extends CosmeticType>(
  playerId: PlayerId,
  cosmeticType: T,
  cosmeticName: Cosmetic<T>
): void;
`;
        } else if (cmd.name === "setEveryoneSettingForPlayer") {
            return `

 * Set a player's other-entity setting for every lifeform in the game.
 * includeNewJoiners=true means that the player will have the setting applied to new joiners.
 *
 * @param {PlayerId} playerId
 * @param {T} settingName
 * @param {OtherEntitySettings[T]} settingValue
 * @param {boolean} [includeNewJoiners]
 * @returns {void}
 
function setEveryoneSettingForPlayer<T extends Setting>(playerId:PlayerId, settingName:T, settingValue:OtherEntitySettings[T], includeNewJoiners:boolean):void;
`
        } else if (cmd.name === "setOtherEntitySetting") {
            return `
/**
 * Set a player's other-entity setting for a specific entity.
 *
 * @param {PlayerId} relevantPlayerId
 * @param {EntityId} targetedEntityId
 * @param {T} settingName
 * @param {OtherEntitySettings[T]} settingValue
 * @returns {void}

function setOtherEntitySetting<T extends Setting>(relevantPlayerId:PlayerId, targetedEntityId:EntityId, settingName:T, settingValue:OtherEntitySettings[T]):void;
`
        } else if (cmd.name === "getOtherEntitySetting") {
            return `
/**
 * Get the value of a player's other-entity setting for a specific entity.
 *
 * @param {PlayerId} relevantPlayerId
 * @param {EntityId} targetedEntityId
 * @param {T} settingName
 * @returns {OtherEntitySettings[T]}

function getOtherEntitySetting<T extends Setting>(relevantPlayerId:PlayerId, targetedEntityId:EntityId, settingName:T):OtherEntitySettings[T];
`
        } else if (cmd.name === "setTargetedPlayerSettingForEveryone") {
            return `
/**
 * Set every player's other-entity setting to a specific value for a particular player.
 * includeNewJoiners=true means that new players joining the game will also have this other player setting applied.
 *
 * @param {PlayerId} targetedPlayerId
 * @param {T} settingName
 * @param {OtherEntitySettings[T]} settingValue
 * @param {boolean} [includeNewJoiners]
 * @returns {void}

function setTargetedPlayerSettingForEveryone<T extends Setting>(targetedPlayerId:PlayerId, settingName:T, settingValue:OtherEntitySettings[T], includeNewJoiners:boolean):void;
`
        } else if (cmd.name === "getDefaultMobSetting") {
            return `
/**
 * Returns the current default value for a mob setting.
 *
 * @param {T} mobType
 * @param {S} setting
 * @returns {MobSettings<T>[S]}

function getDefaultMobSetting<T extends TMobType, S extends TMobSetting>(mobType:T, setting:S):MobSettings<T>[S];
`
        } else if (cmd.name === "getMobSetting") {
            return `

/**
 * Get the current value of a mob setting for a specific mob.
 *
 * @param {MobId} mobId
 * @param {T} setting
 * @param {boolean} [returnDefaultIfNotOverridden] - If true, return the default setting if not overridden.
 * @returns {MobSettings<MobType>[T]}

function getMobSetting<T extends TMobSetting>(mobId:MobId, setting:T, returnDefaultIfNotOverridden?:boolean):MobSettings<MobType>[T];
`
        } else if (cmd.name === "setMobSetting") {
            return `
/**
 * Set the current value of a mob setting for a specific mob.
 *
 * @param {MobId} mobId
 * @param {T} setting
 * @param {MobSettings<MobType>[T]} value
 * @returns {void}

function setMobSetting<T extends TMobSetting>(mobId:MobId, setting:T, value:MobSettings<MobType>[T]);
`
        } else if (cmd.name === "setClientOption") {
            return `
/**
 * Modify a client option at runtime and send to the client if it changed
 *
 * @param {PlayerId} playerId
 * @param {T} option - The name of the option
 * @param {ClientOptions[T]} value - The new value of the option
 * @returns {void}

function setClientOption<T extends PassedOption>(playerId:PlayerId, option:T, value:ClientOptions[T]):void;
`
        } else if (cmd.name === "getClientOption") {
            return `
/**
 * Returns the current value of a client option
 *
 * @param {PlayerId} playerId
 * @param {T} option
 * @returns {ClientOptions[T]}

function getClientOption<T extends PassedOption>(playerId:PlayerId, option:T):ClientOptions[T];
`
        }
        const params = cmd.params
            .map(p => `${p.name}: ${fixType(p.type)}`)
            .join(", ");

        return `
/**
 * ${cmd.description}
${cmd.params.map(
            p => ` * @param ${p.name} ${p.description}`
        ).join("\n")}
 * @returns ${cmd.returns}

function ${cmd.name}(${params}): ${fixType(cmd.returns)};
`;
    }).join("\n");
}
*/
export async function regenerate(workspace) {
    // fetch all the links
    const [blockResponse, itemNamesResponse, iconsResponse,aptits] = await Promise.all([
        fetch("https://raw.githubusercontent.com/Bloxdy/code-api/refs/heads/main/BLOCK_NAMES.txt"),
        fetch("https://raw.githubusercontent.com/Bloxdy/code-api/refs/heads/main/ITEM_NAMES.txt"),
        fetch("https://raw.githubusercontent.com/Bloxdy/code-api/refs/heads/main/ICONS.md"),
            fetch("https://raw.githubusercontent.com/GlitchHunterCoder/Bloxd-TSDocs/refs/heads/main/TS/ALL.ts")
    ]);
/*
    // parse the mob settings
    const mobSettingsText = await mobSettingsResponse.text();
    const mobSettings = parseMobSettings(mobSettingsText);
    const mobTypes = parseMobTypes(mobSettingsText);

    const tmobSetting = generateTMobSetting(mobSettings);
    const mobSettingsMap = generateMobSettingsMap(mobSettings);
    const tmobType = generateTMobType(mobTypes);

    // parse the entity settings
    const entitySettings = parseEntitySettings(await entitySettingsResponse.text())
    const settingsType = generateSettingType(entitySettings)
    const OtherEntitySettingsType = generateOtherEntitySettings(entitySettings)

    // parse the client options
    const clientOptions = parseClientOptions(await clientOptionsResponse.text())
    const passedOptionType = generatePassedOption(clientOptions)
    const clientOptionsType = generateClientOptions(clientOptions)
*/
    // parse block names
    const blockNameType = parseBlockNameType(await blockResponse.text());

    // parse icons [THIS IS BROKEN RIGHT NOW]
    const iconsDeclaration = buildIconTypes(parseIcons(await iconsResponse.text()))

    // parse item names
    const itemNameUnion = generateItemNameUnion(await itemNamesResponse.text())
/*
    // parse the api reference
    const declarations = generateAPIDeclaration(parseAPIReference(await response.text()))
    
    //parse callbacks
    const callbacks = generateCallbackTypes(generateCallbacks(await callbackResponse.text()))
*/
    // the final dts file
    const dts = `
declare namespace globalThis{
${(await aptits.text()).replace("type BlockName = string","").replace("type ItemName = string","").replace("type Cosmetic =","")}
declare type CosmeticType = "skin"|"hat"|"head"|"body"|"eyebrows"|"eyes"|"back"|"legs"|"shoes"
declare type skinCosmetic = "skin_0_0"|"skin_0_1"|"skin_0_2"|"skin_0_3"|"skin_0_4"|"skin_0_5"|"skin_0_6"|"skin_0_7"|"skin_0_8"|"skin_0_9"|"skin_0_10"|"skin_0_11"|"skin_0_12"|"skin_0_13"|"skin_0_14"|"skin_0_15"|"skin_0_16"|"skin_0_17"|"skin_0_18"|"skin_0_19"|"skin_0_20"|"skin_0_21"|"skin_0_22"|"skin_0_23"
declare type SpecialCosmetic = "chef"|"farmer"|"farmer_gill"|"monster_hunter_lorenzo"|"painter_spencer"|"piggy_banker"|"portal_mage"|"trader"|"trader_black"|"trader_blue"|"wizard"|"zombie"
declare type headCosmetic = "head_0"|"head_1_0"|"head_1_1"|"head_1_2"|"head_1_3"|"head_1_4"|"head_2_0"|"head_2_1"|"head_2_2"|"head_2_3"|"head_2_4"|"head_3_0"|"head_3_1"|"head_3_2"|"head_3_3"|"head_3_4"|"head_4_0"|"head_4_1"|"head_4_2"|"head_4_3"|"head_4_4"|"head_5_0"|"head_5_1"|"head_5_2"|"head_5_3"|"head_5_4"|"head_6_0"|"head_6_1"|"head_6_2"|"head_6_3"|"head_6_4"|"head_7_0"|"head_7_1"|"head_7_2"|"head_7_3"|"head_7_4"|"head_8_0"|"head_8_1"|"head_8_2"|"head_8_3"|"head_8_4"|"head_9_0"|"head_9_1"|"head_9_2"|"head_9_3"|"head_9_4"
declare type eyebrowsCosmetic = "eyebrows_0"|"eyebrows_1_0"|"eyebrows_1_1"|"eyebrows_1_2"|"eyebrows_1_3"|"eyebrows_1_4"|"eyebrows_2_0"|"eyebrows_2_1"|"eyebrows_2_2"|"eyebrows_2_3"|"eyebrows_2_4"|"eyebrows_3_0"|"eyebrows_3_1"|"eyebrows_3_2"|"eyebrows_3_3"|"eyebrows_3_4"
declare type eyesCosmetic = "eyes_0_0"|"eyes_0_1"|"eyes_0_2"|"eyes_0_3"|"eyes_0_4"|"eyes_1_0"|"eyes_1_1"|"eyes_1_2"|"eyes_1_3"|"eyes_1_4"|"eyes_2_0"|"eyes_2_1"|"eyes_2_2"|"eyes_2_3"|"eyes_2_4"|"eyes_3_0"|"eyes_3_1"|"eyes_3_2"|"eyes_3_3"|"eyes_3_4"|"eyes_4_0"|"eyes_4_1"|"eyes_4_2"|"eyes_4_3"|"eyes_4_4"|"eyes_5_0"|"eyes_5_1"|"eyes_5_2"|"eyes_5_3"|"eyes_5_4"|"eyes_6_0"|"eyes_6_1"|"eyes_6_2"|"eyes_6_3"|"eyes_6_4"|"eyes_7_0"|"eyes_7_1"|"eyes_7_2"|"eyes_7_3"|"eyes_7_4"|"eyes_8_0"|"eyes_8_1"|"eyes_8_2"|"eyes_8_3"|"eyes_8_4"|"eyes_9_0"|"eyes_9_1"|"eyes_9_2"|"eyes_9_3"|"eyes_9_4"
declare type hatCosmetic = "hat_none"
declare type backCosmetic = "back_none"
declare type bodyCosmetic = "body_0_0"|"body_0_1"|"body_0_2"|"body_0_3"|"body_0_4"|"body_0_5"|"body_0_6"|"body_0_7"|"body_1_0"|"body_1_1"|"body_1_2"|"body_1_3"|"body_1_4"|"body_1_5"|"body_1_6"|"body_1_7"|"body_2_0"|"body_2_1"|"body_2_2"|"body_2_3"|"body_2_4"|"body_2_5"|"body_2_6"|"body_2_7"|"body_3_0"|"body_3_1"|"body_3_2"|"body_3_3"|"body_3_4"|"body_3_5"|"body_3_6"|"body_3_7"|"body_4_0"|"body_4_1"|"body_4_2"|"body_4_3"|"body_4_4"|"body_4_5"|"body_4_6"|"body_4_7"|"body_5_0"|"body_5_1"|"body_5_2"|"body_5_3"|"body_5_4"|"body_5_5"|"body_5_6"|"body_5_7"|"body_6_0"|"body_6_1"|"body_6_2"|"body_6_3"|"body_6_4"|"body_6_5"|"body_6_6"|"body_6_7"
declare type legsCosmetic = "legs_0_0"|"legs_0_1"|"legs_0_2"|"legs_0_3"|"legs_0_4"|"legs_1_0"|"legs_1_1"|"legs_1_2"|"legs_1_3"|"legs_1_4"|"legs_2_0"|"legs_2_1"|"legs_2_2"|"legs_2_3"|"legs_2_4"
declare type shoesCosmetic = "shoes_0_0"|"shoes_0_1"|"shoes_0_2"|"shoes_1_0"|"shoes_1_1"|"shoes_1_2"|"shoes_2_0"|"shoes_2_1"|"shoes_2_2"
declare type Cosmetic<type extends CosmeticType> = Cosmetics[type]
declare type CosmeticName = typeof Cosmetics[keyof Cosmetics]
declare type Cosmetics = {
skin:skinCosmetic|SpecialCosmetic,
head:headCosmetic|SpecialCosmetic,
eyebrows:eyebrowsCosmetic|SpecialCosmetic,
hat:hatCosmetic|SpecialCosmetic,
body:bodyCosmetic|SpecialCosmetic,
back:backCosmetic|SpecialCosmetic,
eye:eyesCosmetic|SpecialCosmetic,
legs:legsCosmetic|SpecialCosmetic,
shoes:shoesCosmetic|SpecialCosmetic}
declare type ItemName = ${itemNameUnion};
${blockNameType}
${iconsDeclaration}
}
`
    console.log("hey")
    workspace ??=
        vscode.workspace.workspaceFolders?.[0];

    if (!workspace) return;

    await hideInVSCodeExplorer(workspace);

    const typingsPath = path.join(
        workspace.uri.fsPath,
        bloxdFolderName,
        typingsFileName
    );
    mkdirSync(path.dirname(typingsPath), { recursive: true })
    const tmp = typingsPath + ".tmp";

    writeFileSync(tmp, dts);
    renameSync(tmp, typingsPath);
    hideOnWindows(path.dirname(typingsPath))
    hideOnWindows(typingsPath)
}
/**
 * @param {vscode.ExtensionContext} context
 */
export async function activate(context) {
    // create a fs watcher for .blxdapi.js files and .js files.
    const blxdApiWatcher = vscode.workspace.createFileSystemWatcher("**/*.blxdapi.js")
    const javascriptWatcher = vscode.workspace.createFileSystemWatcher("**/*.js")

    // debug message
    vscode.window.showInformationMessage("Bloxd API: Ran")
    context.subscriptions.push(
        blxdApiWatcher,
        javascriptWatcher,
        blxdApiWatcher.onDidCreate(uri => {
            void tryRegenerateForCreatedFile(uri)
        }),
        javascriptWatcher.onDidCreate(uri => {
            void tryRegenerateForCreatedFile(uri)
        }),
        vscode.workspace.onDidOpenTextDocument(document => {
            void tryRegenerateForDocument(document)
        }),
        vscode.workspace.onDidSaveTextDocument(document => {
            void tryRegenerateForDocument(document)
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            void tryRegenerateForDocument(event.document)
        }),
        vscode.commands.registerCommand("bloxd-api-tools.refresh", async () => {
            const workspace = vscode.workspace.workspaceFolders?.[0]
            try {
                await regenerate(workspace)
                if (workspace) generatedWorkspaces.add(workspace.uri.toString())
                vscode.window.showInformationMessage("Refreshed Bloxd API")
            } catch (error) {
                console.error("Bloxd API refresh failed", error)
                vscode.window.showErrorMessage("Failed to refresh Bloxd API")
            }
        })
    )
    for (const document of vscode.workspace.textDocuments) {
        void tryRegenerateForDocument(document)
    }
    console.log("written .d.ts")
}
export function deactivate() { }
