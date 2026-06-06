
declare namespace globalThis{

/** The ID of the player running the code.
 *
 * Lobby code usually has nobody running it, so this is null.
 */
declare const myId: string | null
/** The position of the code block or press to code board */
declare const thisPos: [number, number, number]
/** The owner of the current custom lobby */
declare const lobbyOwnerId: string | null

interface Console {
	/** Log a message to chat. */
	log(message: string): void
}
declare const console: Console

interface GameApi {
/** The ID of the player running the code.
 *
 * Lobby code usually has nobody running it, so this is null.
 */
myId: string | null
/** The position of the code block or press to code board */
thisPos: [number, number, number]
/** The owner of the current custom lobby */
lobbyOwnerId: string | null
/**
 * Get position of a player / entity.
 * @param entityId
 */
getPosition(entityId: EntityId): Pos
/**
 * Set position of a player / entity.
 * @param entityId
 * @param x Can also be an array, in which case y and z shouldn't be passed
 * @param y
 * @param z
 */
setPosition(entityId: EntityId, x: number | number[], y?: number, z?: number): void
/**
 * Get all the player ids.
 */
getPlayerIds(): PlayerId[]
/**
 * Whether a player is currently in the game
 *
 * @param playerId
 */
playerIsInGame(playerId: PlayerId): boolean
/**
 * @param playerId
 * @returns
 */
playerIsLoggedIn(playerId: PlayerId): boolean
/**
 * Returns the party that the player was in when they joined the game. The returned object contains the playerDbIds, as well
 * as the playerIds if available, of the party leader and members.
 *
 * @param playerId
 * @returns
 */
getPlayerPartyWhenJoined(playerId: PlayerId): PNull<{ partyCode: string; playerDbIds: PlayerDbId[] }>
/**
 * Get the number of players in the room
 */
getNumPlayers(): number
/**
 * Get the co-ordinates of the blocks the player is standing on as a list. For example, if the center of the player is at 0,0,0
 * this function will return [[0, -1, 0], [-1, -1, 0], [0, -1, -1], [-1, -1, -1]]
 * If the player is just standing on one block, the function would return e.g. [[0, 0, 0]]
 * If the player is middair then returns an empty list [].
 *
 * @param playerId
 */
getBlockCoordinatesPlayerStandingOn(playerId: PlayerId): number[][]
/**
 * Get the types of block the player is standing on
 * For example, if a player is standing on 4 dirt blocks, this will return ["Dirt", "Dirt", "Dirt", "Dirt"]
 * @param playerId
 */
getBlockTypesPlayerStandingOn(playerId: PlayerId): any[]
/**
 * Get the up to 12 unit co-ordinates the lifeform is located within
 * (A lifeform is modelled as having four corners and can be in up to 3 blocks vertically)
 *
 * @param lifeformId
 * @returns List of x, y, z positions e.g. [[-1, 0, 0], [-1, 1, 0], [-1, 2, 0]]
 */
getUnitCoordinatesLifeformWithin(lifeformId: LifeformId): number[][]
/**
 * Show the shop tutorial for a player. Will not be shown if they have ever seen the shop tutorial in your game before.
 * @param playerId
 */
showShopTutorial(playerId: PlayerId): void
/**
 * Get the current shield of an entity.
 * @param entityId
 */
getShieldAmount(entityId: EntityId): number
/**
 * Set the current shield of a lifeform.
 *
 * @param lifeformId
 * @param newShieldAmount
 */
setShieldAmount(lifeformId: LifeformId, newShieldAmount: number): void
/**
 * Get the current health of an entity.
 * @param entityId
 */
getHealth(entityId: PlayerId): number
/**
 * @param lifeformId
 * @param changeAmount Must be an integer. A positive amount will increase the entity's health. A negative amount will decrease the entity's shield first, then their health.
 * @param whoDidDamage Optional - If damage done by another player
 * @param broadcastLifeformHurt
 *
 * @return Whether the entity was killed
 */
applyHealthChange(lifeformId: LifeformId, changeAmount: number, whoDidDamage?: LifeformId | { lifeformId: LifeformId; withItem: string }, broadcastLifeformHurt?: boolean): boolean
/**
 * Set the current health of an entity.
 * If you want to set their health to more than their current max health, the optional increaseMaxHealthIfNeeded must be true.
 *
 * @param entityId
 * @param newHealth Can be null to make the player not have health
 * @param whoDidDamage Optional
 * @param increaseMaxHealthIfNeeded Optional
 *
 * @return Whether this change in health killed the player
 */
setHealth(entityId: EntityId, newHealth: PNull<number>, whoDidDamage?: LifeformId | { lifeformId: LifeformId; withItem: string }, increaseMaxHealthIfNeeded?: boolean): boolean
/**
 * Make it as if hittingEId hit hitEId
 *
 * @param hittingEId
 * @param hitEId
 * @param dirFacing
 * @param bodyPartHit
 * @param overrides
 * @returns whether the attack damaged the lifeform
 */
applyMeleeHit(hittingEId: LifeformId, hitEId: LifeformId, dirFacing: number[], bodyPartHit?: PNull<LifeformBodyPart>, overrides?: { damage?: PNull<number>; heldItemName?: PNull<string>; horizontalKbMultiplier?: number; verticalKbMultiplier?: number; }): boolean
/**
 * Apply damage to a lifeform.
 * eId is the player initiating the damage, hitEId is the lifeform being hit.
 *
 * It is recommended to self-inflict damage when the game code wants to apply damage to a lifeform.
 *
 * @param eId
 * @param hitEId
 * @param attemptedDmgAmt
 * @param withItem
 * @param bodyPartHit
 * @param attackDir
 * @param showCritParticles
 * @param reduceVerticalKbVelocity
 * @param horizontalKbMultiplier
 * @param verticalKbMultiplier
 * @param broadcastEntityHurt
 * @param attackCooldownSettings
 * @param hittingSoundOverride
 * @param ignoreOtherEntitySettingCanAttack
 * @param isTrueDamage
 * @param damagerDbId
 *
 * @returns whether the attack damaged the lifeform
 */
attemptApplyDamage({
		eId,
		hitEId,
		attemptedDmgAmt,
		withItem,
		bodyPartHit,
		attackDir,
		showCritParticles,
		reduceVerticalKbVelocity,
		horizontalKbMultiplier,
		verticalKbMultiplier,
		broadcastEntityHurt,
		attackCooldownSettings,
		hittingSoundOverride,
		ignoreOtherEntitySettingCanAttack,
		isTrueDamage,
		damagerDbId,
	}: PlayerAttemptDamageOtherPlayerOpts): boolean
/**
 * Force respawn a player
 * @param playerId
 * @param respawnPos
 */
forceRespawn(playerId: PlayerId, respawnPos?: number[]): void
/**
 * Kill a lifeform.
 * @param lifeformId
 * @param whoKilled Optional
 */
killLifeform(lifeformId: LifeformId, whoKilled?: LifeformId | { lifeformId: LifeformId; withItem: string }): void
/**
 * Gets the player's current killstreak
 *
 * @param playerId
 * @returns
 */
getCurrentKillstreak(playerId: PlayerId): number
/**
 * Clears the player's current killstreak
 *
 * @param playerId
 */
clearKillstreak(playerId: PlayerId): void
/**
 * Whether a lifeform is alive or dead (or on the respawn screen, in a player's case).
 *
 * @param lifeformId
 * @returns
 */
isAlive(lifeformId: LifeformId): boolean
/**
 * Send a message to everyone
 *
 * @param message The text contained within the message. Can use `Custom Text Styling`.
 * @param style An optional style argument. Can contain values for fontWeight and color of the message.
 *          style is ignored if message uses custom text styling (i.e. is not a string).
 */
broadcastMessage(message: string | CustomTextStyling, style?: { fontWeight?: number | string; color?: string; colour?: string }): void
/**
 * Send a message to a specific player
 *
 * @param playerId Id of the player
 * @param message The text contained within the message. Can use `Custom Text Styling`.
 * @param style An optional style argument. Can contain values for fontWeight and color of the message.
 *              style is ignored if message uses custom text styling (i.e. is not a string).
 */
sendMessage(playerId: PlayerId, message: string | CustomTextStyling, style?: { fontWeight?: number | string; color?: string }): void
/**
 * Send a flying middle message to a specific player
 *
 * @param playerId Id of the player
 * @param message The text contained within the message. Can be either a string or use `Custom Text Styling`.
 * @param distanceFromAction The distance from the action that has caused this message to be displayed,
 *                           this value will be used to determine how the message flies across the screen.
 * @param lifetimeMs How long the message will be visible in milliseconds. Defaults to 1000ms.
 */
sendFlyingMiddleMessage(playerId: PlayerId, message: string | CustomTextStyling, distanceFromAction: number, lifetimeMs?: number): void
/**
 * Modify a client option at runtime and send to the client if it changed
 *
 * @param playerId
 * @param option The name of the option
 * @param value The new value of the option
 */
setClientOption<PassedOption extends ClientOption>(playerId: PlayerId, option: PassedOption, value: ClientOptions[PassedOption]): void
/**
 * Returns the current value of a client option
 *
 * @param playerId
 * @param option
 */
getClientOption<PassedOption extends ClientOption>(playerId: PlayerId, option: PassedOption): ClientOptions[PassedOption]
/**
 * Create a new shop item under the given category.
 * Will create a new category if it does not exist.
 * If the shop item already exists then it will be replaced.
 * If any per-player overrides exist under the same categoryKey and itemKey then they will be deleted.
 *
 * @param categoryKey - The key of the category to create the item in
 * @param itemKey - The unique key for the item
 * @param item - The shop item to create (will be mutated)
 */
createShopItem(categoryKey: ShopCategoryKey, itemKey: ShopItemKey, item: ShopItem): void
/**
 * Update selected properties of an existing shop item.
 * For example, { canBuy: true } to allow players to purchase the item.
 * Throws an error if the item does not exist.
 *
 * @param categoryKey - The key of the category containing the item
 * @param itemKey - The unique key for the item
 * @param changes - Partial shop item properties to update
 */
updateShopItem(categoryKey: ShopCategoryKey, itemKey: ShopItemKey, changes: Partial<ShopItem>): void
/**
 * Delete an existing shop item.
 * Throws an error if the item does not exist.
 * Will also delete all per-player overrides for the shop item.
 *
 * @param categoryKey - The key of the category containing the item
 * @param itemKey - The unique key for the item
 */
deleteShopItem(categoryKey: ShopCategoryKey, itemKey: ShopItemKey): void
/**
 * Set properties of a shop category.
 *
 * @param categoryKey - The key of the category to configure
 * @param config - Category configuration properties
 */
configureShopCategory(categoryKey: ShopCategoryKey, config: ShopCategoryConfig): void
/**
 * Create a new shop item for a specific player.
 * Will create a new category if it does not exist.
 * Will replace any overrides this player already has for the same item.
 *
 * @param playerId - The player to create the item for
 * @param categoryKey - The key of the category to create the item in
 * @param itemKey - The unique key for the item
 * @param item - The shop item to create (will be mutated)
 */
createShopItemForPlayer(playerId: PlayerId, categoryKey: ShopCategoryKey, itemKey: ShopItemKey, item: ShopItem): void
/**
 * Update selected properties of an existing shop item for a specific player.
 * For example, { canBuy: true } to allow this player to purchase the item.
 * Throws an error if the item does not exist.
 *
 * @param playerId - The player to update the item for
 * @param categoryKey - The key of the category containing the item
 * @param itemKey - The unique key for the item
 * @param changes - Partial shop item properties to update
 */
updateShopItemForPlayer(playerId: PlayerId, categoryKey: ShopCategoryKey, itemKey: ShopItemKey, changes: Partial<ShopItem>): void
/**
 * Delete a specific player's overrides for a shop item.
 * Like other methods, it doesn't matter whether the overrides were created
 * using createShopItemForPlayer or by using updateShopItemForPlayer instead.
 * This method does nothing if the overrides don't exist or are defined internally by the engine.
 *
 * @param playerId - The player to reset the item for
 * @param categoryKey - The key of the category containing the item
 * @param itemKey - The unique key for the item
 */
resetShopItemForPlayer(playerId: PlayerId, categoryKey: ShopCategoryKey, itemKey: ShopItemKey): void
/**
 * Configure a shop category for a specific player.
 *
 * @param playerId - The player to configure the category for
 * @param categoryKey - The key of the category to configure
 * @param config - Category configuration properties
 */
configureShopCategoryForPlayer(playerId: PlayerId, categoryKey: ShopCategoryKey, config: ShopCategoryConfig): void
/**
 * Modify client options at runtime
 *
 * @param playerId
 * @param optionsObj An object which contains key value pairs of new settings. E.g {canChange: true, speedMultiplier: false}
 */
setClientOptions(playerId: PlayerId, optionsObj: Partial<ClientOptions>): void
/**
 * Sets a client option to its default value. This will be the value stored in your game's defaultClientOptions, otherwise Bloxd's default.
 *
 * @param playerId
 * @param option
 */
setClientOptionToDefault(playerId: PlayerId, option: ClientOption): void
/**
 * Set every player's other-entity setting to a specific value for a particular player.
 * includeNewJoiners=true means that new players joining the game will also have this other player setting applied.
 *
 * @param targetedPlayerId
 * @param settingName
 * @param settingValue
 * @param includeNewJoiners
 */
setTargetedPlayerSettingForEveryone<Setting extends OtherEntitySetting>(targetedPlayerId: PlayerId, settingName: Setting, settingValue: OtherEntitySettings[Setting], includeNewJoiners?: boolean): void
/**
 * Set a player's other-entity setting for every lifeform in the game.
 * includeNewJoiners=true means that the player will have the setting applied to new joiners.
 *
 * @param playerId
 * @param settingName
 * @param settingValue
 * @param includeNewJoiners
 */
setEveryoneSettingForPlayer<Setting extends OtherEntitySetting>(playerId: PlayerId, settingName: Setting, settingValue: OtherEntitySettings[Setting], includeNewJoiners?: boolean): void
/**
 * Set a player's other-entity setting for a specific entity.
 *
 * @param relevantPlayerId
 * @param targetedEntityId
 * @param settingName
 * @param settingValue
 */
setOtherEntitySetting<Setting extends OtherEntitySetting>(relevantPlayerId: PlayerId, targetedEntityId: EntityId, settingName: Setting, settingValue: OtherEntitySettings[Setting]): void
/**
 * Set many of a player's other-entity settings for a specific entity.
 *
 * @param relevantPlayerId
 * @param targetedEntityId
 * @param settingsObject
 */
setOtherEntitySettings(relevantPlayerId: PlayerId, targetedEntityId: EntityId, settingsObject: Partial<OtherEntitySettings>): void
/**
 * Get the value of a player's other-entity setting for a specific entity.
 *
 * @param relevantPlayerId
 * @param targetedEntityId
 * @param settingName
 */
getOtherEntitySetting<Setting extends OtherEntitySetting>(relevantPlayerId: PlayerId, targetedEntityId: EntityId, settingName: Setting): OtherEntitySettings[Setting]
/**
 * Reset a player's other-entity setting for a specific entity to the game's default value.
 *
 * @param relevantPlayerId
 * @param targetedEntityId
 * @param settingName
 */
setOtherEntitySettingToDefault<Setting extends OtherEntitySetting>(relevantPlayerId: PlayerId, targetedEntityId: EntityId, settingName: Setting): void
/**
 * Play particle effect on all clients, or only on some clients if clientPredictedBy is specified
 * @param opts
 * @param clientPredictedBy Play only on clients where client with playerId clientPredictedBy
 *                          is not invisible, transparent, or themselves
 */
playParticleEffect(opts: TempParticleSystemOpts | ParticlePresetOpts, clientPredictedBy?: PlayerId): void
/**
 * Animates the given entity. Pass `null` for `animationSchema` to stop the entity's current animation (the
 * `initialTimeFraction` and `animationSpeed` arguments are ignored in that case).
 * @param entityId
 * @param animationSchema
 * @param initialTimeFraction
 * @param animationSpeed
 */
animateEntity(entityId: EntityId, animationSchema: AnimationSchema | BlockbenchAnimationSchema | null, initialTimeFraction?: number, animationSpeed?: number): void
/**
 * Get the in game name of an entity.
 * @param entityId
 */
getEntityName(entityId: EntityId): string
/**
 * Given the name of a player, get their id
 * @param playerName
 */
getPlayerId(playerName: string): PNull<PlayerId>
/**
 * Given a player, get their permanent identifier that doesn't change when leaving and re-entering
 *
 * @param playerId
 */
getPlayerDbId(playerId: PlayerId): PlayerDbId
/**
 * Returns null if player not in lobby
 *
 * @param dbId
 */
getPlayerIdFromDbId(dbId: PlayerDbId): PNull<PlayerId>
/**
 * Gets the persistent database ID for the given mob.
 * This can be useful for reasoning about mobs that have been loaded from the database, such as owned mobs.
 *
 * @param mobId - The ID of the mob from spawnMob
 * @returns The persistent database ID for the mob, or null if the mob is not persistent
 */
getMobDbId(mobId: MobId): PNull<MobDbId>

kickPlayer(playerId: PlayerId, reason: string): void
/**
 * Check if the block at a specific position is in a loaded chunk.
 * @param x
 * @param y
 * @param z
 * @return boolean
 */
isBlockInLoadedChunk(x: number, y: number, z: number): boolean
/**
 * Get the name of a block.
 * @param x could be an array [x, y, z]. If so, the other params shouldn't be passed.
 * @param y
 * @param z
 * @return blockName - any block name, including 'Air'
 */
getBlock(x: number | number[], y?: number, z?: number): BlockName
/**
 * Used to get the block id at a specific position.
 * Intended only for use in hot code paths - default to getBlock for most use cases
 *
 * @param x
 * @param y
 * @param z
 */
getBlockId(x: number, y: number, z: number): BlockId
/**
 * Set a block. Valid names are any block name, including 'Air'
 *
 * This function is optimised for setting broad swathes of blocks. For example, if you have a 50x50x50 area you need to turn to air, it will run performantly if you call this in double nested loops.
 *
 * IF you're only changing a few blocks, you want this to be super snappy for players, AND you're calling this outside of your _tick function, you can use api.setOptimisations(false).
 *
 * If you want the optimisations for large quantities of blocks later on, then call api.setOptimisations(true) when you're done.
 *
 *
 *
 * @param x Can be an array
 * @param y Should be blockname if first param is array
 * @param z
 * @param blockName
 */
setBlock(x: number | number[], y: number | BlockName, z?: number, blockName?: BlockName): void
/**
 * Initiate a block change "by the world".
 * This ends up calling the onWorldChangeBlock and only makes the change if not prevented by game/plugins.
 * initiatorDbId is null if the change was initiated by the game code.
 *
 * @param initiatorDbId
 * @param x
 * @param y
 * @param z
 * @param blockName
 * @param extraInfo
 *
 * @returns "preventChange" if the change was prevented, "preventDrop" if the change was allowed but without dropping any items, and undefined if the change was allowed with an item drop
 */
attemptWorldChangeBlock(initiatorDbId: PNull<PlayerDbId>, x: number, y: number, z: number, blockName: BlockName, extraInfo?: WorldBlockChangedInfo): "preventChange" | "preventDrop" | void
/**
 * Returns whether a block is solid or not.
 * E.g. Grass block is solid, while water, ladder and water are not.
 * Will be true if the block is unloaded.
 *
 * @param x
 * @param y
 * @param z
 */
getBlockSolidity(x: number | number[], y?: number, z?: number): boolean
/**
 * Helper function that sets all blocks in a rectangle to a specific block.
 *
 * @param pos1 array [x, y, z]
 * @param pos2 array [x, y, z]
 * @param blockName
 */
setBlockRect(pos1: number[], pos2: number[], blockName: BlockName): void
/**
 * Create walls by providing two opposite corners of the cuboid
 *
 *
 * @param pos1 array [x, y, z]
 * @param pos2 array [x, y, z]
 * @param blockName
 * @param hasFloor
 * @param hasCeiling
 */
setBlockWalls(pos1: number[], pos2: number[], blockName: BlockName, hasFloor?: boolean, hasCeiling?: boolean): void
/**
 * Only use this instead of getBlock if you REALLY need the performance (i.e. you are iterating over tens of thousands of blocks)
 * ReturnedObject.blockData is a 32x32x32 ndarray of block ids
 * (see https://www.npmjs.com/package/ndarray)
 * Each block id is a 16-bit number
 * The ndarray should only be read from, writing to it will result in desync between the server and client
 *
 * @param pos The returned chunk contains pos
 * @returns null if the chunk is not loaded in a persisted world. ReturnedObject.blockData is an ndarray that can be accessed
 * (but modifications have to be saved with resetChunk).
 */
getChunk(pos: number[]): PNull<GameChunk>
/**
 * Copies chunk from one position to another.
 * A good use case for this is storing 'template' chunks that can be continuously copied to a new position.
 * In order to reset an area to the template, e.g. resetting a session-based game.
 *
 * NOTE: Does nothing if the source chunk is not loaded.
 *
 * @param fromPos - A block coordinate within the chunk to copy from.
 * @param toPos - A block coordinate within the chunk to copy to.
 */
copyChunk(fromPos: number[], toPos: number[]): void
/**
 * Use this to get a chunk ndarray you can edit and set in resetChunk.
 *
 * Only use chunk helpers if you REALLY need the performance (i.e. you are iterating over tens of thousands of blocks)
 * ReturnedObject.blockData is a 32x32x32 ndarray of air.
 * (see https://www.npmjs.com/package/ndarray)
 * Each block id is a 16-bit number
 */
getEmptyChunk(): GameChunk
/**
 * Splits the block name by '|'. If no meta info, metaInfo is ''
 *
 * @param blockName
 */
getMetaInfo(blockName: BlockName | null | undefined): ItemMetaInfo
/**
 * Get the numeric id of a block used in the ndarrays returned from getChunk
 * I.e. chunk.blockData.set(x, y, z, api.blockNameToBlockId("Dirt"))
 * or chunk.blockData.get(x, y, z) === api.blockNameToBlockId("Dirt")
 *
 * @param blockName
 * @param allowInvalidBlock Don't throw an error if the block name is invalid.
 * Defaults false. If true and name is invalid, returns null.
 * @returns
 */
blockNameToBlockId(blockName: BlockName, allowInvalidBlock?: boolean): PNull<number>
/**
 * Goes from block id to block name. The reverse of blockNameToBlockId
 *
 * @param blockId
 */
blockIdToBlockName(blockId: BlockId): BlockName
/**
 * Get the unique id of the chunk containing pos in the current map
 *
 * @param pos
 */
blockCoordToChunkId(pos: number[]): string
/**
 * Get the co-ordinates of the block in the chunk with the lowest x, y, and z co-ordinates
 *
 * @param chunkId
 */
chunkIdToBotLeftCoord(chunkId: string): [number, number, number]
/**
 * @deprecated - prefer using other UI elements
 * (this UI element hasn't been properly thought through in combination with other elements like killfeed, uirequests, etc)
 *
 * Send a player an icon in the top right corner
 *
 * @param playerId
 * @param icon Can be any icon from font-awesome.
 * @param text The text to send.
 * @param opts Can include keys duration, width, height, color, iconSizeMult.
 *
 * Default opts: {
 *  duration: 8, // seconds
 *  width: 400px,
 *  height: 100px,
 *  color: 'rgb(102, 102, 102)', // must be rgb in this format (hex not supported),
 *  iconSizeMult: 5,
 *  textAndIconColor: "white", // can be any colour supported by css (e.g. hex, rgb),
 *  fontSize: '17px',
 * }
 */
sendTopRightHelper(playerId: PlayerId, icon: string, text: string, opts: { duration?: number; width?: number; height?: number; color?: string; iconSizeMult?: number; textAndIconColor?: string; fontSize?: string; }): void
/**
 * Whether the player is on a mobile device or a computer.
 * @param playerId
 */
isMobile(playerId: PlayerId): boolean
/**
 * Create a dropped item.
 * @param x
 * @param y
 * @param z
 * @param itemName Name of the item. Any item name, including blocks and 'Air'
 * @param amount The amount of the item to include in the drop - so when the player picks up the item drop, they get this many of the item.
 * @param mergeItems Whether to merge the item into a nearby item of same type, if one exists. Defaults to false.
 * @param attributes Attributes of the item being dropped
 * @param timeTillDespawn Time till the item automatically despawns in milliseconds. Max of 5 mins.
 * @param dropperId Who dropped the item.
 * @param options Additional options, such as doPhysics and size.
 * @returns the id you can pass to setCantPickUpItem, or null if the item drop limit was reached
 */
createItemDrop(x: number, y: number, z: number, itemName: ItemName, amount?: PNull<number>, mergeItems?: boolean, attributes?: ItemAttributes, timeTillDespawn?: number, dropperId?: PNull<LifeformId>, options?: ItemDropOptions): PNull<EntityId>
/**
 * Prevent a player from picking up an item. itemId returned by createItemDrop
 *
 * @param playerId
 * @param itemId
 */
setCantPickUpItem(playerId: PlayerId, itemId: EntityId): void
/**
 * Reset a player's ability to pick up an item. itemId returned by createItemDrop
 *
 * @param playerId
 * @param itemId
 */
resetCanPickUpItem(playerId: PlayerId, itemId: EntityId): void
/**
 * Delete an item drop by item drop entity ID
 *
 * @param itemId
 */
deleteItemDrop(itemId: EntityId): void
/**
 * Returns all items overlapping with the given player
 *
 * @param playerId
 * @returns the overlapping item entity IDs
 */
getItemIDsOverlappingWithPlayer(playerId: PlayerId): EntityId[]
/**
 * Get the metadata about a block or item before stats have been modified by any client options
 * (i.e. its entry in the initial metadata object)
 *
 * @param itemName
 */
getInitialItemMetadata(itemName: string): Partial<BlockMetadataItem & NonBlockMetadataItem>
/**
 * Get stat info about a block or item
 * Either based on a client option for a player: (e.g. `DirtTtb`)
 * or its entry in the initial metadata object if no client option is set.
 *
 * If null is passed for lifeformId, this is simply its entry in blockMetadata etc.
 *
 *
 * @param lifeformId
 * @param itemName
 * @param stat
 */
getItemStat<K extends keyof AnyMetadataItem>(lifeformId: PNull<LifeformId>, itemName: ItemName, stat: K): AnyMetadataItem[K]
/**
 * Set a stat attribute for a block or item
 *
 * NOTE: Only a subset of stats are customisable this way.
 *
 * @param playerId
 * @param itemName
 * @param stat
 * @param value
 */
setItemStat<K extends CustomItemStat>(playerId: PlayerId, itemName: ItemName, stat: K, value: AnyMetadataItem[K]): void
/**
 * Set the direction the player is looking.
 *
 * @param playerId
 * @param direction a vector of the direction to look, format [x, y, z]
 */
setCameraDirection(playerId: PlayerId, direction: number[]): void
/**
 * Set a player's opacity
 * A simple helper that calls setTargetedPlayerSettingForEveryone
 *
 * @param playerId
 * @param opacity
 */
setPlayerOpacity(playerId: PlayerId, opacity: number): void
/**
 * Set the level of viewable opacity by one player on another player
 * A simple helper that calls setOtherEntitySetting
 *
 * @param playerIdWhoViewsOpacityPlayer The player who sees that with opacity
 * @param playerIdOfOpacityPlayer The player/player model who is given opacity
 * @param opacity
 */
setPlayerOpacityForOnePlayer(playerIdWhoViewsOpacityPlayer: PlayerId, playerIdOfOpacityPlayer: PlayerId, opacity: number): void
/**
 * Obtain Date.now() value saved at start of current game tick
 */
now(): number
/**
 * Check your game (and, optionally, a entity) is still valid and executing.
 * Useful if you're using async functions and await within your game.
 * If you use await/async or promises and do not check this, your game could have closed and then the rest of your
 * async code executes.
 *
 * @param entityId
 */
checkValid(entityId?: PNull<EntityId>): boolean
/**
 * Let a player change a block at a specific co-ordinate. Useful when client option canChange is false.
 * Overrides blockRect and blockType settings, so also useful when you have disallowed changing of a block type with setCantChangeBlockType.
 * Using this on 1000s of blocks will cause lag - if that is needed, find a way to use setCanChangeBlockType.
 *
 * @param playerId
 * @param x
 * @param y
 * @param z
 */
setCanChangeBlock(playerId: PlayerId, x: number, y: number, z: number): void
/**
 * Prevents a player from changing a block at a specific co-ordinate. Useful when client option canChange is true.
 * Overrides blockRect and blockType settings, so also useful when you have allowed changing of a block type with setCantChangeBlockType.
 * Using this on 1000s of blocks will cause lag - if that is needed, find a way to use setCantChangeBlockType.
 *
 * @param playerId
 * @param x
 * @param y
 * @param z
 */
setCantChangeBlock(playerId: PlayerId, x: number, y: number, z: number): void
/**
 * Remove any previous can/cant change block settings for a player at a specific co-ordinate
 *
 * @param playerId
 * @param x
 * @param y
 * @param z
 */
resetCanChangeBlock(playerId: PlayerId, x: number, y: number, z: number): void
/**
 * Lets a player Change a block type. Valid names are any block name, including 'Air'
 * Less priority than cant change block pos/can change block rect
 *
 * @param playerId
 * @param blockName
 */
setCanChangeBlockType(playerId: PlayerId, blockName: BlockName): void
/**
 * Stops a player from changing a block type. Valid names are any block name, including 'Air'
 * Less priority than can change block pos/can change block rect
 *
 * @param playerId
 * @param blockName
 */
setCantChangeBlockType(playerId: PlayerId, blockName: BlockName): void
/**
 * Remove any previous can/cant change block type settings for a player
 *
 * @param playerId
 * @param blockName
 */
resetCanChangeBlockType(playerId: PlayerId, blockName: BlockName): void
/**
 * Make it so a player can Change blocks within two points. Coordinates are inclusive. E.g. if [0, 0, 0] is pos1
 * and [1, 1, 1] is pos2 then the 8 blocks contained within low and high will be able to be broken.
 * Overrides setCantChangeBlockType
 *
 *
 * @param playerId
 * @param pos1 Arg as [x, y, z]
 * @param pos2 Arg as [x, y, z]
 */
setCanChangeBlockRect(playerId: PlayerId, pos1: number[], pos2: number[]): void
/**
 * Make it so a player cant Change blocks within two points. Coordinates are inclusive. E.g. if [0, 0, 0] is pos1
 * and [1, 1, 1] is pos2 then the 8 blocks contained within pos1 and pos2 won't be able to be broken.
 * Overrides setCanChangeBlockType
 *
 *
 * @param playerId
 * @param pos1 Arg as [x, y, z]
 * @param pos2 Arg as [x, y, z]
 */
setCantChangeBlockRect(playerId: PlayerId, pos1: number[], pos2: number[]): void
/**
 * Remove any previous can/cant change block rect settings for a player
 *
 * @param playerId
 * @param pos1
 * @param pos2
 */
resetCanChangeBlockRect(playerId: PlayerId, pos1: number[], pos2: number[]): void
/**
 * Allow a player to walk through a type of block. For blocks that are normally solid and not seethrough, the player will experience slight visual glitches while inside the block.
 *
 *
 * @param playerId
 * @param blockName
 * @param disable If you've enabled a player to walk through a block and want to make the block solid for them again, pass this with true. Otherwise you only need to pass playerId and blockName
 */
setWalkThroughType(playerId: PlayerId, blockName: BlockName, disable?: boolean): void
/**
 * Allow a player to walk through (or not walk through) voxels that are located within a given rectangle.
 * For blocks that are normally solid and not seethrough, the player will experience slight visual glitches while inside the block.
 *
 * You could set both pos1 and pos2 to [0, 0, 0] to make only 0, 0, 0 walkthrough, for example.
 *
 * @param playerId
 * @param pos1 The one corner of the cuboid. Format [x, y, z]
 * @param pos2 The top right corner of the cuboid. Format [x, y, z]
 * @param updateType The type of update. Whether to make a rect solid, or able to be walked through.
 * Pass DEFAULT_WALK_THROUGH with a previously passed rect to disable any walkthrough setting for that rect.
 *
 */
setWalkThroughRect(playerId: PlayerId, pos1: number[], pos2: number[], updateType: WalkThroughType): void
/**
 * Give a player an item and a certain amount of that item.
 * Returns the amount of item added to the users inventory.
 *
 * @param playerId
 * @param itemName
 * @param itemAmount
 * @param attributes An optional object for certain types of item. For guns this can contain the shotsLeft field which is the amount of ammo the gun currently has.
 */
giveItem(playerId: PlayerId, itemName: ItemName, itemAmount?: number, attributes?: ItemAttributes): number
/**
 * Whether the player has space in their inventory to get new blocks
 * @param playerId
 */
inventoryIsFull(playerId: PlayerId): boolean
/**
 * Put an item in a specific index. Default hotbar is indexes 0-9
 *
 * @param playerId
 * @param itemSlotIndex 0-indexed
 * @param itemName Can be 'Air', in which case itemAmount will be ignored and the slot will be cleared.
 * @param itemAmount -1 for infinity. Should not be set, or null, for items that are not stackable.
 * @param attributes An optional object for certain types of item. For guns this can contain the shotsLeft field which is the amount of ammo the gun currently has.
 * @param tellClient whether to tell client about it - results in desync between client and server if client doesnt locally perform the same action
 */
setItemSlot(playerId: PlayerId, itemSlotIndex: number, itemName: ItemName, itemAmount?: PNull<number>, attributes?: ItemAttributes, tellClient?: boolean): void
/**
 * Remove an amount of item from a player's inventory
 *
 * @param playerId
 * @param itemName
 * @param amount
 */
removeItemName(playerId: PlayerId, itemName: ItemName, amount: number): void
/**
 * Get the item at a specific index
 * Returns null if there is no item at that index
 * If there is an item, return an object of the format { name: string; amount: PNull<number>; attributes: ItemAttributes; }
 *
 * @param playerId
 * @param itemSlotIndex
 */
getItemSlot(playerId: PlayerId, itemSlotIndex: number): PNull<InvenItem>
/**
 * Finds the index of a particular item in a player's inventory.
 *
 * @param playerId
 * @param itemName
 * @return The index of the item in the player's inventory, or null if the item is not found.
 */
findItem(playerId: PlayerId, itemName: ItemName): PNull<number>
/**
 * Whether a player has an item
 *
 * @param playerId
 * @param itemName
 * @returns bool
 */
hasItem(playerId: PlayerId, itemName: ItemName): boolean
/**
 * The amount of an itemName a player has.
 * Returns 0 if the player has none, and a negative number if infinite.
 *
 * @param playerId
 * @param itemName
 * @returns number
 */
getInventoryItemAmount(playerId: PlayerId, itemName: ItemName): number
/**
 * Clear the players inventory
 *
 * @param playerId
 */
clearInventory(playerId: PlayerId): void
/**
 * Force the player to have the ith inventory slot selected. E.g. newI 0 makes the player have the 0th inventory slot selected
 *
 * @param playerId
 * @param newI integer from 0-9
 */
setSelectedInventorySlotI(playerId: PlayerId, newI: number): void
/**
 * Get a player's currently selected inventory slot
 * @param playerId
 * @returns
 */
getSelectedInventorySlotI(playerId: PlayerId): number
/**
 * Get the currently held item of a player
 * Returns null if no item is being held
 * If an item is held, return an object of the format {name: itemName, amount: amountOfItem}
 *
 * @param playerId
 */
getHeldItem(playerId: PlayerId): PNull<InvenItem>
/**
 * Get the amount of free slots in a player's inventory.
 *
 * @param playerId
 * @returns number
 */
getInventoryFreeSlotCount(playerId: PlayerId): number
/**
 * Checks if a player is able to open a chest at a given location,
 * as per the rules laid out by the "onPlayerAttemptOpenChest" game callback.
 * Returns true if the player can open the chest, false if they cannot, and void if the chest does not exist.
 *
 * @param playerId
 * @param chestX
 * @param chestY
 * @param chestZ
 */
canOpenStandardChest(playerId: PlayerId, chestX: number, chestY: number, chestZ: number): PNull<boolean>
/**
 * Open a chest for a player.
 * If there is no chest, or the player cannot open it, do nothing.
 * WARNING: This may call "onPlayerAttemptOpenChest" to determine if the player has permission to open it. Using this function inside that callback risks infinite recursion.
 *
 * @param playerId
 * @param x
 * @param y
 * @param z
 */
openChestForPlayer(playerId: PlayerId, x: number, y: number, z: number): void
/**
 * Close a chest for a player.
 * If the player does not have a chest open, do nothing.
 *
 * @param playerId
 */
closeChestForPlayer(playerId: PlayerId): void
/**
 * Read a player's current crafting recipe set, keyed by output item name. Includes any
 * per-player overrides set via `editItemCraftingRecipes` / `removeItemCraftingRecipes`.
 *
 * @param playerId
 */
getCraftingRecipesForPlayer(playerId: PlayerId): Record<string, RecipesForItem>
/**
 * Give a standard chest an item and a certain amount of that item.
 * Returns the amount of item added to the chest.
 *
 * @param chestPos
 * @param itemName
 * @param itemAmount
 * @param playerId The player who is interacting with the chest.
 * @param attributes An optional object for certain types of item. For guns this can contain the shotsLeft field which is the amount of ammo the gun currently has.
 */
giveStandardChestItem(chestPos: number[], itemName: ItemName, itemAmount?: number, playerId?: PlayerId, attributes?: ItemAttributes): number
/**
 * Remove an amount of item from a standardChest inventory
 *
 * @param chestPos
 * @param itemName
 * @param amount
 * @param playerId The player who is interacting with the chest.
 */
removeItemNameFromStandardChest(chestPos: number[], itemName: ItemName, amount: number, playerId?: PlayerId): void
/**
 * Get the amount of free slots in a standard chest
 * Returns null for non-chests
 *
 * @param chestPos
 * @returns number
 */
getStandardChestFreeSlotCount(chestPos: number[]): PNull<number>
/**
 * The amount of an itemName a standard chest has.
 * Returns 0 if the standard chest has none, and a negative number if infinite.
 *
 * @param chestPos
 * @param itemName
 * @returns number
 */
getStandardChestItemAmount(chestPos: number[], itemName: ItemName): number
/**
 * Get the item at a chest slot. Null if empty otherwise format {name: itemName, amount: amountOfItem}
 *
 * @param chestPos
 * @param idx
 */
getStandardChestItemSlot(chestPos: number[], idx: number): PNull<InvenItem>
/**
 * Get all the items from a standard chest in order. Use this instead of repetitive calls to getStandardChestItemSlot
 *
 * @param chestPos
 */
getStandardChestItems(chestPos: number[]): PNull<InvenItem>[]
/**
 * @param chestPos
 * @param idx 0-indexed
 * @param itemName Can be 'Air', in which case itemAmount will be ignored and the slot will be cleared.
 * @param itemAmount -1 for infinity. Should not be set, or null, for items that are not stackable.
 * @param playerId The player who is interacting with the chest.
 * @param attributes An optional object for certain types of item. For guns this can contain the shotsLeft field which is the amount of ammo the gun currently has.
 */
setStandardChestItemSlot(chestPos: number[], idx: number, itemName: ItemName, itemAmount?: number, playerId?: PlayerId, attributes?: ItemAttributes): void
/**
 * Find the index of a particular item in a standard chest
 * @param chestPos
 * @param itemName
 */
findStandardChestItem(chestPos: number[], itemName: ItemName): PNull<number>
/**
 * Get the item in a player's moonstone chest slot. Null if empty
 *
 * Moonstone chests are a type of chest where a player accesses the same contents no matter the location of the moonstone chest
 *
 * @param playerId
 * @param idx
 */
getMoonstoneChestItemSlot(playerId: PlayerId, idx: number): PNull<InvenItem>
/**
 * Get all the items from a moonstone chest in order. Use this instead of repetitive calls to getMoonstoneChestItemSlot
 *
 * Moonstone chests are a type of chest where a player accesses the same contents no matter the location of the moonstone chest
 *
 * @param playerId
 */
getMoonstoneChestItems(playerId: PlayerId): PNull<InvenItem>[]
/**
 * Moonstone chests are a type of chest where a player accesses the same contents no matter the location of the moonstone chest
 *
 * @param playerId
 * @param idx 0-indexed
 * @param itemName Can be 'Air', in which case itemAmount will be ignored and the slot will be cleared.
 * @param itemAmount -1 for infinity. Should not be set, or null, for items that are not stackable.
 * @param metadata An optional object for certain types of item. For guns this can contain the shotsLeft field which is the amount of ammo the gun currently has.
 */
setMoonstoneChestItemSlot(playerId: PlayerId, idx: number, itemName: ItemName, itemAmount?: number, metadata?: ItemAttributes): void
/**
 * Store data about a block in a performant manner. Data is cleared when block changes.
 * E.g. chest
 * Works well with blocks marked tickable (e.g. wheat)
 *
 * @param x
 * @param y
 * @param z
 * @param data
 */
setBlockData(x: number, y: number, z: number, data: object): void
/**
 * Get stored data about a block in a performant manner. Data is cleared when block changes.
 * E.g. chest
 * Works well with blocks marked tickable (e.g. wheat)
 *
 * @param x
 * @param y
 * @param z
 */
getBlockData(x: number, y: number, z: number): any
/**
 * Get the name of the lobby this game is running in.
 */
getLobbyName(): string
/**
 * Integer lobby names are public
 * @returns boolean
 */
isPublicLobby(): boolean
/**
 * Returns if the current lobby the game is running in is special - e.g. a discord guild or dm, or simply a standard lobby
 */
getLobbyType(): LobbyType
/**
 * Update the progress bar in the bottom right corner.
 * Can be queued.
 *
 * @param playerId
 * @param toFraction The fraction of the progress bar you want to be filled up.
 * @param toDuration The time it takes for the bar to reach the given toFraction in ms.
 * If this is too low and you queue multiple updates, this toFraction could be skipped. Treat 200ms as a minimum.
 */
progressBarUpdate(playerId: PlayerId, toFraction: number, toDuration?: number): void
/**
 * This will initiate the MiddleScreenBar, starting at empty and filling up to full over the given duration.
 * Good to represent cooldowns (eg gun reload) or charged items (eg crossbow)
 *
 * @param playerId
 * @param duration ms over which the MiddleScreenBar fills up
 * @param chargeExpiresAutomatically Defaults to true. If true, the bar will disappear upon reaching full. If false, the bar will remain at full until hidden with removeMiddleScreenBar
 * @param horizontalBarRemOffset Offset the bar left or right (in css unit - rem)
 */
initiateMiddleScreenBar(playerId: PlayerId, duration: number, chargeExpiresAutomatically?: boolean, horizontalBarRemOffset?: number): void
/**
 * If there is any current middle screen bar running, this will hide it
 *
 * @param playerId
 */
removeMiddleScreenBar(playerId: PlayerId): void
/**
 * Show a hitmarker on the player's screen (the X-shaped crosshair flash indicating a successful hit).
 * Useful for custom weapons or things that need visual hit feedback.
 *
 * @param playerId The player to show the hitmarker to
 * @param isCrit If true, shows an enhanced critical-hit hitmarker with a longer, more dramatic animation
 * @param directionVector Optional [x, y, z] direction vector. When provided, the hitmarker appears
 *   at the projected screen position of that direction rather than at the centre of the screen.
 *   Same flow as mobile melee attacks where the tap point differs from screen centre.
 */
sendHitmarker(playerId: PlayerId, isCrit?: boolean, directionVector?: PNull<number[]>): void
/**
 * Show a directional arrow indicator on the player's screen pointing toward a world position.
 * When the position is off-screen the indicator is a rotating chevron at the screen edge.
 * When the position is on-screen it becomes a small marker dot.
 *
 * The arrow persists until explicitly cleared via `clearDirectionArrow`.
 * Calling again with the same `id` updates the existing arrow in-place.
 *
 * @param playerId The player to show the arrow to
 * @param id Unique identifier for this arrow (allows multiple concurrent arrows)
 * @param position [x, y, z] world position the arrow should point toward
 * @param text Optional label rendered below the indicator. Supports CustomTextStyling for rich text with icons/colours.
 * @param showDistance If true, displays the distance (in blocks) from the player to the arrow position.
 * @param style Optional style object (same format as CustomTextStyling's StyledText `style`). Controls chevron/marker colour, label typography, and opacity.
 */
setDirectionArrow(playerId: PlayerId, id: string, position: number[], text?: PNull<string | CustomTextStyling>, showDistance?: boolean, style?: PNull<TextStyle>): void
/**
 * Clear a directional arrow from the player's screen.
 *
 * @param playerId The player to clear the arrow for
 * @param id The arrow identifier to clear. If null, clears all arrows for this player.
 */
clearDirectionArrow(playerId: PlayerId, id?: PNull<string>): void
/**
 * Edit the crafting recipes for a player.
 *
 * @param playerId
 * @param itemName
 * @param recipesForItem
 */
editItemCraftingRecipes(playerId: PlayerId, itemName: ItemName, recipesForItem: RecipesForItem): void
/**
 * Reset the crafting recipes for a given back to its original bloxd state
 *
 * @param playerId
 * @param itemName Resets all crafting recipes for the given player if null, otherwise resets the crafting recipes for the given item.
 */
resetItemCraftingRecipes(playerId: PlayerId, itemName: PNull<string>): void
/**
 * Removes crafting recipes
 *
 * @param playerId
 * @param itemName Removes all crafting recipes for the given player if null, otherwise removes the crafting recipes for the given item.
 */
removeItemCraftingRecipes(playerId: PlayerId, itemName: PNull<string>): void
/**
 * Check if a position is within a cubic rectangle
 *
 * @param coordsToCheck
 * @param pos1 position of one corner
 * @param pos2 position of opposite corner
 * @param addOneToMax
 */
isInsideRect(coordsToCheck: number[], pos1: number[], pos2: number[], addOneToMax?: boolean): boolean
/**
 * Get the entities in the rect between [minX, minY, minZ] and [maxX, maxY, maxZ]
 *
 * @param minCoords
 * @param maxCoords
 * @returns
 */
getEntitiesInRect(minCoords: number[], maxCoords: number[]): EntityId[]
/**
 * @param entityId
 */
getEntityType(entityId: EntityId): EntityType
/**
 * Gets the item name of a dropped item
 *
 * @param itemEId - The ID of the dropped item from createItemDrop
 * @returns
 */
getItemDropName(itemEId: EntityId): PNull<ItemName>
/**
 * Deletes all items dropped in the world
 */
deleteAllItems(): void
/**
 * Create a mob herd. A mob herd represents a collection of mobs that move together.
 */
createMobHerd(): MobHerdId
/**
 * Try to spawn a mob into the world at a given position. Returns null on failure.
 * WARNING: Either the "onPlayerAttemptSpawnMob" or the "onWorldAttemptSpawnMob" game callback will be called
 * depending on whether "spawnerId" is provided. Calling this function inside those callbacks risks infinite recursion.
 * @param mobType
 * @param x
 * @param y
 * @param z
 * @param opts Includes:
 *  - mobHerdId The ID of this mob's herd. (A mob herd represents a collection of mobs that move together.)
 *  - spawnerId The ID of the player who tried to spawn this mob.
 *  - mobDbId A persistent ID for the mob. This can be useful when loading mob data from the database. If the DB ID is already taken, null will be returned.
 *  - name If set, gives the mob a name that will be displayed as a nametag above their head.
 *  - playSoundOnSpawn
 *  - variation
 *  - physicsOpts { width: number; height: number; collidesEntities: boolean }
 * @returns null if the mob could not be spawned.
 * This can happen when there are too many mobs in the world for the current number
 * of players in the lobby, or if the area is protected e.g. by spawn area protection.
 */
attemptSpawnMob<TMobType extends MobType>(mobType: TMobType, x: number, y: number, z: number, opts?: MobSpawnOpts<TMobType>): PNull<MobId>
/**
 * Dispose of a mob's state and remove them from the world without triggering "on death" flows.
 * Always succeeds.
 * @param mobId
 */
despawnMob(mobId: MobId): void
/**
 * Returns the current default value for a mob setting.
 *
 * @param mobType
 * @param setting
 */
getDefaultMobSetting<TMobType extends MobType, TMobSetting extends MobSetting>(mobType: TMobType, setting: TMobSetting): MobSettings<TMobType>[TMobSetting]
/**
 * Set the default value for a mob setting.
 * @param mobType
 * @param setting
 * @param value
 */
setDefaultMobSetting<TMobType extends MobType, TMobSetting extends MobSetting>(mobType: TMobType, setting: TMobSetting, value: MobSettings<TMobType>[TMobSetting]): void
/**
 * Get the current value of a mob setting for a specific mob.
 * @param mobId
 * @param setting
 * @param returnDefaultIfNotOverridden - If true, return the default setting if not overridden.
 */
getMobSetting<TMobSetting extends MobSetting>(mobId: MobId, setting: TMobSetting, returnDefaultIfNotOverridden?: boolean): MobSettings<MobType>[TMobSetting]
/**
 * Set the current value of a mob setting for a specific mob.
 * @param mobId
 * @param setting
 * @param value
 */
setMobSetting<TMobSetting extends MobSetting>(mobId: MobId, setting: TMobSetting, value: MobSettings<MobType>[TMobSetting]): void
/**
 * Get the number of mobs in the world.
 */
getNumMobs(): number
/**
 * Get the mob IDs of all mobs in the world.
 */
getMobIds(): MobId[]
/**
 * Gets the current AI state for the given mob.
 * @param mobId
 */
getMobAiState(mobId: MobId): { state: MobAiState; params: MobAiStateParams<MobAiState> }
/**
 * Sets the current AI state for the given mob.
 * Some AI states will require context such as the ID of the lifeform being chased.
 * @param mobId
 * @param state
 * @param params
 */
setMobAiState<TState extends MobAiState>(mobId: MobId, state: TState, params: MobAiStateParams<TState>): void
/**
 * Clears any aggro the mob has towards the given lifeform.
 * If the mob is currently chasing or running away from it, this also transitions the mob back to idle.
 * @param mobId
 * @param targetLifeformId
 */
passifyHostility(mobId: MobId, targetLifeformId: LifeformId): void
/**
 * Try to create a throwable entity.
 * Similar to creating a mesh entity and uses the same rate limiting.
 * However, this uses the predefined throwables system and physics used by throwable items with the game
 * Each throwable item has its own behaviour already, including default velocity, damage and gravity multipliers.
 *
 * @param throwerEId
 * @param itemName Must be an Item that is usually throwable in-engine
 * @param position Starting position
 * @param direction
 * @param velocityMult Multiplier for the default velocity of the throwable item
 * @param damageMult Multiplier for the default damage of the throwable item
 * @param gravityMult Multiplier for the default gravity of the throwable item
 * @param attributes item attributes (currently used only for the "Boomerag" item)
 * @returns null if throwable creation failed, otherwise the entity ID.
 */
attemptCreateThrowable(throwerEId: EntityId, itemName: ThrowableItem, position: [number, number, number], direction: [number, number, number], velocityMult?: number, damageMult?: number, gravityMult?: number, attributes?: ItemAttributes): string
/**
 * Delete a throwable entity before it automatically removes itself.
 * @param eId
 * @returns true if the entity was deleted, false if it was not a throwable entity
 */
deleteThrowable(eId: EntityId): boolean
/**
 * Try to create a mesh entity. This creates an entity whose mesh position is synced with clients.
 * Set entity position using setPosition
 * There is a limit to the number of mesh entities and throwables that can be created, with an even smaller limit for mesh entities with physics.
 * @param type
 * @param opts
 * @param name The default name for the nametag
 * @param physicsOptions Physics Options
 * @param initiatorId The entity that initiated the creation of the mesh entity.
 * @returns null if the entity creation failed, otherwise the entity ID.
 */
attemptCreateMeshEntity<MeshType extends MeshEntityType>(type: MeshType, opts: MeshEntityOpts[MeshType], name?: string, physicsOptions?: MeshEntityPhysicsOpts, initiatorId?: EntityId): PNull<EntityId>
/**
 * Update a mesh entity. If used on a non-mesh entity, will do nothing.
 *
 * @param eId
 * @param type
 * @param opts
 */
updateMeshEntity<MeshType extends MeshEntityType>(eId: EntityId, type: MeshType, opts: MeshEntityOpts[MeshType]): void
/**
 * Delete a mesh entity
 *
 * @param eId
 * @returns whether the api successfully deleted the meshEntity
 */
deleteMeshEntity(eId: EntityId): boolean
/**
 * Apply an impulse to an entity
 *
 * @param eId
 * @param xImpulse
 * @param yImpulse
 * @param zImpulse
 */
applyImpulse(eId: EntityId, xImpulse: number, yImpulse: number, zImpulse: number): void
/**
 * Get the velocity of an entity
 * Will return [0, 0, 0] if the entity doesn't have a physics body
 *
 * @param eId
 */
getVelocity(eId: EntityId): Pos
/**
 * Set the velocity of an entity
 *
 * @param eId
 * @param x
 * @param y
 * @param z
 */
setVelocity(eId: EntityId, x: number, y: number, z: number): void
/**
 * @deprecated use setEntityRotation
 * Set the heading for a server-auth entity.
 *
 * @param entityId
 * @param newHeading
 */
setEntityHeading(entityId: EntityId, newHeading: number): void
/**
 * @deprecated use getEntityRotation
 * Get the heading for a server-auth entity.
 *
 * @param entityId
 */
getEntityHeading(entityId: EntityId): number
/**
 * Get the rotation for a server-auth entity.
 *
 * @param entityId
 */
getEntityRotation(entityId: EntityId): Pos
/**
 * Set the rotation for a server-auth entity.
 *
 * @param entityId
 * @param xRotation
 * @param yRotation
 * @param zRotation
 */
setEntityRotation(entityId: EntityId, xRotation: number, yRotation: number, zRotation: number): void
/**
 * Set the amount of an item in an item entity
 *
 * @param itemId
 * @param newAmount
 */
setItemAmount(itemId: EntityId, newAmount: number): void
/**
 * Update the max players and soft max players matchmaking will use
 *
 * softMaxPlayers is the number of players that matchmaking will route to using "Quick Play".
 * Once the softMaxPlayers limit is reached, this lobby can only be joined by requesting the lobby name or joining a friend.
 *
 * maxPlayers is the absolute maximum: a lobby will not have more players than this.
 * Tip: softMaxPlayers should be around 90% of maxPlayers
 *
 * WARNING: This change is not immediate, as it takes a while for matchmaking to find out.
 * Also, this will not kick players out of the lobby if set to a lower value than the current player count.
 *
 * @param softMaxPlayers
 * @param maxPlayers
 */
setMaxPlayers(softMaxPlayers: number, maxPlayers: number): void
/**
 * Tell a player to disconnect from the current lobby and join a new one.
 *
 * To connect to a specific variation, format is `gamename_variation`.
 * For Custom Games, this will be `classic_playerSchematic|XXXXXXXXXX`.
 *
 * NOTE: Players won't disconnect immediately (they may play an ad before being redirected).
 *
 * @param playerId
 * @param game Defaults to the current game.
 * @param lobbyName Defaults to "Quick Play"
 */
matchmakePlayer(playerId: PlayerId, game?: string, lobbyName?: string): void
/**
 * Create and register the UI for the requested quicktime event (QTE) to the screen.
 * Handle the result via the onPlayerFinishQTE engine callback.
 *
 * @param playerId
 * @param qteParameters - includes type and parameters
 * @returns an id that can be passed to deleteQTE
 */
addQTE<T extends QTEType>(playerId: PlayerId, qteParameters: QTEClientParameters<T>): QTERequestId
/**
 * Delete a quicktime event from the screen
 *
 * @param playerId
 * @param id Returned from the addQTE request you want to cancel
 */
deleteQTE(playerId: PlayerId, id: QTERequestId): void
/**
 * Check whether the player has any qteRequests
 */
hasActiveQTE(playerId: PlayerId): boolean
/**
 * Show a message over the shop in the same place that a shop item's onBoughtMessage is shown.
 * Displays for a couple seconds before disappearing
 * Use case is to show a dynamic message when player buys an item
 *
 * @param playerId
 * @param info
 */
sendOverShopInfo(playerId: PlayerId, info: string | CustomTextStyling): void
/**
 * Open the shop UI for a player
 *
 * @param playerId
 * @param toggle Whether to close the shop if it's already open
 * @param forceCategoryKey If set, will change the shop to this category
 * @param onlyIfNonEmpty If true, will only open the shop if the category (or shop, if no category is provided) is non-empty
 */
openShop(playerId: PlayerId, toggle?: boolean, forceCategoryKey?: PNull<ShopCategoryKey>, onlyIfNonEmpty?: boolean): void
/**
 * Apply an effect to a lifeform.
 * Can be an inbuilt effect E.g. "Speed" (speed boost), "Damage" (damage boost).
 * For inbuilt just pass the name of the effect and the functionality is handled in-engine.
 * For custom effect, you pass customEffectInfo. The icon can be an InGameIconName or a bloxd item name.
 * The custom effect onEndCb is an optional helper within which you can undo the effect you applied.
 * Note that onEndCb will not work for press to code boards, code blocks or world code.
 *
 * @param lifeformId
 * @param effectName
 * @param duration
 * @param customEffectInfo
 */
applyEffect(lifeformId: LifeformId, effectName: string, duration: number | null, customEffectInfo: { icon?: IngameIconName | ItemName; onEndCb?: () => void; displayName?: string | TranslatedText } & Partial<InbuiltEffectInfo>): void
/**
 * Check if a lifeform has an effect.
 *
 * @param lifeformId
 * @param name
 * @param atOrAboveLevel Checks whether the effect is at or above the given level
 */
hasEffect(lifeformId: LifeformId, name: string, atOrAboveLevel?: number): boolean
/**
 * Get the level of an effect on a lifeform, or 0 if they don't have it.
 *
 * @param lifeformId
 * @param name
 */
getEffectLevel(lifeformId: LifeformId, name: string): number
/**
 * Get all the effects currently applied to a lifeform.
 *
 * @param lifeformId
 */
getEffects(lifeformId: LifeformId): string[]
/**
 * Remove an effect from a lifeform.
 *
 * @param lifeformId
 * @param name
 */
removeEffect(lifeformId: LifeformId, name: string): void
/**
 * Change a part of a player's skin.
 * UGC code is restricted to cosmetics from packs with ugcSelectable; internal code can use any cosmetics.
 * @param playerId Player to change
 * @param cosmeticType Type of cosmetic
 * @param cosmeticName Chosen cosmetic, will be made lowercase automatically
 */
changePlayerIntoSkin(playerId: PlayerId, cosmeticType: CosmeticType, cosmeticName: CosmeticName): void
/**
 * Remove gamemode-applied skin from a player
 * @param playerId
 */
removeAppliedSkin(playerId: PlayerId): void
/**
 * Get a single equipped cosmetic for a player.
 * @param playerId
 * @param cosmeticType Type of cosmetic
 */
getPlayerCosmetic(playerId: PlayerId, cosmeticType: CosmeticType): CosmeticName
/**
 * Scale node of a player's mesh by 3d vector.
 * State from prior calls to this api is lost so if you want to have multiple nodes scaled, pass in all the scales at once.
 *
 * @param playerId
 * @param nodeScales
 */
scalePlayerMeshNodes(playerId: PlayerId, nodeScales: EntityMeshScalingMap): void
/**
 *  Attach/detach mesh instances to/from an entity
 *  @param eId
 *  @param node node to attach to
 *  @param type if null, detaches mesh from this node
 *  @param opts
 *  @param offset
 *  @param rotation
 */
updateEntityNodeMeshAttachment<MeshType extends MeshEntityType>(eId: EntityId, node: EntityNamedNode, type: PNull<MeshType>, opts?: MeshEntityOpts[MeshType], offset?: Pos, rotation?: Pos): void
/**
 * Set the pose of the player
 * @param playerId
 * @param pose
 * @param poseOffset
 */
setPlayerPose(playerId: PlayerId, pose: PlayerPose, poseOffset?: Pos): void
/**
 * Set physics state of player (vehicle type and tier)
 * @param playerId
 * @param physicsState
 * @param positionOffset - Optional offset to adjust the player's collision box
 */
setPlayerPhysicsState(playerId: PlayerId, physicsState: PlayerPhysicsState<PhysicsType>, positionOffset?: Pos): void
/**
 * Get physics state for player
 * @param playerId
 */
getPlayerPhysicsState(playerId: PlayerId): PlayerPhysicsState<PhysicsType>
/**
 * Add following entity to player
 * @param playerId
 * @param eId
 * @param offset
 * @param followsPlayerRotation
 */
addFollowingEntityToPlayer(playerId: PlayerId, eId: EntityId, offset?: number[], followsPlayerRotation?: boolean): void
/**
 * Remove following entity from player
 * @param playerId
 * @param entityEId
 */
removeFollowingEntityFromPlayer(playerId: PlayerId, entityEId: EntityId): void
/**
 * Set camera zoom for a player
 * @param playerId
 * @param zoom
 */
setCameraZoom(playerId: PlayerId, zoom: number): void
/**
 * @param playerId hears the sound
 * @param soundName Can also be a prefix. If so, a random sound with that prefix will be played
 * @param volume 0-1. If it's too quiet and volume is 1, normalise your sound in audacity
 * @param rate The speed of playback. Also affects pitch. 0.5-4. Lower playback = lower pitch
 *        Good for varying the sound. E.g. item pickup sound has a random rate between 1 and 1.5.
 * @param posSettings
 * {playerIdOrPos: PlayerId | number[], maxHearDist: number, refDistance: number}
 * playerIdOrPos: The player the sound originates from, or the position of the sound
 * maxHearDist: sound is not played if player is further than this. Default 15
 * refDistance: higher means the sound decreases less in volume with distance. Default 3. Hitting is 4. Guns are 10
 *
 */
playSound(playerId: PlayerId, soundName: string, volume: number, rate: number, posSettings?: { playerIdOrPos: PlayerId | number[]; maxHearDist?: number; refDistance?: number; }): void
/**
 * See documentation for api.playSound
 */
broadcastSound(soundName: string, volume: number, rate: number, posSettings?: { playerIdOrPos: PlayerId | number[]; maxHearDist?: number; refDistance?: number; }, exceptPlayerId?: PlayerId): void
/**
 * See documentation for api.playSound
 */
playClientPredictedSound(soundName: string, volume: number, rate: number, posSettings?: { playerIdOrPos: PlayerId | number[]; maxHearDist?: number; refDistance?: number; }, predictedBy?: PlayerId): void

calcExplosionForce(eId: EntityId, explosionType: ExplosionType, knockbackFactor: number, explosionRadius: number, explosionPos: number[], ignoreProjectiles: boolean): { force: Pos; forceFrac: number; }
/**
 * Add a custom killfeed message to the killfeed
 * @param killer - The entity ID or a custom name and colour for the killer
 * @param victim - The entity ID or a custom name and colour for the victim
 * @param withItem - The item used
 */
addCustomKillfeedMessage(killer: { eId: EntityId } | { name: string; colour: string }, victim: { eId: EntityId } | { name: string; colour: string }, withItem: string): void
/**
 * Get the position of a player's target block and the block adjacent to it (e.g. where a block would be placed)
 *
 *
 * Note: This position is a tick ahead of the client's block target info (noa.targetedBlock),
 * since the client updates the blocktarget before the entities tick (and since it uses the renderposition of the camera)
 *
 * This normally doesn't matter but if you are client predicting something based on noa.targetedBlock
 * (currently only applicable to in-engine code), you should not verify using this
 *
 * @param playerId
 */
getPlayerTargetInfo(playerId: PlayerId): { position: Pos; normal: Pos; adjacent: Pos }
/**
 * Get the position of a player's camera and the direction (both in Euclidean and spherical coordinates) they are attempting to use an item.
 * The camPos has the same limitations described in getPlayerTargetInfo
 *
 * @param playerId
 */
getPlayerFacingInfo(playerId: PlayerId): { camPos: Pos; dir: Pos; angleDir: AngleDir; moveHeading: number }
/**
 * Raycast for a block in the world.
 * Given a position and a direction, find the first block that the "ray" hits.
 *
 * @param fromPos
 * @param dirVec
 */
raycastForBlock(fromPos: number[], dirVec: number[]): BlockRaycastResult
/**
 * Prevents the player from taking fall damage next time they land on the ground
 * @param playerId
 */
preventFallDamageNextGrounding(playerId: PlayerId): void
/**
 * Check whether a player is crouching
 *
 * @param playerId
 */
isPlayerCrouching(playerId: PlayerId): boolean
/**
 * Get the aura info for a player
 * @param playerId
 */
getAuraInfo(playerId: PlayerId): { level: number; totalAura: number; auraPerLevel: number }
/**
 * Sets the total aura for a player. Will not go over max level or under 0
 * @param playerId
 * @param totalAura
 */
setTotalAura(playerId: PlayerId, totalAura: number): void
/**
 * Set the aura level for a player - shortcut for setTotalAura(level * auraPerLevel)
 * @param playerId
 * @param level
 */
setAuraLevel(playerId: PlayerId, level: number): void
/**
 * Add (or remove if negative) aura to a player. Will not go over max level or under 0
 * @param playerId
 * @param auraDiff
 * @returns The actual change in aura
 */
applyAuraChange(playerId: PlayerId, auraDiff: number): number
/**
 * Updates the particle systems of multiple mesh entities at specified nodes
 * @param updates
 */
updateMeshParticleSystems(updates: MeshParticleSystemUpdates): void
/**
 * Gets a database value that is saved per lobby.
 * @param key
 */
getLobbyDbValue(key: string): PNull<string | number>
/**
 * Sets a database value that is saved per lobby. This persists between sessions.
 * @param key
 * @param value
 */
setLobbyDbValue(key: string, value: string | number): void
/**
 * Deletes a database value that is saved per lobby.
 * @param key
 */
deleteLobbyDbValue(key: string): void
/**
 * Deletes all database values that are saved per lobby.
 */
deleteAllLobbyDbValues(): void
/**
 * Gets a database value that is saved per player.
 * @param playerId
 * @param key
 */
getPlayerDbValue(playerId: PlayerId, key: string): PNull<string | number>
/**
 * Sets a database value that is saved per player. This persists between sessions and between lobbies for custom games.
 * @param playerId
 * @param key
 * @param value
 */
setPlayerDbValue(playerId: PlayerId, key: string, value: string | number): void
/**
 * Deletes a database value that is saved per player.
 * @param playerId
 * @param key
 */
deletePlayerDbValue(playerId: PlayerId, key: string): void
/**
 * Deletes all database values that are saved per player.
 * @param playerId
 */
deleteAllPlayerDbValues(playerId: PlayerId): void
/**
 * Set a default value to be returned by your callback code if it throws an error.
 *
 * @param cbName The name of the callback to set the default value for.
 * @param value The default value to return.
 */
setCallbackValueFallback(cbName: UserCallbacks, value: any): void
/**
 * Set the gamemode of a player. This is persistent across lobbies for custom games.
 *
 * @param playerId The ID of the player to set the gamemode of.
 * @param gamemode The gamemode to set the player to.
 */
setPlayerGamemode(playerId: PlayerId, gamemode: WorldGamemode): void
/**
 * Get the gamemode of a player.
 *
 * @param playerId The ID of the player to get the gamemode of.
 * @returns The gamemode of the player.
 */
getPlayerGamemode(playerId: PlayerId): WorldGamemode
/**
 * Returns true if your code is about to be interrupted for exceeding its time budget.
 * Use this to break up long-running code into smaller chunks.
 *
 *
 * ### Example:
 * ```js
 * // Resume from where we stopped last time (or 0 on the first run)
 * let savedLoopCounter = 0
 *
 * // ...
 *
 * for (let i = savedLoopCounter; i < 1000; i++) {
 * 	if (api.isNearInterrupt()) {
 * 		// Out of time - remember our progress and stop before getting killed
 * 		savedLoopCounter = i
 * 		break
 * 	}
 *
 * 	someExpensiveFunction()
 * }
 * ```
 */
isNearInterrupt(): boolean
/**
 * Schedule small text to be displayed in the middle of the screen (middleTextLower).
 * This text will be removed after the duration.
 * Stacking queued texts will schedule them to be displayed one after the other.
 * NOTE: Overriding the middleTextLower client option may cause queued texts to be displayed incorrectly.
 *
 * @param playerId The ID of the player to display the text to.
 * @param text The text to display.
 * @param duration The duration of the text in milliseconds.
 * @returns The ID of the queued command.
 */
queueMiddleTextLower(playerId: PlayerId, text: string | CustomTextStyling, duration: number): QueuedCommandId
/**
 * Schedule large text to be displayed in the middle of the screen (middleTextUpper).
 * This text will be removed after the duration.
 * Stacking queued texts will schedule them to be displayed one after the other.
 * NOTE: Overriding the middleTextUpper client option may cause queued texts to be displayed incorrectly.
 *
 * @param playerId The ID of the player to display the text to.
 * @param text The text to display.
 * @param duration The duration of the text in milliseconds.
 * @returns The ID of the queued command.
 */
queueMiddleTextUpper(playerId: PlayerId, text: string | CustomTextStyling, duration: number): QueuedCommandId
/**
 * Schedule text to be displayed in the crosshair.
 * This text will be removed after the duration.
 * Stacking queued texts will schedule them to be displayed one after the other.
 * NOTE: Overriding the crosshairText client option may cause queued texts to be displayed incorrectly.
 *
 * @param playerId The ID of the player to display the text to.
 * @param text The text to display.
 * @param duration The duration of the text in milliseconds.
 * @returns The ID of the queued command.
 */
queueCrosshairText(playerId: PlayerId, text: string | CustomTextStyling, duration: number): QueuedCommandId
/**
 * Get the status of a queued command.
 *
 * @param id The ID of the queued command to get the status of.
 * @returns NOT_IN_QUEUE, WAITING_TO_RUN, or CURRENTLY_RUNNING.
 */
getQueuedStatus(id: QueuedCommandId): QueuedStatusString
/**
 * Remove a queued command from the queue.
 *
 * @param id The ID of the queued command to remove.
 */
removeFromQueue(id: QueuedCommandId): void
/**
 * Log a message to chat.
*/
log(message: string): void

	}
	/** Game API */
	declare const api: GameApi;

type EntityId = string
type Pos = [number, number, number]
type PlayerId = LifeformId
type LifeformId = EntityId
type PNull<T> = T | null
type PlayerDbId = string
type LifeformBodyPart = (_TypeOf["lifeformBodyParts"])[number]
interface PlayerAttemptDamageOtherPlayerOpts {
	eId: PlayerId
	hitEId: PlayerId
	attemptedDmgAmt: number
	withItem: string
	bodyPartHit?: LifeformBodyPart
	attackDir?: number[]
	showCritParticles?: boolean
	reduceVerticalKbVelocity?: boolean
	horizontalKbMultiplier?: number
	verticalKbMultiplier?: number
	broadcastEntityHurt?: boolean
	attackCooldownSettings?: PNull<{ type: string; cooldownMs: number }>
	hittingSoundOverride?: HittingSoundOverride
	ignoreOtherEntitySettingCanAttack?: boolean
	isTrueDamage?: boolean
	// The damaging playerDbId. If null, will default to the dbId of \`eId\`
	damagerDbId?: PNull<PlayerId>
}
type WorldGamemode = "survival" | "creative" | "peaceful" | "survivaladventure" | "peacefuladventure" | "spectator"
type HittingSoundOverride = { sound: string; volume: number; pitch: number }
type CustomTextStyling = (string | EntityName | TranslatedText | StyledIcon | StyledText)[]
type EntityName = {
	entityName: string
	ranks?: Readonly<Rank[]>
	style?: {
		color?: string
		colour?: string
	}
}
type Rank = (_TypeOf["ranks"])[number]
type TranslatedText = {
	translationKey: string
	params?: Record<string, string | number | boolean | EntityName>
}
type StyledIcon = {
	icon: string
	style?: {
		color?: string
		colour?: string
		fontSize?: FontSize
		opacity?: number
	}
}
type FontSize = string
type StyledText = {
	str: string | EntityName | TranslatedText
	style?: TextStyle
	clickableUrl?: string
}
type TextStyle = {
	color?: string
	colour?: string
	fontWeight?: string
	fontSize?: FontSize
	fontStyle?: string
	opacity?: number
}
type ClientOption = keyof ClientOptions
type EarthSkyBox = {
	type: "earth"
	inclination?: number
	turbidity?: number
	infiniteDistance?: boolean
	luminance?: number
	yCameraOffset?: number
	azimuth?: number
	// Not part of sky model by default; heavily tint to a vertex color
	vertexTint?: [number, number, number]
}
type LobbyLeaderboardInfo = Record<
	string,
	{
		displayName?: string | CustomTextStyling
		hidden?: boolean
		sortOrder?: "ascending" | "descending" // No value means descending
		sortPriority?: number
	}
>
type ShopCategoryKey = string
type ShopItemKey = string
type ShopItem = {
	image: string
	schematicId?: SchematicId
	cost?: number
	currency?: string
	amount?: number // Display amount shown on the shop tile image (0 and 1 are not displayed)
	imageColour?: string
	canBuy?: boolean
	isSelected?: boolean
	buyButtonText?: string | CustomTextStyling
	customTitle?: string | CustomTextStyling
	description?: string | CustomTextStyling
	onBoughtMessage?: string | CustomTextStyling
	redDot?: boolean
	forceRemoveRedDot?: boolean
	isRewardedAd?: boolean
	badge?: { text: string | CustomTextStyling; type: ShopItemBadgeType }
	userInput?: ShopItemUserInput

	// Not defined on client, must be defined on server
	boughtCallback?: (
		playerId: PlayerId,
		cost: number,
		currency: string,
		categoryKey: ShopCategoryKey,
		itemKey: ShopItemKey,
		userInput: string,
		amount: number | undefined,
	) => void
	sell?: boolean // Optional, defaults to false. If true, the sign of "cost" is flipped. So a "cost" of -25 would give the player 25 currency AND be displayed as "25" (instead of -25)
	sortPriority?: number // Descending, bigger number means closer to the top
	hidden?: boolean
}
type ShopItemUserInput =
	| { type: "text"; placeholderText?: string; wordCharsOnly?: boolean; initialValue?: string } // wordCharsOnly defaults to false. If true, only allows \w character (alphanumeric and _). initialValue always takes precedence as the text input value when set.
	| { type: "number"; placeholderText?: string; initialValue?: string }
	| {
			type: "dropdown"
			dropdownOptions: readonly (string | { option: string; cost: number })[]
			shouldResetSelectionOnOptionsChange?: boolean // Defaults to false. If true, the selection will reset to the first option when dropdownOptions changes.
			initialValue?: string
	  }
	| { type: "player"; excludedPlayers?: PlayerId[] } // Defaults to excluding the current player
	| { type: "color"; initialValue?: string }
type SchematicId = string
type ShopItemBadgeType = (_TypeOf["shopItemBadgeTypes"])[number]
type ShopCategoryConfig = Partial<{
	autoSelectCategory: boolean
	customTitle: string // Supports translation keys and ordinary text
	redDot: boolean
	forceRemoveRedDot: boolean
	sortPriority: number
	description: string | CustomTextStyling
}>
type OtherEntitySetting = keyof OtherEntitySettings
type EntityMeshScalingMap = {
	[key in EntityNamedNode]?: number[]
}
type EntityNamedNode = PlayerMeshNamedNode
type PlayerMeshNamedNode = (_TypeOf["playerMeshNamedNodes"])[number]
type LobbyLeaderboardValues = Record<string, string | number | CustomTextStyling>
type NameTagInfo = {
	backgroundColor?: string
	content?: (CustomTextStyling[number] | RankInfo)[]
	subtitle?: (CustomTextStyling[number] | RankInfo)[]
	subtitleBackgroundColor?: string
}
type RankInfo = {
	// Font Awesome icon name
	icon: string
	mainRGB: string
	// Defaults to mainRGB
	bracketRGB?: string
	chatTag: {
		str: string
		// Defaults to mainRGB
		strRGB?: string
	}[]
	// Defaults to none
	nameTag: {
		// Defaults to normal name colour (white)
		iconRGB?: string
		// Defaults to none
		iconShadowRGB?: string
	}
	visible: boolean // If false, this rank will not be shown in the player list or in the chat
}
type TempParticleSystemOpts = ParticleSystemOpts & {
	dir1: number[]
	dir2: number[]
	pos1: number[]
	pos2: number[]
	manualEmitCount: number
	hideDist: number
}
type ParticlePresetOpts = {
	presetId: ParticlePresetId
	pos1: number[]
	pos2: number[]
}
type ParticleSystemOpts = {
	texture: string
	minLifeTime: number
	maxLifeTime: number
	minEmitPower: number
	maxEmitPower: number
	minSize: number
	maxSize: number
	gravity: number[]
	velocityGradients: VelocityGradient[]
	colorGradients: TimeColorGradient[] | RandomColorGradient[]
	blendMode: ParticleSystemBlendMode
}
type VelocityGradient = {
	timeFraction: number
	factor: number
	factor2: number
}
type TimeColorGradient = {
	timeFraction: number
	minColor: [number, number, number, number]
	maxColor?: [number, number, number, number]
}
type RandomColorGradient = {
	color: [number, number, number]
}
type ParticlePresetId = keyof _TypeOf["particlePresets"]
type AnimationSchema = Readonly<{
	animationDurationMs: number
	loop?: LoopModeSchema
	nodeAnimations?: NodeSkeletonAnimationSchema
}>
type BlockbenchAnimationSchema = Readonly<{
	animation_length: number // The duration of the animation in seconds.
	loop?: BlockbenchLoopModeSchema
	bones?: BlockbenchBonesAnimationSchema
}>
type LoopModeSchema = boolean | "hold-on-last-frame"
type AnimationTimelineSchema = readonly KeyframeSchema[]
type KeyframeSchema = Readonly<{
	timeFraction: number
	rotation?: LerpPointSchema // Rotations are assumed to be in radians.
}>
type LerpPointSchema =
	| Point
	| Readonly<{
			lerpMode?: LerpModeSchema
			point: Point
	  }>
	| Readonly<{
			lerpMode?: LerpModeSchema
			pre: Point // When lerping towards a point, we lerp towards its pre.
			post: Point // When lerping away from a point, we lerp away from its post.
	  }>
type Point = Readonly<Vec3>
type LerpModeSchema = "linear" | "catmull-rom-spline"
type Vec3 = [number, number, number]
type BlockbenchLoopModeSchema = boolean | "hold_on_last_frame"
type BlockbenchAnimationTimelineSchema = Point | Readonly<Record<TimestampString, BlockbenchAnimationFrameSchema>>
type TimestampString = string
type BlockbenchAnimationFrameSchema =
	| Point
	| Readonly<{
			lerp_mode?: BlockbenchLerpModeSchema
			pre?: Point // When lerping towards a point, we lerp towards its pre.
			post: Point // When lerping away from a point, we lerp away from its post.
	  }>
type BlockbenchLerpModeSchema = "linear" | "catmullrom"
type NodeSkeletonAnimationSchema = Readonly<Record<NodeName, NodeAnimationSchema>>
type NodeName = string
type NodeAnimationSchema = Readonly<{
	timeline: AnimationTimelineSchema
}>
type BlockbenchBonesAnimationSchema = Readonly<Record<NodeName, BlockbenchBoneAnimationSchema>>
type BlockbenchBoneAnimationSchema = Readonly<{
	rotation?: BlockbenchAnimationTimelineSchema // Blockbench rotations are in degrees.
}>
type BlockName = string
type BlockId = number
type WorldBlockChangedInfo = {
	cause: PNull<WorldBlockChangedCause>
}
type WorldBlockChangedCause = "Paintball" | "FloorCreator" | "Sapling" | "StemFruit" | "MeltingIce" | "Explosion"
type GameChunk = {
	blockData: any
	extraInfo: PersistedExtraInfo
}
type PersistedExtraInfo = {
	specialBlocks: any[]
	entities: any[]
	// We allow games and plugins to store custom metadata in the chunk,
	// but that metadata should be:
	// - minimal, to avoid issues where the chunk is too large to store;
	// - updated infrequently, to avoid excessive writes to the DB.
	customMetadata: any
}
type ItemName = string
type ItemAttributes = { customDisplayName?: string; customDescription?: string; customAttributes?: Record<string, any> }
type ItemDropOptions = Readonly<
	Partial<{
		doPhysics: boolean
		size: number
	}>
>
type AnimParams = { animTextures: string[]; animationInterval: number }
type HarvestType = "granule" | "wood" | "rock" | "cuttable"
type RecursiveReadonlyObject<T> = {
	readonly [P in keyof T]: RecursiveReadonly<T[P]>
}
type RecursiveReadonly<T> = T extends (infer R)[]
	? RecursiveReadonlyArray<R>
	: T extends Function
		? T
		: T extends object
			? RecursiveReadonlyObject<T>
			: T
type RecursiveReadonlyArray<T> = ReadonlyArray<RecursiveReadonly<T>>
type SoundType = "stone" | "wood" | "gravel" | "grass" | "glass" | "sand" | "snow" | "cloth"
type GunStatsOverride = Partial<Pick<GunMetadata, GunStatsOverrideKey>>
type GunMetadata = {
	gunType: string
	scopeType: "none" | "sniper"
	muzzleFlashOffsetFromGun: [number, number, number]
	muzzleFlashScale?: number
	autoFireWithMouse: boolean
	fireRate: number
	fireRateWithHeldTouch?: number
	damage: number
	shotPelletCount?: number
	reloadTime?: number
	clipSize: number
	reloadBulletsIndividually?: boolean
	bulletReloadTime?: number
	cockTime?: number
	tagSpeedMult: number
	subsequentTagSpeedReductionScalar: number
	inaccuracyStanding: number
	inaccuracyFromShot: number
	inaccuracyMovement: number
	yVelocityInaccuracy: number
	inaccuracyFromJump: number
	altInaccuracyStanding: number
	altInaccuracyFromShot: number
	altInaccuracyMovement: number
	recoveryRate: number

	msPerRound?: number // calculated below
	msPerRoundTouchScreen?: number // calculated below

	altYVelocityInaccuracy?: number
	altInaccuracyFromJump?: number

	hasVerticalInaccuracy?: boolean

	aimZoomFactor?: number

	// Kickback
	kickbackDecreaseRate: number
	minKickback?: number
	maxKickback?: number
	kickbackRate?: number
}
type GunStatsOverrideKey =
	| "scopeType"
	| "fireRate"
	| "damage"
	| "clipSize"
	| "reloadTime"
	| "bulletReloadTime"
	| "cockTime"
	| "kickbackDecreaseRate"
	| "minKickback"
	| "maxKickback"
	| "kickbackRate"
	| "inaccuracyStanding"
	| "inaccuracyFromShot"
	| "inaccuracyMovement"
	| "yVelocityInaccuracy"
	| "inaccuracyFromJump"
	| "altInaccuracyStanding"
	| "altInaccuracyFromShot"
	| "altInaccuracyMovement"
	| "altYVelocityInaccuracy"
	| "altInaccuracyFromJump"
	| "recoveryRate"
type WeaponComboInfo = Readonly<{
	comboWindowMs: number
	comboMultipliers: readonly number[]
	backstabAngle?: number // If present, hitting an enemy from behind within this angle (radians) skip to end of combo
}>
type AnyMetadataItem = Partial<BlockMetadataItem & NonBlockMetadataItem>
type CustomItemStat = (_TypeOf["customItemStats"])[number]
type InvenItem = { name: string; amount: PNull<number>; attributes: ItemAttributes; typeObj: any }
type RecipesForItem = RecursiveReadonly<
	{
		requires: { items: ItemName[]; amt: number }[]
		produces: number
		station?: string | string[]
		onCraftedAura?: number
		isStarterRecipe?: boolean
	}[]
>
type EntityType = PNull<NetworkedEntityType | "Mesh" | "Item">
type NetworkedEntityType = LifeformType | ThrowableItem | string | string
type LifeformType = (_TypeOf["lifeformTypes"])[number]
type ThrowableItem = string
type MeshEntityType = keyof MeshEntityOpts
type MeshEntityOptsStringified = string
type MeshEntityOpts = {
	Box: CommonMeshEntityOpts & {
		width: number
		height: number
		depth: number
		diffuseColor?: number[]
		emissiveColor?: number[]
		backFaceCulling?: boolean // Default true
		texture?: string // Can be a blockname. Wraps every one block
		faceUV?: number[][]
	}
	BloxdBlock: CommonMeshEntityOpts & {
		blockName: BlockNameOrId
		size: number | [number, number, number]
	}
	Person: CommonMeshEntityOpts & {
		size?: number
		textures?: Partial<Cosmetics>
		pose?: PlayerPose
	}
	ParticleEmitter: MeshParticleSystemOpts
}
type CommonMeshEntityOpts = {
	hideDist?: number
	meshOffset?: number[]
	autoRotate?: boolean
	lineToEId?: EntityId // EntityId to connect to using a line
}
type BlockNameOrId = BlockName | BlockId
type Cosmetics = Record<CosmeticType, CosmeticName>
type PlayerPose = (_TypeOf["playerPoses"])[number]
type MeshParticleSystemOpts = ParticleSystemOpts &
	CommonMeshEntityOpts & {
		height: number
		width: number
		depth: number
		emitRate: number
		dir1?: number[]
		dir2?: number[]
	}

type MeshParticleSystemUpdates = MeshParticleSystemOpts
type CosmeticType = (_TypeOf["cosmeticTypes"])[number]
type CosmeticName = string
type MobHerdId = number
type MobType = (_TypeOf["mobTypes"])[number]
type MobSpawnOpts<TMobType extends MobType> = Partial<{
	mobHerdId: MobHerdId
	spawnerId: PlayerId
	mobDbId: MobDbId
	name: string
	playSoundOnSpawn: boolean
	variation: MobVariation<TMobType>
	physicsOpts: Partial<{
		width: number
		height: number
		collidesEntities: boolean
	}>
}>
type MobVariation<TMobType extends MobType> = (_TypeOf["mobVariations"])[TMobType][number]
type MobId = LifeformId
type MobDbId = string
type MobSetting = (_TypeOf["mobSettings"])[number]
type MobSettings<TMobType extends MobType> = {
	variation: MobVariation<TMobType>
	name: string
	maxHealth: number
	initialHealth: number
	idleSound: PNull<string>
	attackSound: PNull<string>
	secondaryAttackSound: PNull<string>
	hurtSound: PNull<string>
	onDeathItemDrops: readonly MobItemDrop[]
	onDeathParticleTexture: string
	onDeathAura: number
	baseWalkingSpeed: number
	baseRunningSpeed: number
	walkingSpeedMultiplier: number
	runningSpeedMultiplier: number
	jumpCount: number
	baseJumpImpulseXZ: number
	baseJumpImpulseY: number
	jumpMultiplier: number
	runAwayRadius: number
	chaseRadius: number
	territoryRadius: number
	hostilityRadius: number
	stoppingRadius: number
	attackInterval: number
	attackRadius: number
	secondaryAttackRadius: number
	attackDamage: number
	secondaryAttackDamage: number
	attackImpulse: number
	secondaryAttackImpulse: number
	burstAttackInfo: PNull<MobBurstAttackInfo>
	secondaryBurstAttackInfo: PNull<MobBurstAttackInfo>
	heldItemName: PNull<string>
	attackItemName: PNull<string>
	secondaryAttackItemName: PNull<string>
	swingArmOnAttack: boolean
	swingArmOnSecondaryAttack: boolean
	attackEffectName: PNull<string>
	attackEffectDuration: number
	warpTargetSpecialAttackInfo: PNull<MobWarpTargetSpecialAttackInfo>
	combatTetherInfo: PNull<MobCombatTetherCombatInfo>
	evadeInfo: PNull<MobEvadeInfo>
	tameInfo: PNull<Readonly<MobTameInfo>>
	onTamedHealthMultiplier: number
	petInfo: Readonly<MobPetInfo> // Instance-specific information related to mob feeding
	ownerDbId: PNull<PlayerDbId>
	minFollowingRadius: number
	maxFollowingRadius: number
	isRideable: boolean
	healthRegen: PNull<MobHealthRegenSettings>
	ridingSpeedMult: number
	metaInfo: string
}
type MobItemDrop = Readonly<{
	itemName: string
	probabilityOfDrop: number

	// If a mob drops an item, then we choose a random amount within these bounds.
	dropMinAmount: number
	dropMaxAmount: number

	// If true, the item will "burst" out of the mob rather than just dropping.
	applyBurstImpulseToDrop?: boolean
}>
type MobBurstAttackInfo = Readonly<{
	burstAttackIntervals: readonly number[]
}>
type MobWarpTargetSpecialAttackInfo = Readonly<{
	cooldown: number
	range: number
	sound: PNull<string>
	delay: number
	minDestinationRadius: number
	maxDestinationRadius: number
	swingArm: boolean
	particleOpts: PNull<TempMobParticleOpts>
}>
type MobCombatTetherCombatInfo = Readonly<{
	range: number
	particleOpts: MobParticleOpts
}>
type MobEvadeInfo = Readonly<{
	probability: number
	impulse: number
	minAngle: number
	maxAngle: number
}>
type MobTameInfo = {
	tameItemName: string | readonly string[]
	probabilityOfTame: number
	isSaddleable?: boolean
	saddleItemName?: string
	foodItemNames?: readonly string[]
	foodItemsWithEffects?: readonly Readonly<ItemNameWithEffects>[]
	supportsFriendship?: boolean
	likedFoods?: readonly string[]
	neutralFoods?: readonly string[]
	dislikedFoods?: readonly string[]
	guaranteedDrop?: ItemName
	commonDrops?: ItemName[]
	levelUpBonuses?: LevelUpBonuses
}
type MobPetInfo = {
	friendshipPoints: number
	lastFedAt: number
	highestFriendshipLevelReached: MobFeedLevel
	superlikedFood: PNull<ItemName>
	superlikedFoodKnown: boolean
	bonusesGained: readonly MobLevelUpBonus[]
}
type MobHealthRegenSettings = Readonly<{
	amount: number
	interval: number
	startAfter: number
}>
type TempMobParticleOpts = Readonly<{
	duration: number
}> &
	MobParticleOpts
type MobParticleOpts = Readonly<Pick<MeshParticleSystemOpts, "texture" | "colorGradients">>
type ItemNameWithEffects = { itemName: string; effects: readonly Readonly<EffectOpts>[]; healAmt?: number }
type LevelUpBonuses = RecursiveReadonly<Record<MobFeedLevelUpLevels, MobLevelUpBonus>>
type EffectOpts = { name: PotionEffect; duration: number; level: number }
type PotionEffect = (_TypeOf["potionEffects"])[number]
type MobFeedLevelUpLevels = Exclude<MobFeedLevel, 0>
type MobLevelUpBonus = (_TypeOf["mobLevelUpBonuses"])[number]
type MobFeedLevel = InclusiveRange<_TypeOf["MAX_MOB_FEED_LEVEL"]>
type InclusiveRange<N extends number, Arr extends number[] = []> = Arr["length"] extends N
	? Arr[number] | Arr["length"]
	: InclusiveRange<N, [...Arr, Arr["length"]]>
type MobAiState = (_TypeOf["mobAiStates"])[number]
type MobAiStateParams<TState extends MobAiState> = MobWorldView[TState]
type MobWorldView = {
	// The mob is stood still, but it still has awareness of its environment.
	// For example: if the mob is hostile, it will still chase and attack nearby players.
	idle: null
	// The mob is stood still, and it has no awareness of its environment.
	// It will not even react if provoked.
	disabled: null
	// The mob is stood still (idle) and is about to turn.
	idleBeforeTurning: null
	// The mob has chosen a new direction at random and is turning to face it.
	turning: null
	// The mob is stood still (idle) and is about to walk.
	idleBeforeWalking: null
	// The mob is walking in the direction it is facing.
	walking: null
	// The mob is running away from the target lifeform.
	runningAway: { targetId: LifeformId }
	// The mob is chasing the target lifeform.
	chasing: { targetId: LifeformId }
	// The mob is following the target lifeform.
	// It will stop if it is within the \`minFollowingDistance\` (mob setting) of the target,
	// and teleport to the target if it is outside the \`maxFollowingDistance\` (mob setting) of the target.
	following: { targetId: LifeformId }
	// The mob is stood still looking at the target.
	watching: { targetId: LifeformId }
	// The mob is walking towards the position.
	// It will stop if it is within the \`stoppingRadius\` (mob setting) of the position.
	walkingToPosition: { pos: Pos }
	// The mob is running towards the position.
	// It will stop if it is within the \`stoppingRadius\` (mob setting) of the position.
	runningToPosition: { pos: Pos }
}
type MeshEntityPhysicsOpts = {
	doPhysics: boolean
	onCollideTerrain?: () => void // Unsupported for custom code
	collidesEntities?: boolean
	collideBits?: number // bitmask category of this entity
	collideMask?: number // bitmask category of entities this entity collides with
	heightExpandAmt?: number // expand hitbox height by this amount
	widthExpandAmt?: number // expand hitbox width by this amount
	vehicleOpts?: MeshEntityVehicleOpts // Unsupported for custom code
}
type MeshEntityVehicleOpts = {
	/** Physics state the player transitions to when entering this entity. */
	physicsState: PlayerPhysicsStateData
	/** Item to drop when punched. Omit for game-mode vehicles that shouldn't be breakable. */
	itemDrop?: string
}
type PlayerPhysicsStateData = { type: PhysicsType; tier: number }
type PlayerPhysicsState<T extends PhysicsType> = Omit<PlayerPhysicsStateData, "type"> & { type: T }
type QTEType = keyof QTEDefinitions
type QTEClientParameters<T extends QTEType = QTEType> = {
	type: T
	parameters: QTEParametersForType<T>
}
type QTEParametersForType<T extends QTEType> = QTEDefinitions[T]["params"]
interface QTEDefinitions {
	progressBar: { params: ProgressBarQteParams; state: ProgressBarQteState }
	timedClick: { params: TimedClickQteParams; state: TimedClickQteState }
	gravityBar: { params: GravityBarQteParams; state: GravityBarQteState }
	precisionBar: { params: PrecisionBarQteParams; state: PrecisionBarQteState }
	rhythmClick: { params: RhythmClickQteParams; state: RhythmClickQteState }
}
type ProgressBarQteParams = Readonly<{
	/** Starting progress value (0-100) @default 30 */
	progressStartValue?: number
	/** How much progress drains each tick while the player isn't clicking @default 0.075 */
	progressDecreasePerTick: number
	/** How much progress is gained per click @default 5 */
	progressPerClick: number
	/** If true, the QTE fails when progress reaches 0; otherwise progress clamps at 0 @default false */
	canFail: boolean
	/** Rich text shown as the QTE prompt @default [{ str: "Click repeatedly to complete!" }] */
	description: CustomTextStyling
	/** Icon displayed on the click target @default "fa-solid fa-computer-mouse" */
	clickIcon: string
	/** Scale multiplier for the click icon (must be > 0) @default 1 */
	scale?: number
	/** Rotation in degrees for the click icon (must be ≥ 0) @default 15 */
	rotation?: number
}>
type ProgressBarQteState = {
	progress: number
	clickCount: number
}
type TimedClickQteParams = Readonly<{
	/** Duration in milliseconds the player has to click @default 3000 */
	timeWindow: number
	/** Icon displayed on the click target @default "fa-solid fa-computer-mouse" */
	icon: string
	/** Rich text shown as the QTE prompt @default [{ str: "Click to complete the QTE!" }] */
	label: CustomTextStyling
	/** Whether to display a countdown timer @default true */
	showTimer: boolean
	/** Scale multiplier for the icon (must be > 0) @default 1 */
	scale?: number
	/** Rotation in degrees for the icon (must be ≥ 0) @default 15 */
	rotation?: number
	/** If true, the icon pulses with a breathing animation anchored to the centre @default false */
	breatheCenter?: boolean
}>
type TimedClickQteState = {
	timeRemaining: number
	timeWindow: number
}
type GravityBarQteParams = Readonly<{
	/** Starting progress value (0-100) @default 30 */
	progressStartValue?: number
	/** Size of the player's catch zone as a fraction of the bar (must be > 0, 0-1) @default 0.25 */
	catchZoneSize: number
	/** Speed at which the mover travels along the bar (must be > 0) @default 3 */
	moverSpeed: number
	/** How erratically the mover changes direction (higher = more unpredictable) @default 0.8 */
	moverErraticness: number
	/** Downward pull on the catch zone when the player isn't holding click @default 1 */
	gravity: number
	/** Upward force on the catch zone while the player holds click @default 1.5 */
	riseSpeed: number
	/** Progress gained per second while the mover is inside the catch zone @default 8 */
	progressGainPerSecond: number
	/** Progress lost per second while the mover is outside the catch zone @default 4 */
	progressDrainPerSecond: number
	/** If true, the QTE fails when progress reaches 0; otherwise progress clamps at 0 @default false */
	canFail: boolean
	/** Rich text shown as the QTE prompt @default [{ str: "Hold to catch!" }] */
	description: CustomTextStyling
	/** Icon displayed on the mover @default "Moonfish" */
	icon?: string
}>
type GravityBarQteState = {
	catchZonePosition: number
	catchZoneSize: number
	moverPosition: number
	progress: number
	isCatching: boolean
}
type PrecisionBarQteParams = Readonly<{
	/** Speed of the marker in full bar-widths per second (must be > 0, e.g. 1.0 = one full sweep per second) @default 0.5 */
	speed: number
	/** Fraction of the bar that counts as the success zone, centred in the middle (must be > 0, 0-1, e.g. 0.15 = 15%) @default 0.15 */
	successZoneSize: number
	/** Rich text shown as the QTE prompt @default [{ str: "Click when the marker is within the green zone." }] */
	label: CustomTextStyling
	/** Icon displayed on the marker @default "" */
	icon?: string
	/** Scale multiplier for the icon (must be > 0) @default 1 */
	scale?: number
	/** Rotation in degrees for the icon (must be ≥ 0) @default 0 */
	rotation?: number
}>
type PrecisionBarQteState = {
	/** Marker position as 0–1 where 0.5 is the centre */
	markerPosition: number
}
type RhythmClickQteParams = Readonly<{
	/** Number of successful clicks needed to complete the QTE (must be a positive integer) @default 5 */
	requiredSuccesses: number
	/** Duration in milliseconds for the outer circle to shrink from max size to centre (must be > 0) @default 1200 */
	shrinkDurationMs: number
	/** Fraction of the inner circle radius that counts as a successful overlap (must be > 0, 0-1, e.g. 0.15 = ±15%) @default 0.15 */
	toleranceFraction: number
	/** Max misses allowed before failing. If omitted, unlimited misses are permitted (must be a non-negative integer) @default 3 */
	maxMisses?: number
	/** Rich text shown as the QTE prompt @default [{ str: "Click when the circles align!" }] */
	label: CustomTextStyling
	/** Icon displayed in the centre of the circles @default "" */
	icon?: string
}>
type RhythmClickQteState = {
	/** Current outer circle radius as a fraction of the max radius (1 = fully expanded, 0 = at centre) */
	outerCircleProgress: number
	/** Number of successful clicks so far */
	successes: number
	/** Number of required successes to complete */
	requiredSuccesses: number
	/** Number of misses so far */
	misses: number
	/** Result of the most recent click: null if no click yet, true if hit, false if miss */
	lastClickResult: boolean | null
}
type QTERequestId = number
type IngameIconName = (_TypeOf["ingameIconNames"])[number]
type InbuiltEffectInfo = { inbuiltLevel: number; initiatorId?: PlayerId }
type AngleDir = {
	theta: number
	phi: number
}
type BlockRaycastResult = PNull<{
	blockID: BlockId // The block ID of the block that was hit
	position: Pos // The position of the block that was hit
	normal: Pos // The normal of the face that was hit
	adjacent: Pos // The position of the block adjacent to the hit face
}>
type MultiBlockInfo = {
	positions: { block: string; id: number; x: number; y: number; z: number }[]
}
type BoughtShopItem = Omit<ShopItem, "boughtCallback" | "schematicId" | "isRewardedAd">
type ChatTags = CustomTextStyling[]
type OnPlayerChatObjectResponse = Record<PlayerId, false | ChatMessageObject>
type ChatMessageObject = {
	prefixContent?: ChatTags
	chatContent?: CustomTextStyling
}
interface _TypeOf {
	QUEUED_COMMAND_STATUS_STRINGS: { readonly 0: "NOT_IN_QUEUE"; readonly 1: "WAITING_TO_RUN"; readonly 2: "CURRENTLY_RUNNING"; }
	lifeformBodyParts: readonly ["Torso", "Head", "ArmRight", "ArmLeft", "LegLeft", "LegRight"]
	ranks: readonly ["developer", "admin", "super", "youtuber"]
	shopItemBadgeTypes: readonly ["new", "lucky"]
	playerMeshNamedNodes: readonly ["TorsoNode", "HeadMesh", "ArmRightMesh", "ArmLeftMesh", "LegLeftMesh", "LegRightMesh"]
	particlePresets: { readonly damageInner: unknown; readonly damageOuter: unknown; readonly bouncinessInner: unknown; readonly bouncinessOuter: unknown; readonly healthRegenInner: unknown; readonly healthRegenOuter: unknown; readonly speedInner: unknown; readonly speedOuter: unknown; readonly damageReductionInner: unknown; readonly damageReductionOuter: unknown; readonly invisibleInner: unknown; readonly invisibleOuter: unknown; readonly jumpBoostInner: unknown; readonly jumpBoostOuter: unknown; readonly knockbackInner: unknown; readonly knockbackOuter: unknown; readonly poisonedInner: unknown; readonly poisonedOuter: unknown; readonly slownessInner: unknown; readonly slownessOuter: unknown; readonly weaknessInner: unknown; readonly weaknessOuter: unknown; readonly cleansedInner: unknown; readonly cleansedOuter: unknown; readonly instantDamageInner: unknown; readonly instantDamageOuter: unknown; readonly instantHealthInner: unknown; readonly instantHealthOuter: unknown; readonly hasteInner: unknown; readonly hasteOuter: unknown; readonly shieldInner: unknown; readonly shieldOuter: unknown; readonly doubleJumpInner: unknown; readonly doubleJumpOuter: unknown; readonly heatResistanceInner: unknown; readonly heatResistanceOuter: unknown; readonly thiefInner: unknown; readonly thiefOuter: unknown; readonly miningYieldInner: unknown; readonly miningYieldOuter: unknown; readonly brainRotInner: unknown; readonly brainRotOuter: unknown; readonly auraInner: unknown; readonly auraOuter: unknown; readonly wallClimbingInner: unknown; readonly wallClimbingOuter: unknown; readonly airWalkInner: unknown; readonly airWalkOuter: unknown; readonly pickpocketerInner: unknown; readonly pickpocketerOuter: unknown; readonly lifestealInner: unknown; readonly lifestealOuter: unknown; readonly blindnessInner: unknown; readonly blindnessOuter: unknown; readonly poopyInner: unknown; readonly poopyOuter: unknown; readonly xRayVisionInner: unknown; readonly xRayVisionOuter: unknown; readonly defaultFirecrackerSmall: { readonly colorGradients: TimeColorGradient[]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly defaultFirecrackerLarge: { readonly colorGradients: TimeColorGradient[]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mango: unknown; readonly yellowFirecrackerSmall: unknown; readonly yellowFirecrackerLarge: unknown; readonly limeFirecrackerSmall: unknown; readonly limeFirecrackerLarge: unknown; readonly greenFirecrackerSmall: unknown; readonly greenFirecrackerLarge: unknown; readonly cyanFirecrackerSmall: unknown; readonly cyanFirecrackerLarge: unknown; readonly blueFirecrackerSmall: unknown; readonly blueFirecrackerLarge: unknown; readonly purpleFirecrackerSmall: unknown; readonly purpleFirecrackerLarge: unknown; readonly pinkFirecrackerSmall: unknown; readonly pinkFirecrackerLarge: unknown; readonly redFirecrackerSmall: unknown; readonly redFirecrackerLarge: unknown; readonly orangeFirecrackerSmall: unknown; readonly orangeFirecrackerLarge: unknown; readonly blackFirecrackerSmall: unknown; readonly blackFirecrackerLarge: unknown; readonly brownFirecrackerSmall: unknown; readonly brownFirecrackerLarge: unknown; readonly grayFirecrackerSmall: unknown; readonly grayFirecrackerLarge: unknown; readonly lightBlueFirecrackerSmall: unknown; readonly lightBlueFirecrackerLarge: unknown; readonly lightGrayFirecrackerSmall: unknown; readonly lightGrayFirecrackerLarge: unknown; readonly magentaFirecrackerSmall: unknown; readonly magentaFirecrackerLarge: unknown; readonly whiteFirecrackerSmall: unknown; readonly whiteFirecrackerLarge: unknown; readonly brainRot: unknown; readonly stomp: unknown; readonly fertiliser: unknown; readonly bonemeal: unknown; readonly mobTameSuccess: unknown; readonly mobTameFailure: unknown; readonly mobCatch: unknown; readonly spawnCaughtMob: unknown; readonly mobFeedDefault: unknown; readonly mobFeedSuperliked: { readonly colorGradients: TimeColorGradient[]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobFeedLike: { readonly colorGradients: TimeColorGradient[]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobFeedNeutral: { readonly colorGradients: TimeColorGradient[]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobFeedDisliked: { readonly colorGradients: TimeColorGradient[]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobDeath: unknown; readonly mobDeathSoul: unknown; readonly boardShopSuccess: unknown; readonly mobSpawnerBlockFail: { readonly colorGradients: [{ readonly timeFraction: 0; readonly minColor: [80, 80, 80, 1]; readonly maxColor: [160, 160, 160, 1]; }]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobSpawnerBlockPassive: { readonly colorGradients: [{ readonly timeFraction: 0; readonly minColor: [0, 200, 50, 1]; readonly maxColor: [0, 255, 100, 1]; }]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobSpawnerBlockNeutral: { readonly colorGradients: [{ readonly timeFraction: 0; readonly minColor: [200, 200, 0, 1]; readonly maxColor: [255, 255, 0, 1]; }]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobSpawnerBlockHostile: { readonly colorGradients: [{ readonly timeFraction: 0; readonly minColor: [200, 10, 0, 1]; readonly maxColor: [255, 20, 0, 1]; }]; readonly texture: string; readonly minLifeTime: number; readonly maxLifeTime: number; readonly minEmitPower: number; readonly maxEmitPower: number; readonly minSize: number; readonly maxSize: number; readonly gravity: number[]; readonly velocityGradients: VelocityGradient[]; readonly blendMode: ParticleSystemBlendMode; readonly dir1: number[]; readonly dir2: number[]; readonly manualEmitCount: number; readonly hideDist: number; }; readonly mobSpawnOrb: unknown; readonly aura: unknown; }
	customItemStats: readonly ["ttb", "displayName", "harvestLevel", "stoodOnSpeedMultiplier", "specialToolDrop", "specialToolBonusDrops", "description", "altActionable", "eatHealAmt", "eatShieldAmt", "damage", "attackRange", "secondaryDamage", "absorbThrowable", "armourReduction", "CrosshairText", "gunStats", "showInCreativeInven"]
	lifeformTypes: readonly ["Player", "Pig", "Cow", "Sheep", "Horse", "Deer", "Wolf", "Wildcat", "Spirit Golem", "Spirit Wolf", "Spirit Bear", "Spirit Stag", "Spirit Gorilla", "Bear", "Stag", "Gold Watermelon Stag", "Gorilla", "Cave Golem", "Draugr Zombie", "Draugr Skeleton", "Frost Golem", "Frost Zombie", "Frost Skeleton", "Draugr Knight", "Draugr Huntress", "Magma Golem", "Draugr Warper", "Frost Wraith", "Draugr Reaver", "NPC", "67", "Bobino Musculino", "Capitan Explosivo"]
	cosmeticTypes: readonly ["skin", "hat", "head", "eyebrows", "eyes", "back", "body", "legs", "shoes", "cape", "nameColour"]
	playerPoses: readonly ["standing", "sitting", "zombie", "gliding", "driving", "sleeping", "riding"]
	mobVariations: { readonly Pig: readonly ["default"]; readonly Cow: readonly ["default", "cream"]; readonly Sheep: readonly ["default", "black", "red", "orange", "pink", "purple", "yellow", "blue", "brown", "cyan", "gray", "green", "lightBlue", "lightGray", "lime", "magenta"]; readonly Horse: readonly ["default", "black", "brown", "cream"]; readonly "Cave Golem": readonly ["default", "iron"]; readonly "Draugr Zombie": readonly ["default", "longHairChestplate", "longHairClothed", "shortHairClothed"]; readonly "Draugr Skeleton": readonly ["default"]; readonly "Frost Golem": readonly ["default"]; readonly "Frost Zombie": readonly ["default", "longHairChestplate", "shortHairClothed"]; readonly "Frost Skeleton": readonly ["default"]; readonly "Draugr Knight": readonly ["default"]; readonly Wolf: readonly ["default", "white", "brown", "grey", "spectral"]; readonly Bear: readonly ["default"]; readonly Deer: readonly ["default"]; readonly Stag: readonly ["default"]; readonly "Gold Watermelon Stag": readonly ["default"]; readonly Gorilla: readonly ["default"]; readonly Wildcat: readonly ["default", "tabby", "grey", "black", "calico", "siamese", "leopard"]; readonly "Magma Golem": readonly ["default"]; readonly "Draugr Huntress": readonly ["default", "chainmail"]; readonly "Spirit Golem": readonly ["default"]; readonly "Spirit Wolf": readonly ["default"]; readonly "Spirit Bear": readonly ["default"]; readonly "Spirit Stag": readonly ["default"]; readonly "Spirit Gorilla": readonly ["default"]; readonly "Draugr Warper": readonly ["default"]; readonly "Frost Wraith": readonly ["default"]; readonly "Draugr Reaver": readonly ["default"]; readonly NPC: readonly ["default", "emma", "leo", "isabel", "sanjay", "imara", "enoch", "sara", "carmen"]; readonly "67": readonly ["default"]; readonly "Bobino Musculino": readonly ["default"]; readonly "Capitan Explosivo": readonly ["default"]; }
	mobTypes: readonly ["Pig", "Cow", "Sheep", "Horse", "Deer", "Wolf", "Wildcat", "Spirit Golem", "Spirit Wolf", "Spirit Bear", "Spirit Stag", "Spirit Gorilla", "Bear", "Stag", "Gold Watermelon Stag", "Gorilla", "Cave Golem", "Draugr Zombie", "Draugr Skeleton", "Frost Golem", "Frost Zombie", "Frost Skeleton", "Draugr Knight", "Draugr Huntress", "Magma Golem", "Draugr Warper", "Frost Wraith", "Draugr Reaver", "NPC", "67", "Bobino Musculino", "Capitan Explosivo"]
	mobSettings: readonly ["variation", "name", "maxHealth", "initialHealth", "idleSound", "attackSound", "secondaryAttackSound", "hurtSound", "onDeathItemDrops", "onDeathParticleTexture", "onDeathAura", "baseWalkingSpeed", "baseRunningSpeed", "walkingSpeedMultiplier", "runningSpeedMultiplier", "jumpCount", "baseJumpImpulseXZ", "baseJumpImpulseY", "jumpMultiplier", "runAwayRadius", "chaseRadius", "territoryRadius", "hostilityRadius", "stoppingRadius", "attackInterval", "attackRadius", "secondaryAttackRadius", "attackDamage", "secondaryAttackDamage", "attackImpulse", "secondaryAttackImpulse", "burstAttackInfo", "secondaryBurstAttackInfo", "heldItemName", "attackItemName", "secondaryAttackItemName", "swingArmOnAttack", "swingArmOnSecondaryAttack", "attackEffectName", "attackEffectDuration", "warpTargetSpecialAttackInfo", "combatTetherInfo", "evadeInfo", "tameInfo", "onTamedHealthMultiplier", "petInfo", "ownerDbId", "minFollowingRadius", "maxFollowingRadius", "isRideable", "healthRegen", "ridingSpeedMult", "metaInfo"]
	potionEffects: readonly ["Speed", "Damage Reduction", "Damage", "Invisible", "Jump Boost", "Knockback", "Poisoned", "Slowness", "Weakness", "Cleansed", "Instant Damage", "Health Regen", "Instant Health", "Haste", "Shield", "Double Jump", "Heat Resistance", "Thief", "X-Ray Vision", "Mining Yield", "Brain Rot", "Aura", "Wall Climbing", "Air Walk", "Pickpocketer", "Lifesteal", "Bounciness", "Blindness", "Poopy"]
	MAX_MOB_FEED_LEVEL: 5
	mobLevelUpBonuses: readonly ["Renaming", "Special Drops", "Thorns", "Rainbow Wool", "Max Health +", "Damage +", "Riding Speed +", "Double Poop", "Self Yield", "Painting", "Friends", "Pack Leader", "Poison Claws", "Mob Power", "Mob Yield", "Feed Aura", "Antlers"]
	mobAiStates: readonly ["idle", "disabled", "idleBeforeTurning", "turning", "idleBeforeWalking", "walking", "runningAway", "chasing", "following", "watching", "walkingToPosition", "runningToPosition"]
	ingameIconNames: readonly ["Damage", "Damage Reduction", "Speed", "VoidJump", "Fist", "Frozen", "Hydrated", "Invisible", "Jump Boost", "Poisoned", "Slowness", "Weakness", "Health Regen", "Haste", "Double Jump", "Heat Resistance", "Gliding", "Boating", "Obsidian Boating", "Riding", "Bunny Hop", "FallDamage", "Feather Falling", "Thief", "X-Ray Vision", "Mining Yield", "Brain Rot", "Rested Damage", "Rested Haste", "Rested Speed", "Rested Farming Yield", "Rested Aura", "Blindness", "Pickpocketer", "Lifesteal", "Bounciness", "Air Walk", "Wall Climbing", "Thorns", "Poopy", "Draugr Knight Head", "Draugr Warper Head", "Magma Golem Head", "Mystery Fish", "Damage Enchantment", "Critical Damage Enchantment", "Attack Speed Enchantment", "Protection Enchantment", "Health Enchantment", "Health Regen Enchantment", "Stomp Damage Enchantment", "Knockback Resist Enchantment", "Arrow Speed Enchantment", "Arrow Damage Enchantment", "Quick Charge Enchantment", "Break Speed Enchantment", "Momentum Enchantment", "Mining Yield Enchantment", "Farming Yield Enchantment", "Mining Aura Enchantment", "Digging Aura Enchantment", "Lumber Aura Enchantment", "Farming Aura Enchantment", "Vertical Knockback Enchantment", "Horizontal Knockback Enchantment", "Self Yield", "Friends", "Riding Speed", "Feed Aura", "Double Poop", "Mob Slayer", "Rainbow Wool", "Pack Leader", "Max Health", "Poison Claws", "Mob Yield", "Antlers Bonus", "Health", "HealthShield", "Cross", "Friendship", "Dotted Friendship", "Hunger", "Empty Hunger", "Pixelated Heart", "Question Mark", "Trader Black", "Trader Blue", "Trader Piggy"]
	ItemMetaInfo: {
		readonly rootName: string
		readonly rootId: number
		readonly metaStr: string
		readonly rot: number | null
		readonly open: boolean | null
		readonly halfblockPlacement: HalfblockPlacement | null
		readonly growing: true | null
		readonly treeBase: true | null
		readonly treeCanopy: true | null
		readonly books: number | null
		readonly freshlyGrown: true | null
		readonly roots: true | null
		readonly lava: true | null
		readonly top: true | null
		readonly grassRoots: true | null
		readonly breaking: true | null
		readonly flashing: true | null
		readonly charging: number | null
		readonly direction: number | null
		readonly requiresAmmo: true | null
		readonly woodType: string | null
		readonly caughtMobType: MobType | null
	}
	BlockMetadataItem: {
		displayName: string | TranslatedText | CustomTextStyling
		ttb?: number
		textureInfo: | string
			| (string | AnimParams)[]
			| [number, number, number, number?]
			| ({
					colour?: [number, number, number, number?]
			  } & AnimParams)
		texturePerSide: number[]
		harvestType: HarvestType
		transTex: boolean
		model: | "CentreCross"
			| "SquareSided"
			| "CustomPlanes"
			| "CustomPlanes|rotatable"
			| "CustomModel"
			| "Slab"
			| "door"
			| "trapdoor"
			| "rotatableOffset"
			| "rotatable"
		itemTexture: string
		drops: string
		solid: boolean
		heldItemScale: number
		modelScale: number
		meta: ItemMetaInfo
		rootMetaDesc: string
		particlesIgnoreBlack: boolean
		harvestLevel: number
		fluid: boolean
		specialToolDrop: { tool: string; drops: string }
		specialToolBonusDrops: RecursiveReadonly<Record<string, { bonusDrop: string; probabilityOfDrop: number }[]>>
		damage: number
		stoodOnSpeedMultiplier: number
		description: string | TranslatedText | CustomTextStyling
		altActionable: boolean
		soundType: { break: SoundType; place: SoundType }
		unlitStandaloneMesh: boolean
		customPlanesInfo: { textureIdx: number; yRot: number }[]
		customModelInfo: { yOffset?: number; yRotOffset?: number; unlit?: boolean; emissiveColor?: [number, number, number]; backFaceCulling?: boolean }
		absorbThrowable?: boolean
		CrosshairText?: string | CustomTextStyling
		/** Light emission as [R, G, B], each 0-15. Omit for no emission. */
		lightEmission?: [number, number, number]
		/** Sky light emission level: null or 0-15. 0 is equivalent to null (no emission). */
		skyLightEmission?: number
		/** Light attenuation when light passes through this block. Default: 1 for air/transparent, 3 for fluid, 15 for opaque. */
		lightFilter?: number
		name: string
		id: number
		atlasIdx: number | number[]
		stackable: boolean
		heldItemGlb?: string
		blockModel: string
		blockModelItem: boolean
		twoDBlockItem: boolean
		rotatableOffsetAmt: number
		canBePlacedOver: boolean
		onMinedAura: number
		showInCreativeInven?: boolean
		gunStats?: GunStatsOverride
	}
	NonBlockMetadataItem: {
		displayName?: string | TranslatedText | CustomTextStyling
		type: "Item" | "Tool" | "Gun" | "FullAuto" | "Armour" | "GrayscaleArmour" | "Chargeable"
		textureInfo: string | string[] | [number, number, number, number?]
		weight: number
		heldItemScale: number
		heldItemGlb?: string
		description?: string | TranslatedText | CustomTextStyling
		stackable: boolean
		eatable?: boolean
		chargeSound?: string
		afterEatenItem?: ItemName
		eatShieldAmt?: number
		eatHealAmt?: number
		chargeStages?: number
		chargeTime?: number
		minChargeStateToUse?: number
		damage?: number
		attackRange?: number
		secondaryDamage?: number
		holdAsAiming?: boolean
		hideAimingUI?: boolean
		requiresArrow?: boolean
		knockbackHorizontalScalar?: number
		knockbackVerticalScalar?: number
		attackCooldownMs?: number
		abilityCooldownMs?: number
		dashImpulse?: number
		comboInfo?: WeaponComboInfo
		velocityMultiplier?: number
		harvests?: HarvestType
		multiplier?: number
		level?: number
		lumberjackHeight?: number
		armourReduction?: number
		knockbackReduction?: number
		id?: number
		name?: string
		isCustom?: boolean
		/** Light emission as [R, G, B], each 0-15. Omit for no emission. */
		lightEmission?: [number, number, number]
		meta?: ItemMetaInfo
		rootMetaDesc?: string
		keepMetaInChest?: boolean
		gunType?: string
		scopeType?: "none" | "sniper"
		muzzleFlashOffsetFromGun?: [number, number, number]
		muzzleFlashScale?: number
		autoFireWithMouse?: boolean
		fireRate?: number
		fireRateWithHeldTouch?: number
		shotPelletCount?: number
		reloadTime?: number
		clipSize?: number
		reloadBulletsIndividually?: boolean
		bulletReloadTime?: number
		cockTime?: number
		tagSpeedMult?: number
		subsequentTagSpeedReductionScalar?: number
		inaccuracyStanding?: number
		inaccuracyFromShot?: number
		inaccuracyMovement?: number
		yVelocityInaccuracy?: number
		inaccuracyFromJump?: number
		altInaccuracyStanding?: number
		altInaccuracyFromShot?: number
		altInaccuracyMovement?: number
		recoveryRate?: number
		aimZoomFactor?: number
		kickbackDecreaseRate?: number
		minKickback?: number
		maxKickback?: number
		kickbackRate?: number
		hasVerticalInaccuracy?: boolean
		msPerRound?: number
		msPerRoundTouchScreen?: number
		altYVelocityInaccuracy?: number
		altInaccuracyFromJump?: number
		fireInterval?: number
		gunStats?: GunStatsOverride
		showInCreativeInven?: boolean
	}
	LoadedChunk: {
		anySetsRan: boolean
		readonly lastUpdated: number
		set(x: number, y: number, z: number, id: BlockId): void
		get(x: number, y: number, z: number): number
		/**
		 * Returns the underlying array of the chunk
		 * This exists for performance reasons only
		 * Be careful using this - updating the data directly without calling set or setUnderlying will result in inconsistent state
		 */
		getUnderlyingData(): Uint16Array<ArrayBufferLike>
		setUnderlying(idx: number, id: BlockId): void
	}
}
type ItemMetaInfo = _TypeOf["ItemMetaInfo"]
type BlockMetadataItem = _TypeOf["BlockMetadataItem"]
type NonBlockMetadataItem = _TypeOf["NonBlockMetadataItem"]
type LoadedChunk = _TypeOf["LoadedChunk"]
type Song = "Adigold - A Place To Be Free" | "Adigold - Butterfly Effect" | "Adigold - Dreamless Sleep" | "Adigold - Frozen Pulse" | "Adigold - Frozen Skies" | "Adigold - Healing Thoughts" | "Adigold - Here Forever" | "Adigold - Just a Little Hope" | "Adigold - Just Like Heaven" | "Adigold - Memories Remain" | "Adigold - Place To Be" | "Adigold - The Riverside" | "Adigold - The Wonder" | "Adigold - Vetrar (Cut B)" | "Awkward Comedy Quirky" | "battle-ship-111902" | "cdk-Silence-Await" | "corsairs-studiokolomna-main-version-23542-02-33" | "ghost-Reverie-small-theme" | "happy" | "Heroic-Demise-New" | "I-am-the-Sea-The-Room-4" | "Juhani Junkala [Retro Game Music Pack] Ending" | "Juhani Junkala [Retro Game Music Pack] Level 1" | "Juhani Junkala [Retro Game Music Pack] Level 2" | "Juhani Junkala [Retro Game Music Pack] Level 3" | "Juhani Junkala [Retro Game Music Pack] Title Screen" | "LonePeakMusic-Highway-1" | "Mojo Productions - Pirates" | "Mojo Productions - Sneaky Jazz" | "Mojo Productions - The Sneaky" | "Mojo Productions - The Sneaky Jazz" | "progress" | "raise-the-sails-152124" | "ramblinglibrarian-I-Have-Often-T" | "Slow-Motion-Bensound" | "snowflake-Ethereal-Space" | "the-epic-adventure-131399" | "TownTheme" | "The Suspense Ambient" | "Epic1" | "Epic2" | "Emotional Epic" | "Enemy Marked"
type ParticleSystemBlendMode = 0 | 1 | 2 | 3 | 4
type HalfblockPlacement = 0 | 1 | 2
type WalkThroughType = 0 | 1 | 2
type LobbyType = 0 | 1 | 2
type PhysicsType = 0 | 1 | 2 | 3 | 4 | 5
type ExplosionType = 0 | 1 | 2

	type ClientOptions = {
		canChange: boolean
		speedMultiplier: number
		crouchingSpeed: number
		/** you should probably use speed multiplier - this doesn't make much sense on phone */
		walkingSpeed: number
		/** you should probably use speed multiplier - this doesn't make much sense on phone */
		runningSpeed: number
		jumpAmount: number
		airJumpCount: number
		bunnyhopMaxMultiplier: number
		music: Song
		musicVolumeLevel: number
		/** Not recommended to use as it lags when being loaded. */
		skyBox: string | EarthSkyBox
		minChunkAddDist: [number, number]
		showPlayersInUnloadedChunks: boolean
		useInventory: boolean
		/** For now just enables the full inventory UI */
		useFullInventory: boolean
		canCraft: boolean
		canPickUpItems: boolean
		playerZoom: number
		zoomOutDistance: number
		maxPlayerZoom: number
		lobbyLeaderboardInfo: LobbyLeaderboardInfo
		canCustomiseChar: boolean
		/** used if canChange is true but useInventory is false */
		defaultBlock: string
		cantChangeError: string | CustomTextStyling
		cantBreakError: string | CustomTextStyling
		cantBuildError: string | CustomTextStyling
		/** The contents of the action button. Supports custom text styling. onTouchscreenActionButton will be called when button pressed. */
		touchscreenActionButton: string | CustomTextStyling
		strictFluidBuckets: boolean
		canUseZoomKey: boolean
		canAltAction: boolean
		canSeeNametagsThroughWalls: boolean
		showBasicMovementControls: boolean
		middleTextUpper: string | CustomTextStyling
		middleTextLower: string | CustomTextStyling
		crosshairText: string | CustomTextStyling
		RightInfoText: string | CustomTextStyling
		/** If set, clients will only be able to see the closest x players (good for client perf in games with many players) */
		numClosestPlayersVisible: number
		showProgressBar: boolean
		showKillfeed: boolean
		/** Allows player to select a channel that is passed as argument to onPlayerChat. See engineGameplayTypes.ts for expected format */
		chatChannels: { channelName: string; elementContent: string | CustomTextStyling; elementBgColor: string; }[]
		creative: boolean
		/** while in creative */
		flySpeedMultiplier: number
		/** Ignored if creative is false */
		canPickBlocks: boolean
		/** Position of the compass target. If string, will be parsed as a player id */
		compassTarget: string | number | number[]
		ttbMultiplier: number
		/** only applicable if useInventory is true */
		inventoryItemsMoveable: boolean
		invincible: boolean
		maxShield: number
		/** Shield upon joining and respawn. */
		initialShield: number
		maxHealth: number
		/** Health upon joining and respawn. Can be null for the player to not have health. */
		initialHealth: number
		/** Fraction of max health that regens each regen tick */
		healthRegenAmount: number
		/** How often health regen is ticked */
		healthRegenInterval: number
		/** How long after a player receives damage to start regen again */
		healthRegenStartAfter: number
		/** Duration of the +damage effect from plum */
		effectDamageDuration: number
		/** Duration of +speed effect from cracked coconut */
		effectSpeedDuration: number
		/** Duration of +damage reduction effect from pear */
		effectDamageReductionDuration: number
		/** Duration of +health regen effect from cherry */
		effectHealthRegenDuration: number
		/** Duration of potion effects */
		potionEffectDuration: number
		/** Duration of splash potion effects */
		splashPotionEffectDuration: number
		/** Duration of arrow potion effects */
		arrowPotionEffectDuration: number
		/** RGBA array [r, g, b, a] for camera screen tint effect. Values fall between 0 and 1. */
		cameraTint: [number, number, number, number]
		/** After dying, the player can respawn after this many seconds */
		secsToRespawn: number
		/** When player is dead, also shows a play again button matchmakes player into a new lobby. Mostly useful for sessionBased games */
		usePlayAgainButton: boolean
		/** If true, player will respawn automatically after secsToRespawn seconds. Won't show an ad so autoRespawn needs to be false some of the time */
		autoRespawn: boolean
		/** Text to show on respawn button. (E.g. "Spectate") */
		respawnButtonText: string
		/** MS before a killstreak expires. (defaults to never expiring) */
		killstreakDuration: number
		/** Damage multiplier for all types of damage */
		dealingDamageMultiplier: number
		/** Mult for when the player hits a head. Only applies to guns */
		dealingDamageHeadMultiplier: number
		/** Mult for when the player hits a leg. Only applies to guns */
		dealingDamageLegMultiplier: number
		/** Mult for when the player hits neither a leg or a head. Only applies to guns */
		dealingDamageDefaultMultiplier: number
		/** Mult for all types of incoming damage */
		receivingDamageMultiplier: number
		/** Scale factor to use for dropped item meshes */
		droppedItemScale: number
		/** Amount that player camera is affected by movement based fov */
		movementBasedFovScale: number
		/** Amount of friction to apply to airborne players - only change if absolutely necessary */
		airFrictionScale: number
		/** Amount of friction to apply to grounded players - only change if absolutely necessary */
		groundFrictionScale: number
		/** Amount of acceleration to apply to airborne players - only change if absolutely necessary */
		airAccScale: number
		/** Whether to allow players to strafe and conserve momentum while airborne */
		airMomentumConservation: boolean
		/** Whether players take fall damage */
		fallDamage: boolean
		/** How much aura levels up the player */
		auraPerLevel: number
		/** Max aura the player can have */
		maxAuraLevel: number
		/** Fog distance which overrides graphic settings. Uses graphic settings if null. */
		fogChunkDistanceOverride: number
		/** Fog colour override - as a hex string e.g. #ffffff */
		fogColourOverride: string
		/** Mult for horizontal knockback when dealing damage */
		horizontalKnockbackMultiplier: number
		/** Mult for vertical knockback when dealing damage */
		verticalKnockbackMultiplier: number
		/** Mult for the damage done by "stomping" on a lifeform, i.e.: falling on them wearing Spiked Boots. */
		stompDamageMultiplier: number
		/** Radius around the player that will be affected by the stomp damage. */
		stompDamageRadius: number
		/** Mult for the radius within which mobs can detect the player when crouching. If a player's mult is 2, then mobs will think they are twice as far away. */
		crouchMobDetectionRadiusMultiplier: number
		/** How much the player bounces off of solid blocks */
		bounciness: number
		/** Whether the player can climb walls */
		canClimbWalls: boolean
		/** Whether the player can crouch */
		canCrouch: boolean
		/** Distance in blocks over which we reduce the opacity of entities as they approach the camera */
		proximityFadeDistance: number
		/** Minimum opacity multiplier reachable when fading entities based on camera proximity */
		proximityFadeMinOpacity: number
		/** Force the camera to look in a specific direction [x, y, z]. Set to null to allow free camera movement. */
		forcedCameraDirection: [number, number, number]
		/** Duration in ms to animate/transition to the forced camera direction. 0 = instant. */
		forcedCameraDirectionTransitionMs: number
		/** Roll angle of the camera in radians */
		cameraRoll: number
		/** Duration in ms to animate/transition to the camera roll angle. 0 = instant. */
		cameraRollTransitionMs: number
		/** When null, just use the player's graphics setting. When set, forces lighting on (true) or off (false). */
		lightingOverride: boolean
		/** Sky light colour override - hex string e.g. #ffffff. */
		skyLightColourOverride: string
		/** Ambient (absence of sky light) colour override - hex string e.g. #ffffff. */
		ambientLightColourOverride: string
		/** Held item light colour override - hex colour string e.g. #ffffff. Applied regardless of any held item. */
		heldLightColourOverride: string
		/** When true, hides world and chunk coordinates regardless of the player's setting. */
		hideCoordinates: boolean
		/** Renders a terrain-following strip of animated chevron arrows on the ground from this player to the target position. Optional `colour` is a hex string like #ffaa00 (default white). */
		groundArrowPath: { target: [number, number, number]; colour?: string; }
	}
type OtherEntitySettings = {
		opacity: number
		zIndex: 0 | 1
		overlayColour: string
		canAttack: boolean
		canSee: boolean
		showDamageAmounts: boolean
		killfeedColour: string
		meshScaling: EntityMeshScalingMap
		colorInLobbyLeaderboard: string
		lobbyLeaderboardValues: LobbyLeaderboardValues
		nameTagInfo: NameTagInfo
		hasPriorityNametag: boolean
		nameColour: "default" | "yellow" | "lime" | "green" | "aqua" | "cyan" | "blue" | "purple" | "pink" | "red" | "orange"
	}

type UserCallbacks = "tick" | "onClose" | "onPlayerJoin" | "onPlayerLeave" | "onPlayerJump" | "onRespawnRequest" | "playerCommand" | "onPlayerChat" | "onPlayerChangeBlock" | "onBlockStand" | "onPlayerAttemptCraft" | "onPlayerCraft" | "onPlayerAttemptOpenChest" | "onPlayerOpenedChest" | "onPlayerMoveItemOutOfInventory" | "onPlayerDropItem" | "onPlayerPickedUpItem" | "onPlayerSelectInventorySlot" | "onPlayerAttack" | "onPlayerDamagingOtherPlayer" | "onPlayerDamagingMob" | "onMobDamagingPlayer" | "onMobDamagingOtherMob" | "onAttemptKillPlayer" | "onPlayerKilledOtherPlayer" | "onMobKilledPlayer" | "onPlayerKilledMob" | "onMobKilledOtherMob" | "onPlayerPotionEffect" | "onPlayerDamagingMeshEntity" | "onPlayerBreakMeshEntity" | "onPlayerUsedThrowable" | "onPlayerThrowableHitTerrain" | "onTouchscreenActionButton" | "onPlayerMoveInvenItem" | "onPlayerMoveItemIntoIdxs" | "onPlayerSwapInvenSlots" | "onPlayerMoveInvenItemWithAmt" | "onPlayerAttemptAltAction" | "onPlayerAltAction" | "onPlayerClick" | "onPlayerClickUp" | "onClientOptionUpdated" | "onMobSettingUpdated" | "onInventoryUpdated" | "onChestUpdated" | "onWorldChangeBlock" | "onCreateBloxdMeshEntity" | "onEntityCollision" | "onPlayerAttemptSpawnMob" | "onWorldAttemptSpawnMob" | "onPlayerSpawnMob" | "onWorldSpawnMob" | "onWorldAttemptDespawnMob" | "onMobDespawned" | "onChunkLoaded" | "onPlayerRequestChunk" | "onItemDropCreated" | "onPlayerStartChargingItem" | "onPlayerFinishChargingItem" | "onPlayerFinishQTE" | "onPlayerToggledShopMenu" | "onPlayerBoughtShopItem" | "onPlayerPlayedEmote" | "doPeriodicSave"
type QueuedCommandId = string
type QueuedStatusString = (_TypeOf["QUEUED_COMMAND_STATUS_STRINGS"])[keyof _TypeOf["QUEUED_COMMAND_STATUS_STRINGS"]]
	
/**
 * Called every tick, 20 times per second
 * @param ms - The fixed timestep, can be used as "milliseconds since last tick"
 */
declare var tick: (ms: number) => void

/**
 * Called when the lobby is shutting down
 * @param serverIsShuttingDown - Whether the server is shutting down
 */
declare var onClose: (serverIsShuttingDown: boolean) => void

/**
 * Called when a player joins the lobby
 * @param playerId - The id of the player that joined
 * @param fromGameReset - Whether this call is from a game reset (used by SessionBasedGame)
 */
declare var onPlayerJoin: (playerId: string, fromGameReset: boolean) => void

/**
 * Called when a player leaves the lobby
 * @param playerId - The id of the player that left
 * @param serverIsShuttingDown - Whether the server is shutting down
 */
declare var onPlayerLeave: (playerId: string, serverIsShuttingDown: boolean) => void

/**
 * Called when a player jumps
 * @param playerId - The id of the player that jumped
 */
declare var onPlayerJump: (playerId: string) => void

/**
 * Called when a player requests to respawn.
 * Optionally return the respawn location. Defaults to [0, 0, 0].
 * Return true to handle yourself (good for async,
 * but be careful that the player isn't at the place they died,
 * as they could pick up their old items or hit the player they were fighting).
 * @param playerId - The id of the player that requested to respawn
 */
declare var onRespawnRequest: (playerId: string) => true | void | number[]

/**
 * Called when a player sends a command
 * @param playerId - The id of the player that sent the command
 * @param command - The command that the player sent
 */
declare var playerCommand: (playerId: string, command: string) => boolean

/**
 * Called when a player sends a chat message
 * Return false or null to prevent the broadcast of the message.
 * Return a string or CustomTextStyling to add a prefix to message.
 * Return for most flexibility: an object where keys are playerIds -
 * the value for a playerId being false means that player won't receive the message.
 * Otherwise playerId values should be an object with (optional) keys
 * prefixContent and chatContent to modify the prefix and the chat.
 * CustomTextStyling[] prefixContent is expected, e.g. [["prefix"]] or [[{ str: "prefix" }]].
 * World code is not permitted to specify chatContent, it will be ignored.
 * @param playerId - The id of the player that sent the message
 * @param chatMessage - The message that the player sent
 * @param channelName - The name of the channel that the message was sent in
 */
declare var onPlayerChat: (playerId: PlayerId, chatMessage: string, channelName?: string) => boolean | void | ChatTags | OnPlayerChatObjectResponse

/**
 * Called when a player changes a block
 * Return "preventChange" to prevent the change.
 * If player places block, fromBlock will be Air (and toBlock the block).
 * If a player breaks a block, toBlock will be Air.
 * Return "preventDrop" to prevent a block item from dropping.
 * Return an array to set the dropped item position.
 */
declare var onPlayerChangeBlock: (playerId: PlayerId, x: number, y: number, z: number, fromBlock: BlockName, toBlock: BlockName, droppedItem: BlockName | null, fromBlockInfo: MultiBlockInfo, toBlockInfo: MultiBlockInfo) => void | [number, number, number] | "preventChange" | "preventDrop"

/**
 * Called when a player drops an item
 * Return "preventDrop" to prevent the player from dropping the item at all.
 * Return "allowButNoDroppedItemCreated" to allow discarding items without dropping them.
 */
declare var onPlayerDropItem: (playerId: PlayerId, x: number, y: number, z: number, itemName: ItemName, itemAmount: number, fromIdx: number) => void | "preventDrop" | "allowButNoDroppedItemCreated"

/**
 * Called when a player picks up an item
 * @param playerId - The id of the player that picked up the item
 * @param itemName - The name of the item that was picked up
 * @param itemAmount - The amount of the item that was picked up
 */
declare var onPlayerPickedUpItem: (playerId: PlayerId, itemName: string, itemAmount: number) => void

/**
 * Called when a player selects a different inventory slot.
 * This will be called eventually when you have already set the slot using
 * api.setSelectedInventorySlotI so be careful not to cause an infinite loop doing this.
 * @param playerId - The id of the player that selected the inventory slot
 * @param slotIndex - The index of the inventory slot that was selected
 */
declare var onPlayerSelectInventorySlot: (playerId: PlayerId, slotIndex: number) => void

/**
 * Called when a player stands on a block
 */
declare var onBlockStand: (playerId: PlayerId, x: number, y: number, z: number, blockName: BlockName) => void

/**
 * Called when a player attempts to craft an item
 * Return "preventCraft" to prevent a craft from happening
 * @param playerId - The id of the player that is attempting to craft the item
 * @param itemName - The name of the item that is being crafted
 * @param craftingIdx - The index of the used recipe in the item's recipe list
 * @param craftTimes - The number of times the craft recipe is used at once (e.g. shift held while crafting)
 */
declare var onPlayerAttemptCraft: (playerId: PlayerId, itemName: string, craftingIdx: number, craftTimes: number) => void | "preventCraft"

/**
 * Called when a player crafts an item
 * @param playerId - The id of the player that crafted the item
 * @param itemName - The name of the item that was crafted
 * @param craftingIdx - The index of the used recipe in the item's recipe list
 * @param recipe - The recipe that was used to craft the item
 * @param craftTimes - The number of times the craft recipe is used at once (e.g. shift held while crafting)
 */
declare var onPlayerCraft: (playerId: PlayerId, itemName: string, craftingIdx: number, recipe: RecipesForItem[number], craftTimes: number) => void

/**
 * Called when a player attempts to open a chest
 * Return "preventOpen" to prevent the player from opening the chest
 */
declare var onPlayerAttemptOpenChest: (playerId: PlayerId, x: number, y: number, z: number, isMoonstoneChest: boolean, isIronChest: boolean) => void | "preventOpen"

/**
 * Called when a player opens a chest
 */
declare var onPlayerOpenedChest: (playerId: PlayerId, x: number, y: number, z: number, isMoonstoneChest: boolean, isIronChest: boolean) => void

/**
 * Called when a player moves an item out of their inventory
 * Return "preventChange" to prevent the movement
 */
declare var onPlayerMoveItemOutOfInventory: (playerId: PlayerId, itemName: string, itemAmount: number, fromIdx: number, movementType: string) => void | "preventChange"

/**
 * Called for all types of inventory item movement.
 * Certain methods of moving item can result in splitting a stack
 * into multiple slots. (e.g. shift-click).
 * toStartIdx and toEndIdx provide the min and max idxs moved into.
 * Return "preventChange" to prevent item movement.
 */
declare var onPlayerMoveInvenItem: (playerId: PlayerId, fromIdx: number, toStartIdx: number, toEndIdx: number, amt: number) => void | "preventChange"

/**
 * Called when a player moves an item into an index within a range of inventory slots
 * Return "preventChange" to prevent the movement
 */
declare var onPlayerMoveItemIntoIdxs: (playerId: PlayerId, start: number, end: number, moveIdx: number, itemAmount: number) => void | "preventChange"

/**
 * Return "preventChange" to prevent the swap
 * @param playerId - The id of the player swapping the inventory slots
 * @param i - The index of the first slot
 * @param j - The index of the second slot
 */
declare var onPlayerSwapInvenSlots: (playerId: PlayerId, i: number, j: number) => void | "preventChange"

/**
 * Return "preventChange" to prevent the movement
 * @param playerId - The id of the player moving the item
 * @param i - The index of the first slot
 * @param j - The index of the second slot
 * @param amt - The amount of the item being moved
 */
declare var onPlayerMoveInvenItemWithAmt: (playerId: PlayerId, i: number, j: number, amt: number) => void | "preventChange"

/**
 * Called when player alt actions (right click on pc).
 * The co-ordinates will be undefined if there is no targeted block (and block will be "Air")
 * Some actions can be prevented by returning "preventAction",
 * but this may not work as well for certain actions which the game client predicts to succeed -
 * test it to see if it works for your use case, feel free to report any broken ones.
 */
declare var onPlayerAttemptAltAction: (playerId: PlayerId, x: number, y: number, z: number, block: BlockName, targetEId: EntityId | null) => void | "preventAction"

/**
 * Called when player completes an alt action (right click on pc).
 * The co-ordinates will be undefined if there is no targeted block (and block will be "Air")
 */
declare var onPlayerAltAction: (playerId: PlayerId, x: number, y: number, z: number, block: BlockName, targetEId: EntityId | null) => void

/**
 * Called when a player clicks
 * Don't have important functionality depending on wasAltClick,
 * as it'll always be false for touchscreen players.
 */
declare var onPlayerClick: (playerId: PlayerId, wasAltClick: boolean, x: number, y: number, z: number, block: BlockName, targetEId: EntityId | null) => void

/**
 * Called when a player releases a click (mouse-up on desktop, touch-end on mobile).
 * Fires for both primary and secondary click releases.
 * Keep in mind wasAltClick will always be false for touchscreen players.
 */
declare var onPlayerClickUp: (playerId: PlayerId, wasAltClick: boolean, x: number, y: number, z: number, block: BlockName, targetEId: EntityId | null) => void

/**
 * Called when a client option is updated
 * @param playerId - The id of the player whose option was updated
 * @param option - The option that was updated
 * @param value - The new value of the option, always null for custom code
 */
declare var onClientOptionUpdated: (playerId: PlayerId, option: ClientOption, value: any) => void

/**
 * Called when a mob setting is updated
 * @param mobId - The id of the mob whose setting was updated
 * @param setting - The setting that was updated
 * @param value - The new value of the setting
 */
declare var onMobSettingUpdated: (mobId: MobId, setting: MobSetting, value: any) => void

/**
 * Called when a player's inventory is updated
 * @param playerId - The id of the player whose inventory was updated
 */
declare var onInventoryUpdated: (playerId: PlayerId) => void

/**
 * Called when a chest is updated by a player
 * x, y, z, will be null if isMoonstoneChest is true
 */
declare var onChestUpdated: (initiatorEId: PlayerId, isMoonstoneChest: boolean, x: number | null, y: number | null, z: number | null) => void

/**
 * Called when a block is changed in the world
 * initiatorDbId is null if updated by game code e.g. when a sapling grows
 * Return "preventChange" to prevent change
 * Return "preventDrop" to prevent a block item from dropping
 */
declare var onWorldChangeBlock: (x: number, y: number, z: number, fromBlock: BlockName, toBlock: BlockName, initiatorDbId: string | null, extraInfo: WorldBlockChangedInfo) => void | "preventChange" | "preventDrop"

/**
 * Called when a mesh entity is created
 * @param eId - The id of the mesh entity
 * @param type - The type of mesh entity
 * @param initiatorId - The id of the entity that created the mesh entity, if any
 */
declare var onCreateBloxdMeshEntity: (eId: EntityId, type: string, initiatorId: EntityId | null) => void

/**
 * Called when a entity collides with another entity
 * @param eId - The id of the entity
 * @param otherEId - The id of the other entity
 */
declare var onEntityCollision: (eId: EntityId, otherEId: EntityId) => void

/**
 * Called when a player attempts to spawn a mob, e.g. using a spawn orb.
 * Return "preventSpawn" to prevent the mob from spawning.
 */
declare var onPlayerAttemptSpawnMob: (playerId: PlayerId, mobType: MobType, x: number, y: number, z: number) => void | "preventSpawn"

/**
 * Called when the world attempts to spawn a mob.
 * Return "preventSpawn" to prevent the mob from spawning.
 * @param mobType - The type of mob
 * @param x - The potential x coordinate of the mob
 * @param y - The potential y coordinate of the mob
 * @param z - The potential z coordinate of the mob
 */
declare var onWorldAttemptSpawnMob: (mobType: MobType, x: number, y: number, z: number) => void | "preventSpawn"

/**
 * Called when a mob is spawned by a player
 */
declare var onPlayerSpawnMob: (playerId: PlayerId, mobId: MobId, mobType: MobType, x: number, y: number, z: number, mobHerdId: MobHerdId, playSoundOnSpawn: boolean) => void

/**
 * Called when a mob is spawned by the world
 */
declare var onWorldSpawnMob: (mobId: MobId, mobType: MobType, x: number, y: number, z: number, mobHerdId: MobHerdId, playSoundOnSpawn: boolean) => void

/**
 * Called when a mob is despawned by the world.
 * Return "preventDespawn" to prevent the mob from despawning.
 * @param mobId - The id of the mob despawned
 */
declare var onWorldAttemptDespawnMob: (mobId: MobId) => void | "preventDespawn"

/**
 * Called when a mob is despawned
 * @param mobId - The id of the mob despawned
 */
declare var onMobDespawned: (mobId: MobId) => void

/**
 * Called when a player attacks another player
 * @param playerId - The id of the player attacking
 */
declare var onPlayerAttack: (playerId: string) => void

/**
 * Called when a player is damaging another player
 * Return "preventDamage" to prevent damage
 * Return number to change damage dealt to that amount
 * Sometimes the damager will have left the game (e.g. spikes placer);
 * in this case, attackingPlayer will be the damagedPlayer,
 * but we pass damagerDbId for use cases where it's important.
 */
declare var onPlayerDamagingOtherPlayer: (attackingPlayer: PlayerId, damagedPlayer: PlayerId, damageDealt: number, withItem: string, bodyPartHit: LifeformBodyPart, damagerDbId: PlayerDbId) => number | void | "preventDamage"

/**
 * Called when a player is damaging a mob
 * Return "preventDamage" to prevent damage
 * Return number to change damage dealt to that amount
 */
declare var onPlayerDamagingMob: (playerId: PlayerId, mobId: MobId, damageDealt: number, withItem: string, damagerDbId: PlayerDbId) => number | void | "preventDamage"

/**
 * Called when a mob is damaging a player
 * Return "preventDamage" to prevent damage
 * Return number to change damage dealt to that amount
 * @param attackingMob the id of the mob damaging the player
 * @param damagedPlayer the id of the player being damaged
 * @param damageDealt the amount of damage dealt
 * @param withItem the item used to attack
 */
declare var onMobDamagingPlayer: (attackingMob: MobId, damagedPlayer: PlayerId, damageDealt: number, withItem: string) => number | void | "preventDamage"

/**
 * Called when a mob is damaging another mob
 * Return "preventDamage" to prevent damage
 * Return number to change damage dealt to that amount
 * @param attackingMob the id of the mob attacking
 * @param damagedMob the id of the mob being damaged
 * @param damageDealt the amount of damage dealt
 * @param withItem the item used to attack
 */
declare var onMobDamagingOtherMob: (attackingMob: MobId, damagedMob: MobId, damageDealt: number, withItem: string) => number | void | "preventDamage"

/**
 * Called when a player is about to be killed
 * Return "preventDeath" to prevent the player from being killed
 * @param killedPlayer - The id of the player being killed
 * @param attackingLifeform - The optional id of the lifeform attacking the player
 */
declare var onAttemptKillPlayer: (killedPlayer: PlayerId, attackingLifeform?: LifeformId) => void | "preventDeath"

/**
 * Called when a player kills another player
 * Return "keepInventory" to not drop the player's inventory
 * @param attackingPlayer - The id of the player attacking
 * @param killedPlayer - The id of the player killed
 * @param damageDealt - The amount of damage dealt
 * @param withItem - The item used to attack
 */
declare var onPlayerKilledOtherPlayer: (attackingPlayer: string, killedPlayer: string, damageDealt: number, withItem: string) => void | "keepInventory"

/**
 * Called when a mob kills a player
 * Return "keepInventory" to not drop the player's inventory
 * @param attackingMob - The id of the mob attacking
 * @param killedPlayer - The id of the player killed
 * @param damageDealt - The amount of damage dealt
 * @param withItem - The item used to attack
 */
declare var onMobKilledPlayer: (attackingMob: any, killedPlayer: any, damageDealt: any, withItem: any) => void | "keepInventory"

/**
 * Called when a player kills a mob
 * Return "preventDrop" to prevent the mob from dropping items
 */
declare var onPlayerKilledMob: (playerId: PlayerId, mobId: MobId, damageDealt: number, withItem: string) => void | "preventDrop"

/**
 * Called when a mob kills another mob
 * Return "preventDrop" to prevent the mob from dropping items
 * @param attackingMob - The id of the mob attacking
 * @param killedMob - The id of the mob killed
 * @param damageDealt - The amount of damage dealt
 * @param withItem - The item used to attack
 */
declare var onMobKilledOtherMob: (attackingMob: MobId, killedMob: MobId, damageDealt: number, withItem: string) => void | "preventDrop"

/**
 * Called when a player is affected by a new potion effect
 * @param initiatorId - The id of the player who initiated the potion effect
 * @param targetId - The id of the player who has started being affected
 * @param effectName - The name of the potion effect
 */
declare var onPlayerPotionEffect: (initiatorId: string, targetId: string, effectName: "Damage" | "Speed" | "Damage Reduction" | "Invisible" | "Jump Boost" | "Knockback" | "Poisoned" | "Slowness" | "Weakness" | "Cleansed" | "Instant Damage" | "Health Regen" | "Instant Health" | "Haste" | "Shield" | "Double Jump" | "Heat Resistance" | "Thief" | "X-Ray Vision" | "Mining Yield" | "Brain Rot" | "Aura" | "Wall Climbing" | "Air Walk" | "Pickpocketer" | "Lifesteal" | "Bounciness" | "Blindness" | "Poopy") => void | "preventEffect"

/**
 * Called when a player is damaging a mesh entity
 */
declare var onPlayerDamagingMeshEntity: (playerId: PlayerId, damagedId: EntityId, damageDealt: number, withItem: string) => void

/**
 * Called when a player breaks a mesh entity
 * @param playerId - The id of the player breaking the mesh entity
 * @param entityId - The id of the mesh entity being broken
 */
declare var onPlayerBreakMeshEntity: (playerId: PlayerId, entityId: EntityId) => void

/**
 * Called when a player uses a throwable item
 */
declare var onPlayerUsedThrowable: (playerId: PlayerId, throwableName: ThrowableItem, thrownEntityId: EntityId) => void

/**
 * Called when a player's thrown projectile hits the terrain
 */
declare var onPlayerThrowableHitTerrain: (playerId: PlayerId, throwableName: ThrowableItem, thrownEntityId: EntityId) => void

/**
 * Set client option `touchscreenActionButton` to take effect
 * Called when a player presses the touchscreen action button
 * Called for both touchDown and touchUp
 * @param playerId - The id of the player pressing the touchscreen action button
 * @param touchDown - Whether the touchscreen action button was pressed or released
 */
declare var onTouchscreenActionButton: (playerId: PlayerId, touchDown: boolean) => void

/**
 * Called when a player claims a task
 * @param playerId - The id of the player claiming the task
 * @param taskId - The id of the task being claimed
 * @param isPromoTask - Whether the task is a promo task
 * @param claimedRewards - The rewards claimed by the player
 */
declare var onTaskClaimed: (playerId: string, taskId: any, isPromoTask: any, claimedRewards: any) => any

/**
 * Called when a chunk is first loaded
 * API Methods that modify the chunk like setBlock cannot be used here to make
 * persisted changes, and will introduce client-server desync most cases,
 * but might have some creative uses if you know what you're doing.
 * For most use cases, consider using another callback e.g. tick.
 * @param chunkId - The id of the chunk being loaded
 * @param chunk - The chunk being loaded, which can be modified by this callback
 * For world code callbacks this value will always be null.
 * @param wasPersistedChunk - Whether the chunk was persisted
 */
declare var onChunkLoaded: (chunkId: string, chunk: LoadedChunk, wasPersistedChunk: boolean) => void

/**
 * Called when a player requests a chunk
 */
declare var onPlayerRequestChunk: (playerId: PlayerId, chunkX: number, chunkY: number, chunkZ: number, chunkId: string) => void

/**
 * Called when an item drop is created
 */
declare var onItemDropCreated: (itemEId: EntityId, itemName: string, itemAmount: number, x: number, y: number, z: number) => void

/**
 * Called when a player starts charging an item
 * @param playerId - The id of the player charging the item
 * @param itemName - The name of the item being charged
 */
declare var onPlayerStartChargingItem: (playerId: PlayerId, itemName: string) => void | "preventCharge"

/**
 * Called when a player finishes charging an item
 */
declare var onPlayerFinishChargingItem: (playerId: PlayerId, used: boolean, itemName: string, duration: number) => void


declare var onPlayerFinishQTE: (playerId: PlayerId, qteId: QTERequestId, result: boolean) => void

/**
 * Called when a player opens or closes the shop menu
 * @param playerId - The id of the player whose shop menu changed
 * @param isOpen - Whether the shop menu is now open
 */
declare var onPlayerToggledShopMenu: (playerId: PlayerId, isOpen: boolean) => void

/** Called after a player plays an emote from the emote wheel. */
declare var onPlayerPlayedEmote: (playerId: PlayerId, emoteId: string) => void

/**
 * Called after a player successfully buys a shop item
 * @param playerId - The id of the player that bought the item
 * @param categoryKey - The shop category key
 * @param itemKey - The shop item key
 * @param item - The resolved shop item (with per-player overrides applied, internal properties stripped)
 * @param userInput - The user input provided, if the item has a userInput config
 */
declare var onPlayerBoughtShopItem: (playerId: PlayerId, categoryKey: ShopCategoryKey, itemKey: ShopItemKey, item: BoughtShopItem, userInput?: string) => void

/**
 * Called every so often.
 * You should save custom db values/s3 objects here.
 * Persisted items ARE saved on graceful shutdown (e.g. uncaught error, update, etc),
 * but this helps prevent large data-loss on non-graceful shutdowns.
 */
declare var doPeriodicSave: () => void

interface Map<K, V> {
    clear(): void;
    /**
     * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
     */
    delete(key: K): boolean;
    /**
     * Executes a provided function once per each key/value pair in the Map, in insertion order.
     */
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    /**
     * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
     * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
     */
    get(key: K): V | undefined;
    /**
     * @returns boolean indicating whether an element with the specified key exists or not.
     */
    has(key: K): boolean;
    /**
     * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
     */
    set(key: K, value: V): this;
    /**
     * @returns the number of elements in the Map.
     */
    readonly size: number;
}

interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
    readonly prototype: Map<any, any>;
}

interface Set<T> {
    /**
     * Appends a new element with a specified value to the end of the Set.
     */
    add(value: T): this;

    clear(): void;
    /**
     * Removes a specified value from the Set.
     * @returns Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
     */
    delete(value: T): boolean;
    /**
     * Executes a provided function once per each value in the Set object, in insertion order.
     */
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    /**
     * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
     */
    has(value: T): boolean;
    /**
     * @returns the number of (unique) elements in Set.
     */
    readonly size: number;
}

interface SetConstructor {
    new <T = any>(values?: readonly T[] | null): Set<T>;
    readonly prototype: Set<any>;
}

declare var Map: MapConstructor;

declare var Set: SetConstructor;

interface Array<T> {
    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: T, start?: number, end?: number): this;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
}

interface ArrayConstructor {
    /**
     * Creates an array from an array-like object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from<T>(arrayLike: ArrayLike<T>): T[];

    /**
     * Creates an array from an iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of<T>(...items: T[]): T[];
}

interface Function {
    /**
     * Returns the name of the function. Function names are read-only and can not be changed.
     */
    readonly name: string;
}

interface NumberConstructor {
    /**
     * The value of Number.EPSILON is the difference between 1 and the smallest value greater than 1
     * that is representable as a Number value, which is approximately:
     * 2.2204460492503130808472633361816 x 10‍−‍16.
     */
    readonly EPSILON: number;

    /**
     * Returns true if passed value is finite.
     * Unlike the global isFinite, Number.isFinite doesn't forcibly convert the parameter to a
     * number. Only finite values of the type number, result in true.
     * @param number A numeric value.
     */
    isFinite(number: unknown): boolean;

    /**
     * Returns true if the value passed is an integer, false otherwise.
     * @param number A numeric value.
     */
    isInteger(number: unknown): boolean;

    /**
     * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a
     * number). Unlike the global isNaN(), Number.isNaN() doesn't forcefully convert the parameter
     * to a number. Only values of the type number, that are also NaN, result in true.
     * @param number A numeric value.
     */
    isNaN(number: unknown): boolean;

    /**
     * Returns true if the value passed is a safe integer.
     * @param number A numeric value.
     */
    isSafeInteger(number: unknown): boolean;

    /**
     * The value of the largest integer n such that n and n + 1 are both exactly representable as
     * a Number value.
     * The value of Number.MAX_SAFE_INTEGER is 9007199254740991 2^53 − 1.
     */
    readonly MAX_SAFE_INTEGER: number;

    /**
     * The value of the smallest integer n such that n and n − 1 are both exactly representable as
     * a Number value.
     * The value of Number.MIN_SAFE_INTEGER is −9007199254740991 (−(2^53 − 1)).
     */
    readonly MIN_SAFE_INTEGER: number;

    /**
     * Converts a string to a floating-point number.
     * @param string A string that contains a floating-point number.
     */
    parseFloat(string: string): number;

    /**
     * Converts A string to an integer.
     * @param string A string to convert into a number.
     * @param radix A value between 2 and 36 that specifies the base of the number in `string`.
     * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
     * All other strings are considered decimal.
     */
    parseInt(string: string, radix?: number): number;
}

interface ObjectConstructor {
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source The source object from which to copy properties.
     */
    assign<T extends {}, U>(target: T, source: U): T & U;

    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source1 The first source object from which to copy properties.
     * @param source2 The second source object from which to copy properties.
     */
    assign<T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;

    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source1 The first source object from which to copy properties.
     * @param source2 The second source object from which to copy properties.
     * @param source3 The third source object from which to copy properties.
     */
    assign<T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;

    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param sources One or more source objects from which to copy properties
     */
    assign(target: object, ...sources: any[]): any;

    /**
     * Returns an array of all symbol properties found directly on object o.
     * @param o Object to retrieve the symbols from.
     */
    getOwnPropertySymbols(o: any): symbol[];

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    keys(o: {}): string[];

    /**
     * Returns true if the values are the same value, false otherwise.
     * @param value1 The first value.
     * @param value2 The second value.
     */
    is(value1: any, value2: any): boolean;

    /**
     * Sets the prototype of a specified object o to object proto or null. Returns the object o.
     * @param o The object to change its prototype.
     * @param proto The value of the new prototype or null.
     */
    setPrototypeOf(o: any, proto: object | null): any;
}

interface ReadonlyArray<T> {
    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find<S extends T>(predicate: (value: T, index: number, obj: readonly T[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: T, index: number, obj: readonly T[]) => unknown, thisArg?: any): T | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: T, index: number, obj: readonly T[]) => unknown, thisArg?: any): number;

    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
}

interface RegExp {
    /**
     * Returns a string indicating the flags of the regular expression in question. This field is read-only.
     * The characters in this string are sequenced and concatenated in the following order:
     *
     *    - "g" for global
     *    - "i" for ignoreCase
     *    - "m" for multiline
     *    - "u" for unicode
     *    - "y" for sticky
     *
     * If no flags are set, the value is the empty string.
     */
    readonly flags: string;

    /**
     * Returns a Boolean value indicating the state of the sticky flag (y) used with a regular
     * expression. Default is false. Read-only.
     */
    readonly sticky: boolean;

    /**
     * Returns a Boolean value indicating the state of the Unicode flag (u) used with a regular
     * expression. Default is false. Read-only.
     */
    readonly unicode: boolean;
}

interface RegExpConstructor {
    new (pattern: RegExp | string, flags?: string): RegExp;
    (pattern: RegExp | string, flags?: string): RegExp;
}

interface String {
    /**
     * Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
     * value of the UTF-16 encoded code point starting at the string element at position pos in
     * the String resulting from converting this object to a String.
     * If there is no element at that position, the result is undefined.
     * If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.
     */
    codePointAt(pos: number): number | undefined;

    /**
     * Returns true if searchString appears as a substring of the result of converting this
     * object to a String, at one or more positions that are
     * greater than or equal to position; otherwise, returns false.
     * @param searchString search string
     * @param position If position is undefined, 0 is assumed, so as to search all of the String.
     */
    includes(searchString: string, position?: number): boolean;

    /**
     * Returns true if the sequence of elements of searchString converted to a String is the
     * same as the corresponding elements of this object (converted to a String) starting at
     * endPosition – length(this). Otherwise returns false.
     */
    endsWith(searchString: string, endPosition?: number): boolean;

    /**
     * Returns the String value result of normalizing the string into the normalization form
     * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
     * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
     * is "NFC"
     */
    normalize(form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;

    /**
     * Returns the String value result of normalizing the string into the normalization form
     * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
     * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
     * is "NFC"
     */
    normalize(form?: string): string;

    /**
     * Returns a String value that is made from count copies appended together. If count is 0,
     * the empty string is returned.
     * @param count number of copies to append
     */
    repeat(count: number): string;

    /**
     * Returns true if the sequence of elements of searchString converted to a String is the
     * same as the corresponding elements of this object (converted to a String) starting at
     * position. Otherwise returns false.
     */
    startsWith(searchString: string, position?: number): boolean;

    /**
     * Returns an `<a>` HTML anchor element and sets the name attribute to the text value
     * @deprecated A legacy feature for browser compatibility
     * @param name
     */
    anchor(name: string): string;

    /**
     * Returns a `<big>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    big(): string;

    /**
     * Returns a `<blink>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    blink(): string;

    /**
     * Returns a `<b>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    bold(): string;

    /**
     * Returns a `<tt>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    fixed(): string;

    /**
     * Returns a `<font>` HTML element and sets the color attribute value
     * @deprecated A legacy feature for browser compatibility
     */
    fontcolor(color: string): string;

    /**
     * Returns a `<font>` HTML element and sets the size attribute value
     * @deprecated A legacy feature for browser compatibility
     */
    fontsize(size: number): string;

    /**
     * Returns a `<font>` HTML element and sets the size attribute value
     * @deprecated A legacy feature for browser compatibility
     */
    fontsize(size: string): string;

    /**
     * Returns an `<i>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    italics(): string;

    /**
     * Returns an `<a>` HTML element and sets the href attribute value
     * @deprecated A legacy feature for browser compatibility
     */
    link(url: string): string;

    /**
     * Returns a `<small>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    small(): string;

    /**
     * Returns a `<strike>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    strike(): string;

    /**
     * Returns a `<sub>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    sub(): string;

    /**
     * Returns a `<sup>` HTML element
     * @deprecated A legacy feature for browser compatibility
     */
    sup(): string;
}

interface StringConstructor {
    /**
     * Return the String value whose elements are, in order, the elements in the List elements.
     * If length is 0, the empty string is returned.
     */
    fromCodePoint(...codePoints: number[]): string;

    /**
     * String.raw is usually used as a tag function of a Tagged Template String. When called as
     * such, the first argument will be a well formed template call site object and the rest
     * parameter will contain the substitution values. It can also be called directly, for example,
     * to interleave strings and values from your own tag function, and in this case the only thing
     * it needs from the first argument is the raw property.
     * @param template A well-formed template string call site representation.
     * @param substitutions A set of substitution values.
     */
    raw(template: { raw: readonly string[] | ArrayLike<string>; }, ...substitutions: any[]): string;
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}

interface Array<T> {
    /** Iterator */
    [Symbol.iterator](): ArrayIterator<T>;

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, T]>;

    /**
     * Returns an iterable of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an iterable of values in the array
     */
    values(): ArrayIterator<T>;
}

interface ArrayConstructor {
    /**
     * Creates an array from an iterable object.
     * @param iterable An iterable object to convert to an array.
     */
    from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];

    /**
     * Creates an array from an iterable object.
     * @param iterable An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
}

interface ReadonlyArray<T> {
    /** Iterator of values in the array. */
    [Symbol.iterator](): ArrayIterator<T>;

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, T]>;

    /**
     * Returns an iterable of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an iterable of values in the array
     */
    values(): ArrayIterator<T>;
}

interface IArguments {
    /** Iterator */
    [Symbol.iterator](): ArrayIterator<any>;
}

interface Map<K, V> {
    /** Returns an iterable of entries in the map. */
    [Symbol.iterator](): MapIterator<[K, V]>;

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): MapIterator<[K, V]>;

    /**
     * Returns an iterable of keys in the map
     */
    keys(): MapIterator<K>;

    /**
     * Returns an iterable of values in the map
     */
    values(): MapIterator<V>;
}

interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(iterable?: Iterable<readonly [K, V]> | null): Map<K, V>;
}

interface Set<T> {
    /** Iterates over values in the set. */
    [Symbol.iterator](): SetIterator<T>;

    /**
     * Returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    entries(): SetIterator<[T, T]>;

    /**
     * Despite its name, returns an iterable of the values in the set.
     */
    keys(): SetIterator<T>;

    /**
     * Returns an iterable of values in the set.
     */
    values(): SetIterator<T>;
}

interface SetConstructor {
    new <T>(iterable?: Iterable<T> | null): Set<T>;
}

interface String {
    /** Iterator */
    [Symbol.iterator](): StringIterator<string>;
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Int8ArrayConstructor {
    new (elements: Iterable<number>): Int8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Int8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int8Array<ArrayBuffer>;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint8ArrayConstructor {
    new (elements: Iterable<number>): Uint8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint8Array<ArrayBuffer>;
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Int16ArrayConstructor {
    new (elements: Iterable<number>): Int16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Int16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int16Array<ArrayBuffer>;
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint16ArrayConstructor {
    new (elements: Iterable<number>): Uint16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint16Array<ArrayBuffer>;
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Int32ArrayConstructor {
    new (elements: Iterable<number>): Int32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Int32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int32Array<ArrayBuffer>;
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint32ArrayConstructor {
    new (elements: Iterable<number>): Uint32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint32Array<ArrayBuffer>;
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Float32ArrayConstructor {
    new (elements: Iterable<number>): Float32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Float32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float32Array<ArrayBuffer>;
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<[number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Float64ArrayConstructor {
    new (elements: Iterable<number>): Float64Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Float64Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float64Array<ArrayBuffer>;
}

interface ProxyHandler<T extends object> {
    /**
     * A trap method for a function call.
     * @param target The original callable object which is being proxied.
     */
    apply?(target: T, thisArg: any, argArray: any[]): any;

    /**
     * A trap for the `new` operator.
     * @param target The original object which is being proxied.
     * @param newTarget The constructor that was originally called.
     */
    construct?(target: T, argArray: any[], newTarget: Function): object;

    /**
     * A trap for `Object.defineProperty()`.
     * @param target The original object which is being proxied.
     * @returns A `Boolean` indicating whether or not the property has been defined.
     */
    defineProperty?(target: T, property: string | symbol, attributes: PropertyDescriptor): boolean;

    /**
     * A trap for the `delete` operator.
     * @param target The original object which is being proxied.
     * @param p The name or `Symbol` of the property to delete.
     * @returns A `Boolean` indicating whether or not the property was deleted.
     */
    deleteProperty?(target: T, p: string | symbol): boolean;

    /**
     * A trap for getting a property value.
     * @param target The original object which is being proxied.
     * @param p The name or `Symbol` of the property to get.
     * @param receiver The proxy or an object that inherits from the proxy.
     */
    get?(target: T, p: string | symbol, receiver: any): any;

    /**
     * A trap for `Object.getOwnPropertyDescriptor()`.
     * @param target The original object which is being proxied.
     * @param p The name of the property whose description should be retrieved.
     */
    getOwnPropertyDescriptor?(target: T, p: string | symbol): PropertyDescriptor | undefined;

    /**
     * A trap for the `[[GetPrototypeOf]]` internal method.
     * @param target The original object which is being proxied.
     */
    getPrototypeOf?(target: T): object | null;

    /**
     * A trap for the `in` operator.
     * @param target The original object which is being proxied.
     * @param p The name or `Symbol` of the property to check for existence.
     */
    has?(target: T, p: string | symbol): boolean;

    /**
     * A trap for `Object.isExtensible()`.
     * @param target The original object which is being proxied.
     */
    isExtensible?(target: T): boolean;

    /**
     * A trap for `Reflect.ownKeys()`.
     * @param target The original object which is being proxied.
     */
    ownKeys?(target: T): ArrayLike<string | symbol>;

    /**
     * A trap for `Object.preventExtensions()`.
     * @param target The original object which is being proxied.
     */
    preventExtensions?(target: T): boolean;

    /**
     * A trap for setting a property value.
     * @param target The original object which is being proxied.
     * @param p The name or `Symbol` of the property to set.
     * @param receiver The object to which the assignment was originally directed.
     * @returns A `Boolean` indicating whether or not the property was set.
     */
    set?(target: T, p: string | symbol, newValue: any, receiver: any): boolean;

    /**
     * A trap for `Object.setPrototypeOf()`.
     * @param target The original object which is being proxied.
     * @param newPrototype The object's new prototype or `null`.
     */
    setPrototypeOf?(target: T, v: object | null): boolean;
}

interface ProxyConstructor {
    /**
     * Creates a revocable Proxy object.
     * @param target A target object to wrap with Proxy.
     * @param handler An object whose properties define the behavior of Proxy when an operation is attempted on it.
     */
    revocable<T extends object>(target: T, handler: ProxyHandler<T>): { proxy: T; revoke: () => void; };

    /**
     * Creates a Proxy object. The Proxy object allows you to create an object that can be used in place of the
     * original object, but which may redefine fundamental Object operations like getting, setting, and defining
     * properties. Proxy objects are commonly used to log property accesses, validate, format, or sanitize inputs.
     * @param target A target object to wrap with Proxy.
     * @param handler An object whose properties define the behavior of Proxy when an operation is attempted on it.
     */
    new <T extends object>(target: T, handler: ProxyHandler<T>): T;
}

declare var Proxy: ProxyConstructor;

interface Array<T> {
    /**
     * Is an object whose properties have the value 'true'
     * when they will be absent when used in a 'with' statement.
     */
    readonly [Symbol.unscopables]: {
        [K in keyof any[]]?: boolean;
    };
}

interface ReadonlyArray<T> {
    /**
     * Is an object whose properties have the value 'true'
     * when they will be absent when used in a 'with' statement.
     */
    readonly [Symbol.unscopables]: {
        [K in keyof readonly any[]]?: boolean;
    };
}

interface Map<K, V> {
    readonly [Symbol.toStringTag]: string;
}

interface Set<T> {
    readonly [Symbol.toStringTag]: string;
}

interface JSON {
    readonly [Symbol.toStringTag]: string;
}

interface Function {
    /**
     * Determines whether the given value inherits from this function if this function was used
     * as a constructor function.
     *
     * A constructor function can control which objects are recognized as its instances by
     * 'instanceof' by overriding this method.
     */
    [Symbol.hasInstance](value: any): boolean;
}

interface RegExp {
    /**
     * Matches a string with this regular expression, and returns an array containing the results of
     * that search.
     * @param string A string to search within.
     */
    [Symbol.match](string: string): RegExpMatchArray | null;

    /**
     * Replaces text in a string, using this regular expression.
     * @param string A String object or string literal whose contents matching against
     *               this regular expression will be replaced
     * @param replaceValue A String object or string literal containing the text to replace for every
     *                     successful match of this regular expression.
     */
    [Symbol.replace](string: string, replaceValue: string): string;

    /**
     * Replaces text in a string, using this regular expression.
     * @param string A String object or string literal whose contents matching against
     *               this regular expression will be replaced
     * @param replacer A function that returns the replacement text.
     */
    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;

    /**
     * Finds the position beginning first substring match in a regular expression search
     * using this regular expression.
     *
     * @param string The string to search within.
     */
    [Symbol.search](string: string): number;

    /**
     * Returns an array of substrings that were delimited by strings in the original input that
     * match against this regular expression.
     *
     * If the regular expression contains capturing parentheses, then each time this
     * regular expression matches, the results (including any undefined results) of the
     * capturing parentheses are spliced.
     *
     * @param string string value to split
     * @param limit if not undefined, the output array is truncated so that it contains no more
     * than 'limit' elements.
     */
    [Symbol.split](string: string, limit?: number): string[];
}

interface RegExpConstructor {
    readonly [Symbol.species]: RegExpConstructor;
}

interface String {
    /**
     * Matches a string or an object that supports being matched against, and returns an array
     * containing the results of that search, or null if no matches are found.
     * @param matcher An object that supports being matched against.
     */
    match(matcher: { [Symbol.match](string: string): RegExpMatchArray | null; }): RegExpMatchArray | null;

    /**
     * Passes a string and {@linkcode replaceValue} to the `[Symbol.replace]` method on {@linkcode searchValue}. This method is expected to implement its own replacement algorithm.
     * @param searchValue An object that supports searching for and replacing matches within a string.
     * @param replaceValue The replacement text.
     */
    replace(searchValue: { [Symbol.replace](string: string, replaceValue: string): string; }, replaceValue: string): string;

    /**
     * Replaces text in a string, using an object that supports replacement within a string.
     * @param searchValue A object can search for and replace matches within a string.
     * @param replacer A function that returns the replacement text.
     */
    replace(searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string; }, replacer: (substring: string, ...args: any[]) => string): string;

    /**
     * Finds the first substring match in a regular expression search.
     * @param searcher An object which supports searching within a string.
     */
    search(searcher: { [Symbol.search](string: string): number; }): number;

    /**
     * Split a string into substrings using the specified separator and return them as an array.
     * @param splitter An object that can split a string.
     * @param limit A value used to limit the number of elements returned in the array.
     */
    split(splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[];
}

interface ArrayBuffer {
    readonly [Symbol.toStringTag]: "ArrayBuffer";
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Int8Array";
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint8Array";
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Int16Array";
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint16Array";
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Int32Array";
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint32Array";
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Float32Array";
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Float64Array";
}

interface ArrayConstructor {
    readonly [Symbol.species]: ArrayConstructor;
}

interface MapConstructor {
    readonly [Symbol.species]: MapConstructor;
}

interface SetConstructor {
    readonly [Symbol.species]: SetConstructor;
}

interface ArrayBufferConstructor {
    readonly [Symbol.species]: ArrayBufferConstructor;
}

interface Array<T> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: T, fromIndex?: number): boolean;
}

interface ReadonlyArray<T> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: T, fromIndex?: number): boolean;
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param searchElement The element to search for.
     * @param fromIndex The position in this array at which to begin searching for searchElement.
     */
    includes(searchElement: number, fromIndex?: number): boolean;
}

interface ArrayBufferConstructor {
    new (): ArrayBuffer;
}

interface ObjectConstructor {
    /**
     * Returns an array of values of the enumerable own properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    values<T>(o: { [s: string]: T; } | ArrayLike<T>): T[];

    /**
     * Returns an array of values of the enumerable own properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    values(o: {}): any[];

    /**
     * Returns an array of key/values of the enumerable own properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    entries<T>(o: { [s: string]: T; } | ArrayLike<T>): [string, T][];

    /**
     * Returns an array of key/values of the enumerable own properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    entries(o: {}): [string, any][];

    /**
     * Returns an object containing all own property descriptors of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    getOwnPropertyDescriptors<T>(o: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & { [x: string]: PropertyDescriptor; };
}

interface ArrayBufferTypes {
    SharedArrayBuffer: SharedArrayBuffer;
}

interface String {
    /**
     * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
     * The padding is applied from the start (left) of the current string.
     *
     * @param maxLength The length of the resulting string once the current string has been padded.
     *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
     *
     * @param fillString The string to pad the current string with.
     *        If this string is too long, it will be truncated and the left-most part will be applied.
     *        The default value for this parameter is " " (U+0020).
     */
    padStart(maxLength: number, fillString?: string): string;

    /**
     * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
     * The padding is applied from the end (right) of the current string.
     *
     * @param maxLength The length of the resulting string once the current string has been padded.
     *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
     *
     * @param fillString The string to pad the current string with.
     *        If this string is too long, it will be truncated and the left-most part will be applied.
     *        The default value for this parameter is " " (U+0020).
     */
    padEnd(maxLength: number, fillString?: string): string;
}

interface Int8ArrayConstructor {
    new (): Int8Array<ArrayBuffer>;
}

interface Uint8ArrayConstructor {
    new (): Uint8Array<ArrayBuffer>;
}

interface Int16ArrayConstructor {
    new (): Int16Array<ArrayBuffer>;
}

interface Uint16ArrayConstructor {
    new (): Uint16Array<ArrayBuffer>;
}

interface Int32ArrayConstructor {
    new (): Int32Array<ArrayBuffer>;
}

interface Uint32ArrayConstructor {
    new (): Uint32Array<ArrayBuffer>;
}

interface Float32ArrayConstructor {
    new (): Float32Array<ArrayBuffer>;
}

interface Float64ArrayConstructor {
    new (): Float64Array<ArrayBuffer>;
}

interface RegExpMatchArray {
    groups?: {
        [key: string]: string;
    };
}

interface RegExpExecArray {
    groups?: {
        [key: string]: string;
    };
}

interface RegExp {
    /**
     * Returns a Boolean value indicating the state of the dotAll flag (s) used with a regular expression.
     * Default is false. Read-only.
     */
    readonly dotAll: boolean;
}

interface ReadonlyArray<T> {
    /**
     * Calls a defined callback function on each element of an array. Then, flattens the result into
     * a new array.
     * This is identical to a map followed by flat with depth 1.
     *
     * @param callback A function that accepts up to three arguments. The flatMap method calls the
     * callback function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callback function. If
     * thisArg is omitted, undefined is used as the this value.
     */
    flatMap<U, This = undefined>(
        callback: (this: This, value: T, index: number, array: T[]) => U | ReadonlyArray<U>,
        thisArg?: This,
    ): U[];

    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    flat<A, D extends number = 1>(
        this: A,
        depth?: D,
    ): FlatArray<A, D>[];
}

interface Array<T> {
    /**
     * Calls a defined callback function on each element of an array. Then, flattens the result into
     * a new array.
     * This is identical to a map followed by flat with depth 1.
     *
     * @param callback A function that accepts up to three arguments. The flatMap method calls the
     * callback function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callback function. If
     * thisArg is omitted, undefined is used as the this value.
     */
    flatMap<U, This = undefined>(
        callback: (this: This, value: T, index: number, array: T[]) => U | ReadonlyArray<U>,
        thisArg?: This,
    ): U[];

    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    flat<A, D extends number = 1>(
        this: A,
        depth?: D,
    ): FlatArray<A, D>[];
}

interface ObjectConstructor {
    /**
     * Returns an object created by key-value entries for properties and methods
     * @param entries An iterable object that contains key-value entries for properties and methods.
     */
    fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T; };

    /**
     * Returns an object created by key-value entries for properties and methods
     * @param entries An iterable object that contains key-value entries for properties and methods.
     */
    fromEntries(entries: Iterable<readonly any[]>): any;
}

interface String {
    /** Removes the trailing white space and line terminator characters from a string. */
    trimEnd(): string;

    /** Removes the leading white space and line terminator characters from a string. */
    trimStart(): string;

    /**
     * Removes the leading white space and line terminator characters from a string.
     * @deprecated A legacy feature for browser compatibility. Use `trimStart` instead
     */
    trimLeft(): string;

    /**
     * Removes the trailing white space and line terminator characters from a string.
     * @deprecated A legacy feature for browser compatibility. Use `trimEnd` instead
     */
    trimRight(): string;
}

interface Number {
    /**
     * Converts a number to a string by using the current or specified locale.
     * @param locales A locale string, array of locale strings, Intl.Locale object, or array of Intl.Locale objects that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
     * @param options An object that contains one or more properties that specify comparison options.
     */
    toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string;
}

interface String {
    /**
     * Matches a string with a regular expression, and returns an iterable of matches
     * containing the results of that search.
     * @param regexp A variable name or string literal containing the regular expression pattern and flags.
     */
    matchAll(regexp: RegExp): RegExpStringIterator<RegExpExecArray>;

    /** Converts all alphabetic characters to lowercase, taking into account the host environment's current locale. */
    toLocaleLowerCase(locales?: Intl.LocalesArgument): string;

    /** Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale. */
    toLocaleUpperCase(locales?: Intl.LocalesArgument): string;

    /**
     * Determines whether two strings are equivalent in the current or specified locale.
     * @param that String to compare to target string
     * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details.
     * @param options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details.
     */
    localeCompare(that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
}

interface RegExp {
    /**
     * Matches a string with this regular expression, and returns an iterable of matches
     * containing the results of that search.
     * @param string A string to search within.
     */
    [Symbol.matchAll](str: string): RegExpStringIterator<RegExpMatchArray>;
}

interface String {
    /**
     * Replace all instances of a substring in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
     */
    replaceAll(searchValue: string | RegExp, replaceValue: string): string;

    /**
     * Replace all instances of a substring in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replacer A function that returns the replacement text.
     */
    replaceAll(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
}

interface Array<T> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): T | undefined;
}

interface ReadonlyArray<T> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): T | undefined;
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the item located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): number | undefined;
}

interface ObjectConstructor {
    /**
     * Determines whether an object has a property with the specified name.
     * @param o An object.
     * @param v A property name.
     */
    hasOwn(o: object, v: PropertyKey): boolean;
}

interface RegExpMatchArray {
    indices?: RegExpIndicesArray;
}

interface RegExpExecArray {
    indices?: RegExpIndicesArray;
}

interface RegExp {
    /**
     * Returns a Boolean value indicating the state of the hasIndices flag (d) used with a regular expression.
     * Default is false. Read-only.
     */
    readonly hasIndices: boolean;
}

interface String {
    /**
     * Returns a new String consisting of the single UTF-16 code unit located at the specified index.
     * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
     */
    at(index: number): string | undefined;
}

interface Array<T> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S | undefined;
    findLast(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): number;

    /**
     * Returns a copy of an array with its elements reversed.
     */
    toReversed(): T[];

    /**
     * Returns a copy of an array with its elements sorted.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
     * ```ts
     * [11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: T, b: T) => number): T[];

    /**
     * Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the copied array in place of the deleted elements.
     * @returns The copied array.
     */
    toSpliced(start: number, deleteCount: number, ...items: T[]): T[];

    /**
     * Copies an array and removes elements while returning the remaining elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @returns A copy of the original array with the remaining elements.
     */
    toSpliced(start: number, deleteCount?: number): T[];

    /**
     * Copies an array, then overwrites the value at the provided index with the
     * given value. If the index is negative, then it replaces from the end
     * of the array.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to write into the copied array.
     * @returns The copied array with the updated value.
     */
    with(index: number, value: T): T[];
}

interface ReadonlyArray<T> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends T>(
        predicate: (value: T, index: number, array: readonly T[]) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: T, index: number, array: readonly T[]) => unknown,
        thisArg?: any,
    ): T | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (value: T, index: number, array: readonly T[]) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copied array with all of its elements reversed.
     */
    toReversed(): T[];

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
     * ```ts
     * [11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: T, b: T) => number): T[];

    /**
     * Copies an array and removes elements while, if necessary, inserting new elements in their place, returning the remaining elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the copied array in place of the deleted elements.
     * @returns A copy of the original array with the remaining elements.
     */
    toSpliced(start: number, deleteCount: number, ...items: T[]): T[];

    /**
     * Copies an array and removes elements while returning the remaining elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @returns A copy of the original array with the remaining elements.
     */
    toSpliced(start: number, deleteCount?: number): T[];

    /**
     * Copies an array, then overwrites the value at the provided index with the
     * given value. If the index is negative, then it replaces from the end
     * of the array
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: T): T[];
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Int8Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Int8Array.from([11, 2, 22, 1]);
     * myNums.toSorted((a, b) => a - b) // Int8Array(4) [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Int8Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Int8Array<ArrayBuffer>;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Uint8Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Uint8Array.from([11, 2, 22, 1]);
     * myNums.toSorted((a, b) => a - b) // Uint8Array(4) [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Uint8Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Uint8Array<ArrayBuffer>;
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Int16Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Int16Array.from([11, 2, -22, 1]);
     * myNums.toSorted((a, b) => a - b) // Int16Array(4) [-22, 1, 2, 11]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Int16Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Int16Array<ArrayBuffer>;
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Uint16Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Uint16Array.from([11, 2, 22, 1]);
     * myNums.toSorted((a, b) => a - b) // Uint16Array(4) [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Uint16Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Uint16Array<ArrayBuffer>;
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Int32Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Int32Array.from([11, 2, -22, 1]);
     * myNums.toSorted((a, b) => a - b) // Int32Array(4) [-22, 1, 2, 11]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Int32Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Int32Array<ArrayBuffer>;
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Uint32Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Uint32Array.from([11, 2, 22, 1]);
     * myNums.toSorted((a, b) => a - b) // Uint32Array(4) [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Uint32Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Uint32Array<ArrayBuffer>;
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Float32Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Float32Array.from([11.25, 2, -22.5, 1]);
     * myNums.toSorted((a, b) => a - b) // Float32Array(4) [-22.5, 1, 2, 11.5]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Float32Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Float32Array<ArrayBuffer>;
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    /**
     * Returns the value of the last element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate findLast calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found, findLast
     * immediately returns that element value. Otherwise, findLast returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;

    /**
     * Returns the index of the last element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate findLastIndex calls predicate once for each element of the array, in descending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;

    /**
     * Copies the array and returns the copy with the elements in reverse order.
     */
    toReversed(): Float64Array<ArrayBuffer>;

    /**
     * Copies and sorts the array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * const myNums = Float64Array.from([11.25, 2, -22.5, 1]);
     * myNums.toSorted((a, b) => a - b) // Float64Array(4) [-22.5, 1, 2, 11.5]
     * ```
     */
    toSorted(compareFn?: (a: number, b: number) => number): Float64Array<ArrayBuffer>;

    /**
     * Copies the array and inserts the given number at the provided index.
     * @param index The index of the value to overwrite. If the index is
     * negative, then it replaces from the end of the array.
     * @param value The value to insert into the copied array.
     * @returns A copy of the original array with the inserted value.
     */
    with(index: number, value: number): Float64Array<ArrayBuffer>;
}

interface ArrayBuffer {
    /**
     * If this ArrayBuffer is resizable, returns the maximum byte length given during construction; returns the byte length if not.
     *
     * [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/maxByteLength)
     */
    get maxByteLength(): number;

    /**
     * Returns true if this ArrayBuffer can be resized.
     *
     * [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resizable)
     */
    get resizable(): boolean;

    /**
     * Resizes the ArrayBuffer to the specified size (in bytes).
     *
     * [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resize)
     */
    resize(newByteLength?: number): void;

    /**
     * Returns a boolean indicating whether or not this buffer has been detached (transferred).
     *
     * [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/detached)
     */
    get detached(): boolean;

    /**
     * Creates a new ArrayBuffer with the same byte content as this buffer, then detaches this buffer.
     *
     * [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer)
     */
    transfer(newByteLength?: number): ArrayBuffer;

    /**
     * Creates a new non-resizable ArrayBuffer with the same byte content as this buffer, then detaches this buffer.
     *
     * [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transferToFixedLength)
     */
    transferToFixedLength(newByteLength?: number): ArrayBuffer;
}

interface ArrayBufferConstructor {
    new (byteLength: number, options?: { maxByteLength?: number; }): ArrayBuffer;
}

interface MapConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K, T>(
        items: Iterable<T>,
        keySelector: (item: T, index: number) => K,
    ): Map<K, T[]>;
}

interface ObjectConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K extends PropertyKey, T>(
        items: Iterable<T>,
        keySelector: (item: T, index: number) => K,
    ): Partial<Record<K, T[]>>;
}

interface RegExp {
    /**
     * Returns a Boolean value indicating the state of the unicodeSets flag (v) used with a regular expression.
     * Default is false. Read-only.
     */
    readonly unicodeSets: boolean;
}

interface String {
    /**
     * Returns true if all leading surrogates and trailing surrogates appear paired and in order.
     */
    isWellFormed(): boolean;

    /**
     * Returns a string where all lone or out-of-order surrogates have been replaced by the Unicode replacement character (U+FFFD).
     */
    toWellFormed(): string;
}

interface PropertyDescriptor {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
}

interface Object {
    /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
    constructor: Function;

    /** Returns a string representation of an object. */
    toString(): string;

    /** Returns a date converted to a string using the current locale. */
    toLocaleString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): Object;

    /**
     * Determines whether an object has a property with the specified name.
     * @param v A property name.
     */
    hasOwnProperty(v: PropertyKey): boolean;

    /**
     * Determines whether an object exists in another object's prototype chain.
     * @param v Another object whose prototype chain is to be checked.
     */
    isPrototypeOf(v: Object): boolean;

    /**
     * Determines whether a specified property is enumerable.
     * @param v A property name.
     */
    propertyIsEnumerable(v: PropertyKey): boolean;
}

interface ObjectConstructor {
    new (value?: any): Object;
    (): any;
    (value: any): any;

    /** A reference to the prototype for a class of objects. */
    readonly prototype: Object;

    /**
     * Returns the prototype of an object.
     * @param o The object that references the prototype.
     */
    getPrototypeOf(o: any): any;

    /**
     * Gets the own property descriptor of the specified object.
     * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
     * @param o Object that contains the property.
     * @param p Name of the property.
     */
    getOwnPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | undefined;

    /**
     * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
     * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
     * @param o Object that contains the own properties.
     */
    getOwnPropertyNames(o: any): string[];

    /**
     * Creates an object that has the specified prototype or that has null prototype.
     * @param o Object to use as a prototype. May be null.
     */
    create(o: object | null): any;

    /**
     * Creates an object that has the specified prototype, and that optionally contains specified properties.
     * @param o Object to use as a prototype. May be null
     * @param properties JavaScript object that contains one or more property descriptors.
     */
    create(o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;

    /**
     * Adds a property to an object, or modifies attributes of an existing property.
     * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
     * @param p The property name.
     * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
     */
    defineProperty<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): T;

    /**
     * Adds one or more properties to an object, and/or modifies attributes of existing properties.
     * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
     * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
     */
    defineProperties<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T;

    /**
     * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
     * @param o Object on which to lock the attributes.
     */
    seal<T>(o: T): T;

    /**
     * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
     * @param f Object on which to lock the attributes.
     */
    freeze<T extends Function>(f: T): T;

    /**
     * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
     * @param o Object on which to lock the attributes.
     */
    freeze<T extends { [idx: string]: U | null | undefined | object; }, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;

    /**
     * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
     * @param o Object on which to lock the attributes.
     */
    freeze<T>(o: T): Readonly<T>;

    /**
     * Prevents the addition of new properties to an object.
     * @param o Object to make non-extensible.
     */
    preventExtensions<T>(o: T): T;

    /**
     * Returns true if existing property attributes cannot be modified in an object and new properties cannot be added to the object.
     * @param o Object to test.
     */
    isSealed(o: any): boolean;

    /**
     * Returns true if existing property attributes and values cannot be modified in an object, and new properties cannot be added to the object.
     * @param o Object to test.
     */
    isFrozen(o: any): boolean;

    /**
     * Returns a value that indicates whether new properties can be added to an object.
     * @param o Object to test.
     */
    isExtensible(o: any): boolean;

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    keys(o: object): string[];
}

/**
 * Creates a new function.
 */
interface Function {
    /**
     * Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.
     * @param thisArg The object to be used as the this object.
     * @param argArray A set of arguments to be passed to the function.
     */
    apply(this: Function, thisArg: any, argArray?: any): any;

    /**
     * Calls a method of an object, substituting another object for the current object.
     * @param thisArg The object to be used as the current object.
     * @param argArray A list of arguments to be passed to the method.
     */
    call(this: Function, thisArg: any, ...argArray: any[]): any;

    /**
     * For a given function, creates a bound function that has the same body as the original function.
     * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
     * @param thisArg An object to which the this keyword can refer inside the new function.
     * @param argArray A list of arguments to be passed to the new function.
     */
    bind(this: Function, thisArg: any, ...argArray: any[]): any;

    /** Returns a string representation of a function. */
    toString(): string;

    prototype: any;
    readonly length: number;

    // Non-standard extensions
    arguments: any;
    caller: Function;
}

interface FunctionConstructor {
    /**
     * Creates a new function.
     * @param args A list of arguments the function accepts.
     */
    new (...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
}

interface CallableFunction extends Function {
    /**
     * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
     * @param thisArg The object to be used as the this object.
     */
    apply<T, R>(this: (this: T) => R, thisArg: T): R;

    /**
     * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
     * @param thisArg The object to be used as the this object.
     * @param args An array of argument values to be passed to the function.
     */
    apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;

    /**
     * Calls the function with the specified object as the this value and the specified rest arguments as the arguments.
     * @param thisArg The object to be used as the this object.
     * @param args Argument values to be passed to the function.
     */
    call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;

    /**
     * For a given function, creates a bound function that has the same body as the original function.
     * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
     * @param thisArg The object to be used as the this object.
     */
    bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;

    /**
     * For a given function, creates a bound function that has the same body as the original function.
     * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
     * @param thisArg The object to be used as the this object.
     * @param args Arguments to bind to the parameters of the function.
     */
    bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
}

interface NewableFunction extends Function {
    /**
     * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
     * @param thisArg The object to be used as the this object.
     */
    apply<T>(this: new () => T, thisArg: T): void;
    /**
     * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
     * @param thisArg The object to be used as the this object.
     * @param args An array of argument values to be passed to the function.
     */
    apply<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, args: A): void;

    /**
     * Calls the function with the specified object as the this value and the specified rest arguments as the arguments.
     * @param thisArg The object to be used as the this object.
     * @param args Argument values to be passed to the function.
     */
    call<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, ...args: A): void;

    /**
     * For a given function, creates a bound function that has the same body as the original function.
     * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
     * @param thisArg The object to be used as the this object.
     */
    bind<T>(this: T, thisArg: any): T;

    /**
     * For a given function, creates a bound function that has the same body as the original function.
     * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
     * @param thisArg The object to be used as the this object.
     * @param args Arguments to bind to the parameters of the function.
     */
    bind<A extends any[], B extends any[], R>(this: new (...args: [...A, ...B]) => R, thisArg: any, ...args: A): new (...args: B) => R;
}

interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}

interface String {
    /** Returns a string representation of a string. */
    toString(): string;

    /**
     * Returns the character at the specified index.
     * @param pos The zero-based index of the desired character.
     */
    charAt(pos: number): string;

    /**
     * Returns the Unicode value of the character at the specified location.
     * @param index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.
     */
    charCodeAt(index: number): number;

    /**
     * Returns a string that contains the concatenation of two or more strings.
     * @param strings The strings to append to the end of the string.
     */
    concat(...strings: string[]): string;

    /**
     * Returns the position of the first occurrence of a substring.
     * @param searchString The substring to search for in the string
     * @param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
     */
    indexOf(searchString: string, position?: number): number;

    /**
     * Returns the last occurrence of a substring in the string.
     * @param searchString The substring to search for.
     * @param position The index at which to begin searching. If omitted, the search begins at the end of the string.
     */
    lastIndexOf(searchString: string, position?: number): number;

    /**
     * Determines whether two strings are equivalent in the current locale.
     * @param that String to compare to target string
     */
    localeCompare(that: string): number;

    /**
     * Matches a string with a regular expression, and returns an array containing the results of that search.
     * @param regexp A variable name or string literal containing the regular expression pattern and flags.
     */
    match(regexp: string | RegExp): RegExpMatchArray | null;

    /**
     * Replaces text in a string, using a regular expression or search string.
     * @param searchValue A string or regular expression to search for.
     * @param replaceValue A string containing the text to replace. When the {@linkcode searchValue} is a `RegExp`, all matches are replaced if the `g` flag is set (or only those matches at the beginning, if the `y` flag is also present). Otherwise, only the first match of {@linkcode searchValue} is replaced.
     */
    replace(searchValue: string | RegExp, replaceValue: string): string;

    /**
     * Replaces text in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replacer A function that returns the replacement text.
     */
    replace(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;

    /**
     * Finds the first substring match in a regular expression search.
     * @param regexp The regular expression pattern and applicable flags.
     */
    search(regexp: string | RegExp): number;

    /**
     * Returns a section of a string.
     * @param start The index to the beginning of the specified portion of stringObj.
     * @param end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.
     * If this value is not specified, the substring continues to the end of stringObj.
     */
    slice(start?: number, end?: number): string;

    /**
     * Split a string into substrings using the specified separator and return them as an array.
     * @param separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
     * @param limit A value used to limit the number of elements returned in the array.
     */
    split(separator: string | RegExp, limit?: number): string[];

    /**
     * Returns the substring at the specified location within a String object.
     * @param start The zero-based index number indicating the beginning of the substring.
     * @param end Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.
     * If end is omitted, the characters from start through the end of the original string are returned.
     */
    substring(start: number, end?: number): string;

    /** Converts all the alphabetic characters in a string to lowercase. */
    toLowerCase(): string;

    /** Converts all alphabetic characters to lowercase, taking into account the host environment's current locale. */
    toLocaleLowerCase(locales?: string | string[]): string;

    /** Converts all the alphabetic characters in a string to uppercase. */
    toUpperCase(): string;

    /** Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale. */
    toLocaleUpperCase(locales?: string | string[]): string;

    /** Removes the leading and trailing white space and line terminator characters from a string. */
    trim(): string;

    /** Returns the length of a String object. */
    readonly length: number;

    // IE extensions
    /**
     * Gets a substring beginning at the specified location and having the specified length.
     * @deprecated A legacy feature for browser compatibility
     * @param from The starting position of the desired substring. The index of the first character in the string is zero.
     * @param length The number of characters to include in the returned substring.
     */
    substr(from: number, length?: number): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): string;

    readonly [index: number]: string;
}

interface StringConstructor {
    new (value?: any): String;
    (value?: any): string;
    readonly prototype: String;
    fromCharCode(...codes: number[]): string;
}

interface Boolean {
    /** Returns the primitive value of the specified object. */
    valueOf(): boolean;
}

interface BooleanConstructor {
    new (value?: any): Boolean;
    <T>(value?: T): boolean;
    readonly prototype: Boolean;
}

interface Number {
    /**
     * Returns a string representation of an object.
     * @param radix Specifies a radix for converting numeric values to strings. This value is only used for numbers.
     */
    toString(radix?: number): string;

    /**
     * Returns a string representing a number in fixed-point notation.
     * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
     */
    toFixed(fractionDigits?: number): string;

    /**
     * Returns a string containing a number represented in exponential notation.
     * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Returns a string containing a number represented either in exponential or fixed-point notation with a specified number of digits.
     * @param precision Number of significant digits. Must be in the range 1 - 21, inclusive.
     */
    toPrecision(precision?: number): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): number;
}

interface NumberConstructor {
    new (value?: any): Number;
    (value?: any): number;
    readonly prototype: Number;

    /** The largest number that can be represented in JavaScript. Equal to approximately 1.79E+308. */
    readonly MAX_VALUE: number;

    /** The closest number to zero that can be represented in JavaScript. Equal to approximately 5.00E-324. */
    readonly MIN_VALUE: number;

    /**
     * A value that is not a number.
     * In equality comparisons, NaN does not equal any value, including itself. To test whether a value is equivalent to NaN, use the isNaN function.
     */
    readonly NaN: number;

    /**
     * A value that is less than the largest negative number that can be represented in JavaScript.
     * JavaScript displays NEGATIVE_INFINITY values as -infinity.
     */
    readonly NEGATIVE_INFINITY: number;

    /**
     * A value greater than the largest number that can be represented in JavaScript.
     * JavaScript displays POSITIVE_INFINITY values as infinity.
     */
    readonly POSITIVE_INFINITY: number;
}

interface RegExpMatchArray extends Array<string> {
    /**
     * The index of the search at which the result was found.
     */
    index?: number;
    /**
     * A copy of the search string.
     */
    input?: string;
    /**
     * The first match. This will always be present because `null` will be returned if there are no matches.
     */
    0: string;
}

interface RegExpExecArray extends Array<string> {
    /**
     * The index of the search at which the result was found.
     */
    index: number;
    /**
     * A copy of the search string.
     */
    input: string;
    /**
     * The first match. This will always be present because `null` will be returned if there are no matches.
     */
    0: string;
}

interface RegExp {
    /**
     * Executes a search on a string using a regular expression pattern, and returns an array containing the results of that search.
     * @param string The String object or string literal on which to perform the search.
     */
    exec(string: string): RegExpExecArray | null;

    /**
     * Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
     * @param string String on which to perform the search.
     */
    test(string: string): boolean;

    /** Returns a copy of the text of the regular expression pattern. Read-only. The regExp argument is a Regular expression object. It can be a variable name or a literal. */
    readonly source: string;

    /** Returns a Boolean value indicating the state of the global flag (g) used with a regular expression. Default is false. Read-only. */
    readonly global: boolean;

    /** Returns a Boolean value indicating the state of the ignoreCase flag (i) used with a regular expression. Default is false. Read-only. */
    readonly ignoreCase: boolean;

    /** Returns a Boolean value indicating the state of the multiline flag (m) used with a regular expression. Default is false. Read-only. */
    readonly multiline: boolean;

    lastIndex: number;

    // Non-standard extensions
    /** @deprecated A legacy feature for browser compatibility */
    compile(pattern: string, flags?: string): this;
}

interface RegExpConstructor {
    new (pattern: RegExp | string): RegExp;
    new (pattern: string, flags?: string): RegExp;
    (pattern: RegExp | string): RegExp;
    (pattern: string, flags?: string): RegExp;
    readonly "prototype": RegExp;

    // Non-standard extensions
    /** @deprecated A legacy feature for browser compatibility */
    "$1": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$2": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$3": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$4": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$5": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$6": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$7": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$8": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$9": string;
    /** @deprecated A legacy feature for browser compatibility */
    "input": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$_": string;
    /** @deprecated A legacy feature for browser compatibility */
    "lastMatch": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$&": string;
    /** @deprecated A legacy feature for browser compatibility */
    "lastParen": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$+": string;
    /** @deprecated A legacy feature for browser compatibility */
    "leftContext": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$`": string;
    /** @deprecated A legacy feature for browser compatibility */
    "rightContext": string;
    /** @deprecated A legacy feature for browser compatibility */
    "$'": string;
}

interface JSON {
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object.
     * @param text A valid JSON string.
     * @param reviver A function that transforms the results. This function is called for each member of the object.
     * If a member contains nested objects, the nested objects are transformed before the parent object is.
     * @throws {SyntaxError} If `text` is not valid JSON.
     */
    parse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer A function that transforms the results.
     * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * @throws {TypeError} If a circular reference or a BigInt value is found.
     */
    stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
     * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     * @throws {TypeError} If a circular reference or a BigInt value is found.
     */
    stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): string;
}

interface ReadonlyArray<T> {
    /**
     * Gets the length of the array. This is a number one higher than the highest element defined in an array.
     */
    readonly length: number;
    /**
     * Returns a string representation of an array.
     */
    toString(): string;
    /**
     * Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.
     */
    toLocaleString(): string;
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat(...items: ConcatArray<T>[]): T[];
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat(...items: (T | ConcatArray<T>)[]): T[];
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;
    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): T[];
    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    indexOf(searchElement: T, fromIndex?: number): number;
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: any): this is readonly S[];
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): boolean;
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): boolean;
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: T, index: number, array: readonly T[]) => void, thisArg?: any): void;
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(callbackfn: (value: T, index: number, array: readonly T[]) => U, thisArg?: any): U[];
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: any): S[];
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): T[];
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T, initialValue: T): T;
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: readonly T[]) => U, initialValue: U): U;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T, initialValue: T): T;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: readonly T[]) => U, initialValue: U): U;

    readonly [n: number]: T;
}

interface ConcatArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    join(separator?: string): string;
    slice(start?: number, end?: number): T[];
}

interface Array<T> {
    /**
     * Gets or sets the length of the array. This is a number one higher than the highest index in the array.
     */
    length: number;
    /**
     * Returns a string representation of an array.
     */
    toString(): string;
    /**
     * Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.
     */
    toLocaleString(): string;
    /**
     * Removes the last element from an array and returns it.
     * If the array is empty, undefined is returned and the array is not modified.
     */
    pop(): T | undefined;
    /**
     * Appends new elements to the end of an array, and returns the new length of the array.
     * @param items New elements to add to the array.
     */
    push(...items: T[]): number;
    /**
     * Combines two or more arrays.
     * This method returns a new array without modifying any existing arrays.
     * @param items Additional arrays and/or items to add to the end of the array.
     */
    concat(...items: ConcatArray<T>[]): T[];
    /**
     * Combines two or more arrays.
     * This method returns a new array without modifying any existing arrays.
     * @param items Additional arrays and/or items to add to the end of the array.
     */
    concat(...items: (T | ConcatArray<T>)[]): T[];
    /**
     * Adds all the elements of an array into a string, separated by the specified separator string.
     * @param separator A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;
    /**
     * Reverses the elements in an array in place.
     * This method mutates the array and returns a reference to the same array.
     */
    reverse(): T[];
    /**
     * Removes the first element from an array and returns it.
     * If the array is empty, undefined is returned and the array is not modified.
     */
    shift(): T | undefined;
    /**
     * Returns a copy of a section of an array.
     * For both start and end, a negative index can be used to indicate an offset from the end of the array.
     * For example, -2 refers to the second to last element of the array.
     * @param start The beginning index of the specified portion of the array.
     * If start is undefined, then the slice begins at index 0.
     * @param end The end index of the specified portion of the array. This is exclusive of the element at the index 'end'.
     * If end is undefined, then the slice extends to the end of the array.
     */
    slice(start?: number, end?: number): T[];
    /**
     * Sorts an array in place.
     * This method mutates the array and returns a reference to the same array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: T, b: T) => number): this;
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove. Omitting this argument will remove all elements from the start
     * paramater location to end of the array. If value of this argument is either a negative number, zero, undefined, or a type
     * that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements.
     * @returns An array containing the elements that were deleted.
     */
    splice(start: number, deleteCount?: number): T[];
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove. If value of this argument is either a negative number, zero,
     * undefined, or a type that cannot be converted to an integer, the function will evaluate the argument as zero and
     * not remove any elements.
     * @param items Elements to insert into the array in place of the deleted elements.
     * @returns An array containing the elements that were deleted.
     */
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    /**
     * Inserts new elements at the start of an array, and returns the new length of the array.
     * @param items Elements to insert at the start of the array.
     */
    unshift(...items: T[]): number;
    /**
     * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    indexOf(searchElement: T, fromIndex?: number): number;
    /**
     * Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.
     */
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[];
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;

    [n: number]: T;
}

interface ArrayConstructor {
    new (arrayLength?: number): any[];
    new <T>(arrayLength: number): T[];
    new <T>(...items: T[]): T[];
    (arrayLength?: number): any[];
    <T>(arrayLength: number): T[];
    <T>(...items: T[]): T[];
    isArray(arg: any): arg is any[];
    readonly prototype: any[];
}

interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
}

/**
 * Represents a raw buffer of binary data, which is used to store data for the
 * different typed arrays. ArrayBuffers cannot be read from or written to directly,
 * but can be passed to a typed array or DataView Object to interpret the raw
 * buffer as needed.
 */
interface ArrayBuffer {
    /**
     * Read-only. The length of the ArrayBuffer (in bytes).
     */
    readonly byteLength: number;

    /**
     * Returns a section of an ArrayBuffer.
     */
    slice(begin?: number, end?: number): ArrayBuffer;
}

/**
 * Allowed ArrayBuffer types for the buffer of an ArrayBufferView and related Typed Arrays.
 */
interface ArrayBufferTypes {
    ArrayBuffer: ArrayBuffer;
}

interface ArrayBufferConstructor {
    readonly prototype: ArrayBuffer;
    new (byteLength: number): ArrayBuffer;
    isView(arg: any): arg is ArrayBufferView;
}

interface ArrayBufferView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;
}

/**
 * A typed array of 8-bit integer values. The contents are initialized to 0. If the requested
 * number of bytes could not be allocated an exception is raised.
 */
interface Int8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Int8Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Int8Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Int8Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Int8Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Int8Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Int8ArrayConstructor {
    readonly prototype: Int8Array<ArrayBufferLike>;
    new (length: number): Int8Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Int8Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Int8Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Int8Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Int8Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Int8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Int8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Int8Array<ArrayBuffer>;
}

/**
 * A typed array of 8-bit unsigned integer values. The contents are initialized to 0. If the
 * requested number of bytes could not be allocated an exception is raised.
 */
interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint8Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint8Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Uint8Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Uint8Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Uint8Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Uint8ArrayConstructor {
    readonly prototype: Uint8Array<ArrayBufferLike>;
    new (length: number): Uint8Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint8Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint8Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint8Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Uint8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Uint8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint8Array<ArrayBuffer>;
}

/**
 * A typed array of 16-bit signed integer values. The contents are initialized to 0. If the
 * requested number of bytes could not be allocated an exception is raised.
 */
interface Int16Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Int16Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Int16Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Int16Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Int16Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Int16Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Int16ArrayConstructor {
    readonly prototype: Int16Array<ArrayBufferLike>;
    new (length: number): Int16Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Int16Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Int16Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Int16Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Int16Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Int16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Int16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Int16Array<ArrayBuffer>;
}

/**
 * A typed array of 16-bit unsigned integer values. The contents are initialized to 0. If the
 * requested number of bytes could not be allocated an exception is raised.
 */
interface Uint16Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint16Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint16Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Uint16Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Uint16Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Uint16Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Uint16ArrayConstructor {
    readonly prototype: Uint16Array<ArrayBufferLike>;
    new (length: number): Uint16Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint16Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint16Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint16Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint16Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Uint16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Uint16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint16Array<ArrayBuffer>;
}

/**
 * A typed array of 32-bit signed integer values. The contents are initialized to 0. If the
 * requested number of bytes could not be allocated an exception is raised.
 */
interface Int32Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Int32Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Int32Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Int32Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Int32Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Int32Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Int32ArrayConstructor {
    readonly prototype: Int32Array<ArrayBufferLike>;
    new (length: number): Int32Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Int32Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Int32Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Int32Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Int32Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Int32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Int32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Int32Array<ArrayBuffer>;
}

/**
 * A typed array of 32-bit unsigned integer values. The contents are initialized to 0. If the
 * requested number of bytes could not be allocated an exception is raised.
 */
interface Uint32Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint32Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint32Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Uint32Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Uint32Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Uint32Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Uint32ArrayConstructor {
    readonly prototype: Uint32Array<ArrayBufferLike>;
    new (length: number): Uint32Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint32Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint32Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint32Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint32Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Uint32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Uint32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint32Array<ArrayBuffer>;
}

/**
 * A typed array of 32-bit float values. The contents are initialized to 0. If the requested number
 * of bytes could not be allocated an exception is raised.
 */
interface Float32Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Float32Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Float32Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Float32Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Float32Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Float32Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Float32ArrayConstructor {
    readonly prototype: Float32Array<ArrayBufferLike>;
    new (length: number): Float32Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Float32Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Float32Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Float32Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Float32Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Float32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Float32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Float32Array<ArrayBuffer>;
}

/**
 * A typed array of 64-bit float values. The contents are initialized to 0. If the requested
 * number of bytes could not be allocated an exception is raised.
 */
interface Float64Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: TArrayBuffer;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls
     * the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Float64Array<ArrayBuffer>;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Float64Array<ArrayBuffer>;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): this;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): Float64Array<ArrayBuffer>;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param predicate A function that accepts up to three arguments. The some method calls
     * the predicate function for each element in the array until the predicate returns a value
     * which is coercible to the Boolean value true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending order.
     * ```ts
     * [11,2,22,1].sort((a, b) => a - b)
     * ```
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new Float64Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin?: number, end?: number): Float64Array<TArrayBuffer>;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): this;

    [index: number]: number;
}

interface Float64ArrayConstructor {
    readonly prototype: Float64Array<ArrayBufferLike>;
    new (length: number): Float64Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Float64Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Float64Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Float64Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Float64Array<ArrayBuffer>;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: number[]): Float64Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     */
    from(arrayLike: ArrayLike<number>): Float64Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Float64Array<ArrayBuffer>;
}

interface String {
    /**
     * Determines whether two strings are equivalent in the current or specified locale.
     * @param that String to compare to target string
     * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details.
     * @param options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details.
     */
    localeCompare(that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
}

interface Number {
    /**
     * Converts a number to a string by using the current or specified locale.
     * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
     * @param options An object that contains one or more properties that specify comparison options.
     */
    toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): string;
}

declare type PropertyKey = string | number | symbol;

/**
 * Extracts the type of the 'this' parameter of a function type, or 'unknown' if the function type has no 'this' parameter.
 */
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown;

/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;

/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};

/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type ArrayBufferLike = ArrayBufferTypes[keyof ArrayBufferTypes];

declare var NaN: number;

declare var Infinity: number;

/**
 * Provides functionality common to all JavaScript objects.
 */
declare var Object: ObjectConstructor;

declare var Function: FunctionConstructor;

/**
 * Allows manipulation and formatting of text strings and determination and location of substrings within strings.
 */
declare var String: StringConstructor;

declare var Boolean: BooleanConstructor;

/** An object that represents a number of any kind. All JavaScript numbers are 64-bit floating-point numbers. */
declare var Number: NumberConstructor;

declare var RegExp: RegExpConstructor;

/**
 * An intrinsic object that provides functions to convert JavaScript values to and from the JavaScript Object Notation (JSON) format.
 */
declare var JSON: JSON;

declare var Array: ArrayConstructor;

declare var ArrayBuffer: ArrayBufferConstructor;

declare var Int8Array: Int8ArrayConstructor;

declare var Uint8Array: Uint8ArrayConstructor;

declare var Int16Array: Int16ArrayConstructor;

declare var Uint16Array: Uint16ArrayConstructor;

declare var Int32Array: Int32ArrayConstructor;

declare var Uint32Array: Uint32ArrayConstructor;

declare var Float32Array: Float32ArrayConstructor;

declare var Float64Array: Float64ArrayConstructor;

/**
 * Evaluates JavaScript code and executes it.
 * @param x A String value that contains valid JavaScript code.
 */
declare function eval(x: string): any;

interface Set<T> {
    /**
     * @returns a new Set containing all the elements in this Set and also all the elements in the argument.
     */
    union<U>(other: ReadonlySetLike<U>): Set<T | U>;
    /**
     * @returns a new Set containing all the elements which are both in this Set and in the argument.
     */
    intersection<U>(other: ReadonlySetLike<U>): Set<T & U>;
    /**
     * @returns a new Set containing all the elements in this Set which are not also in the argument.
     */
    difference<U>(other: ReadonlySetLike<U>): Set<T>;
    /**
     * @returns a new Set containing all the elements which are in either this Set or in the argument, but not in both.
     */
    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U>;
    /**
     * @returns a boolean indicating whether all the elements in this Set are also in the argument.
     */
    isSubsetOf(other: ReadonlySetLike<unknown>): boolean;
    /**
     * @returns a boolean indicating whether all the elements in the argument are also in this Set.
     */
    isSupersetOf(other: ReadonlySetLike<unknown>): boolean;
    /**
     * @returns a boolean indicating whether this Set has no elements in common with the argument.
     */
    isDisjointFrom(other: ReadonlySetLike<unknown>): boolean;
}

interface Function {
    [Symbol.metadata]: DecoratorMetadata | null;
}

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
declare type ItemName = "Wood Pickaxe"|"Stone Pickaxe"|"Iron Pickaxe"|"Gold Pickaxe"|"Diamond Pickaxe"|"Moonstone Pickaxe"|"Golem Pickaxe"|"Wood Axe"|"Stone Axe"|"Iron Axe"|"Gold Axe"|"Diamond Axe"|"Moonstone Axe"|"Artisan Axe"|"Wood Spade"|"Stone Spade"|"Iron Spade"|"Gold Spade"|"Diamond Spade"|"Wood Sword"|"Stone Sword"|"Iron Sword"|"Gold Sword"|"Diamond Sword"|"Knight Sword"|"Wood Hoe"|"Stone Hoe"|"Iron Hoe"|"Gold Hoe"|"Diamond Hoe"|"Wood Helmet"|"Iron Helmet"|"Gold Helmet"|"Diamond Helmet"|"Wood Chestplate"|"Iron Chestplate"|"Gold Chestplate"|"Diamond Chestplate"|"Fur Chestplate"|"Wood Leggings"|"Iron Leggings"|"Gold Leggings"|"Diamond Leggings"|"Wood Boots"|"Iron Boots"|"Gold Boots"|"Diamond Boots"|"Spiked Boots"|"Wood Gauntlets"|"Iron Gauntlets"|"Gold Gauntlets"|"Diamond Gauntlets"|"White Wood Helmet"|"White Wood Chestplate"|"White Wood Leggings"|"White Wood Boots"|"White Wood Gauntlets"|"Orange Wood Helmet"|"Orange Wood Chestplate"|"Orange Wood Leggings"|"Orange Wood Boots"|"Orange Wood Gauntlets"|"Magenta Wood Helmet"|"Magenta Wood Chestplate"|"Magenta Wood Leggings"|"Magenta Wood Boots"|"Magenta Wood Gauntlets"|"Light Blue Wood Helmet"|"Light Blue Wood Chestplate"|"Light Blue Wood Leggings"|"Light Blue Wood Boots"|"Light Blue Wood Gauntlets"|"Yellow Wood Helmet"|"Yellow Wood Chestplate"|"Yellow Wood Leggings"|"Yellow Wood Boots"|"Yellow Wood Gauntlets"|"Lime Wood Helmet"|"Lime Wood Chestplate"|"Lime Wood Leggings"|"Lime Wood Boots"|"Lime Wood Gauntlets"|"Pink Wood Helmet"|"Pink Wood Chestplate"|"Pink Wood Leggings"|"Pink Wood Boots"|"Pink Wood Gauntlets"|"Gray Wood Helmet"|"Gray Wood Chestplate"|"Gray Wood Leggings"|"Gray Wood Boots"|"Gray Wood Gauntlets"|"Light Gray Wood Helmet"|"Light Gray Wood Chestplate"|"Light Gray Wood Leggings"|"Light Gray Wood Boots"|"Light Gray Wood Gauntlets"|"Cyan Wood Helmet"|"Cyan Wood Chestplate"|"Cyan Wood Leggings"|"Cyan Wood Boots"|"Cyan Wood Gauntlets"|"Purple Wood Helmet"|"Purple Wood Chestplate"|"Purple Wood Leggings"|"Purple Wood Boots"|"Purple Wood Gauntlets"|"Blue Wood Helmet"|"Blue Wood Chestplate"|"Blue Wood Leggings"|"Blue Wood Boots"|"Blue Wood Gauntlets"|"Brown Wood Helmet"|"Brown Wood Chestplate"|"Brown Wood Leggings"|"Brown Wood Boots"|"Brown Wood Gauntlets"|"Green Wood Helmet"|"Green Wood Chestplate"|"Green Wood Leggings"|"Green Wood Boots"|"Green Wood Gauntlets"|"Red Wood Helmet"|"Red Wood Chestplate"|"Red Wood Leggings"|"Red Wood Boots"|"Red Wood Gauntlets"|"Black Wood Helmet"|"Black Wood Chestplate"|"Black Wood Leggings"|"Black Wood Boots"|"Black Wood Gauntlets"|"Shears"|"Artisan Shears"|"Stick"|"Coal"|"Raw Iron"|"Iron Bar"|"Iron Fragment"|"Raw Gold"|"Gold Bar"|"Gold Fragment"|"Diamond"|"Diamond Fragment"|"Moonstone"|"Moonstone Fragment"|"Bowl"|"Partially Full Bowl of Cranberries"|"Half Full Bowl of Cranberries"|"Nearly Full Bowl of Cranberries"|"Bowl of Cranberries"|"Mushroom Soup"|"Cotton"|"Bucket"|"Water Bucket"|"Lava Bucket"|"Boat"|"INTERNAL_MESH_Boat"|"Obsidian Boat"|"INTERNAL_MESH_Obsidian Boat"|"Wood Hang Glider"|"INTERNAL_MESH_Wood Hang Glider"|"Iron Hang Glider"|"INTERNAL_MESH_Iron Hang Glider"|"Gold Hang Glider"|"INTERNAL_MESH_Gold Hang Glider"|"Diamond Hang Glider"|"INTERNAL_MESH_Diamond Hang Glider"|"INTERNAL_MESH_Kart"|"Snowball"|"Snowball Launcher"|"Pebble"|"Reinforced Pebble"|"Bullet"|"Ball"|"Reinforced Ball"|"Moonstone Orb"|"Fireball"|"Bouncy Bomb"|"RPG"|"Obby RPG"|"Super RPG"|"Grenade Launcher"|"Iceball"|"67 Base Projectile"|"67 Boosted Projectile"|"Capitano Grenade"|"Scatter Pellet"|"Wood Bow"|"Wood Bow|meta|charging2"|"Wood Bow|meta|charging3"|"Wood Bow|meta|charging4"|"Stone Bow"|"Stone Bow|meta|charging2"|"Stone Bow|meta|charging3"|"Stone Bow|meta|charging4"|"Iron Bow"|"Iron Bow|meta|charging2"|"Iron Bow|meta|charging3"|"Iron Bow|meta|charging4"|"Gold Bow"|"Gold Bow|meta|charging2"|"Gold Bow|meta|charging3"|"Gold Bow|meta|charging4"|"Diamond Bow"|"Diamond Bow|meta|charging2"|"Diamond Bow|meta|charging3"|"Diamond Bow|meta|charging4"|"Wood Crossbow"|"Wood Crossbow|meta|charging2"|"Wood Crossbow|meta|charging3"|"Wood Crossbow|meta|charging4"|"Stone Crossbow"|"Stone Crossbow|meta|charging2"|"Stone Crossbow|meta|charging3"|"Stone Crossbow|meta|charging4"|"Iron Crossbow"|"Iron Crossbow|meta|charging2"|"Iron Crossbow|meta|charging3"|"Iron Crossbow|meta|charging4"|"Gold Crossbow"|"Gold Crossbow|meta|charging2"|"Gold Crossbow|meta|charging3"|"Gold Crossbow|meta|charging4"|"Diamond Crossbow"|"Diamond Crossbow|meta|charging2"|"Diamond Crossbow|meta|charging3"|"Diamond Crossbow|meta|charging4"|"Wood Crossbow Charged"|"Stone Crossbow Charged"|"Iron Crossbow Charged"|"Gold Crossbow Charged"|"Diamond Crossbow Charged"|"Arrow"|"Compass"|"Compass|meta|dir2"|"Compass|meta|dir3"|"Compass|meta|dir4"|"Compass|meta|dir5"|"Compass|meta|dir6"|"Compass|meta|dir7"|"Compass|meta|dir8"|"Compass|meta|dir9"|"Compass|meta|dir10"|"Compass|meta|dir11"|"Compass|meta|dir12"|"Bread"|"Bowl of Rice"|"Apple"|"Plum"|"Coconut"|"Cracked Coconut"|"Pear"|"Cherry"|"Banana"|"Watermelon Slice"|"Gold Watermelon Slice"|"Melon Slice"|"Gold Melon Slice"|"Pumpkin Pie"|"Corn"|"Cornbread"|"Chili Pepper"|"Mango"|"Carrot"|"Raw Potato"|"Baked Potato"|"Beetroot"|"Raw Porkchop"|"Cooked Porkchop"|"Raw Beef"|"Steak"|"Raw Mutton"|"Cooked Mutton"|"Raw Venison"|"Cooked Venison"|"Rotten Flesh"|"Rotten Brain"|"Bone"|"Bone Meal"|"Leather"|"Saddle"|"Spirit Saddle"|"Fur"|"Golem Eye"|"Knight Heart"|"Name Tag"|"Book"|"Empty Bottle"|"Water Bottle"|"Slowness Potion"|"Slowness Potion II"|"Splash Slowness Potion"|"Splash Slowness Potion II"|"Arrow of Slowness"|"Poison Potion"|"Poison Potion II"|"Splash Poison Potion"|"Splash Poison Potion II"|"Arrow of Poison"|"Weakness Potion"|"Weakness Potion II"|"Splash Weakness Potion"|"Splash Weakness Potion II"|"Arrow of Weakness"|"Instant Damage Potion"|"Instant Damage Potion II"|"Splash Instant Damage Potion"|"Splash Instant Damage Potion II"|"Arrow of Instant Damage"|"Milk Potion"|"Splash Milk Potion"|"Arrow of Milk"|"Speed Potion"|"Speed Potion II"|"Splash Speed Potion"|"Splash Speed Potion II"|"Arrow of Speed"|"Defense Potion"|"Defense Potion II"|"Splash Defense Potion"|"Splash Defense Potion II"|"Arrow of Defense"|"Strength Potion"|"Strength Potion II"|"Splash Strength Potion"|"Splash Strength Potion II"|"Arrow of Strength"|"Invisibility Potion"|"Splash Invisibility Potion"|"Arrow of Invisibility"|"Jump Potion"|"Jump Potion II"|"Splash Jump Potion"|"Splash Jump Potion II"|"Arrow of Jumping"|"Knockback Potion"|"Splash Knockback Potion"|"Splash Knockback Potion II"|"Arrow of Knockback"|"Regeneration Potion"|"Regeneration Potion II"|"Splash Regeneration Potion"|"Splash Regeneration Potion II"|"Arrow of Regeneration"|"Instant Healing Potion"|"Instant Healing Potion II"|"Splash Instant Healing Potion"|"Splash Instant Healing Potion II"|"Arrow of Instant Healing"|"Haste Potion"|"Haste Potion II"|"Splash Haste Potion"|"Splash Haste Potion II"|"Arrow of Haste"|"Shield Potion"|"Shield Potion II"|"Splash Shield Potion"|"Splash Shield Potion II"|"Arrow of Shield"|"Double Jump Potion"|"Splash Double Jump Potion"|"Arrow of Double Jump"|"Heat Resistance Potion"|"Splash Heat Resistance Potion"|"Arrow of Heat Resistance"|"X-Ray Vision Potion"|"Splash X-Ray Vision Potion"|"Arrow of X-Ray Vision"|"Mining Yield Potion"|"Mining Yield Potion II"|"Splash Mining Yield Potion"|"Splash Mining Yield Potion II"|"Arrow of Mining Yield"|"Brain Rot Potion"|"Splash Brain Rot Potion"|"Arrow of Brain Rot"|"Chaos Potion"|"Ammo"|"AK-47"|"AK-47|RequiresAmmo"|"M16"|"M16|RequiresAmmo"|"MP40"|"MP40|RequiresAmmo"|"TAR-21"|"TAR-21|RequiresAmmo"|"M1911"|"M1911|RequiresAmmo"|"One Shot Pistol"|"One Shot Pistol|RequiresAmmo"|"Double Barrel"|"Double Barrel|RequiresAmmo"|"AWP"|"AWP|RequiresAmmo"|"Deagle"|"Deagle|RequiresAmmo"|"Striker-12"|"Striker-12|RequiresAmmo"|"VSR"|"VSR|RequiresAmmo"|"DMR"|"DMR|RequiresAmmo"|"Minigun"|"Minigun|RequiresAmmo"|"FMR"|"FMR|RequiresAmmo"|"SKAR"|"SKAR|RequiresAmmo"|"Block-19"|"Block-19|RequiresAmmo"|"Mini Izu"|"Mini Izu|RequiresAmmo"|"GPMG"|"GPMG|RequiresAmmo"|"Gold Coin"|"Updraft"|"Snowdash"|"Floor Creator"|"Moonstone Remote Explosive"|"Moonstone Remote"|"Ice Bridge"|"Yellow Balloon"|"White Balloon"|"Red Balloon"|"Purple Balloon"|"Pink Balloon"|"Orange Balloon"|"Magenta Balloon"|"Lime Balloon"|"Light Gray Balloon"|"Light Blue Balloon"|"Green Balloon"|"Gray Balloon"|"Cyan Balloon"|"Brown Balloon"|"Blue Balloon"|"Black Balloon"|"INTERNAL_MESH_Yellow Balloon"|"INTERNAL_MESH_White Balloon"|"INTERNAL_MESH_Red Balloon"|"INTERNAL_MESH_Purple Balloon"|"INTERNAL_MESH_Pink Balloon"|"INTERNAL_MESH_Orange Balloon"|"INTERNAL_MESH_Magenta Balloon"|"INTERNAL_MESH_Lime Balloon"|"INTERNAL_MESH_Light Gray Balloon"|"INTERNAL_MESH_Light Blue Balloon"|"INTERNAL_MESH_Green Balloon"|"INTERNAL_MESH_Gray Balloon"|"INTERNAL_MESH_Cyan Balloon"|"INTERNAL_MESH_Brown Balloon"|"INTERNAL_MESH_Blue Balloon"|"INTERNAL_MESH_Black Balloon"|"Yellow Popup Tower"|"White Popup Tower"|"Red Popup Tower"|"Purple Popup Tower"|"Pink Popup Tower"|"Orange Popup Tower"|"Magenta Popup Tower"|"Lime Popup Tower"|"Light Gray Popup Tower"|"Light Blue Popup Tower"|"Green Popup Tower"|"Gray Popup Tower"|"Cyan Popup Tower"|"Brown Popup Tower"|"Blue Popup Tower"|"Black Popup Tower"|"Yellow Paintball Gun"|"White Paintball Gun"|"Red Paintball Gun"|"Purple Paintball Gun"|"Pink Paintball Gun"|"Orange Paintball Gun"|"Magenta Paintball Gun"|"Lime Paintball Gun"|"Light Gray Paintball Gun"|"Light Blue Paintball Gun"|"Green Paintball Gun"|"Gray Paintball Gun"|"Cyan Paintball Gun"|"Brown Paintball Gun"|"Blue Paintball Gun"|"Black Paintball Gun"|"Yellow Paintball"|"White Paintball"|"Red Paintball"|"Purple Paintball"|"Pink Paintball"|"Orange Paintball"|"Magenta Paintball"|"Lime Paintball"|"Light Gray Paintball"|"Light Blue Paintball"|"Green Paintball"|"Gray Paintball"|"Cyan Paintball"|"Brown Paintball"|"Blue Paintball"|"Black Paintball"|"Yellow Heavy Paintball Gun"|"White Heavy Paintball Gun"|"Red Heavy Paintball Gun"|"Purple Heavy Paintball Gun"|"Pink Heavy Paintball Gun"|"Orange Heavy Paintball Gun"|"Magenta Heavy Paintball Gun"|"Lime Heavy Paintball Gun"|"Light Gray Heavy Paintball Gun"|"Light Blue Heavy Paintball Gun"|"Green Heavy Paintball Gun"|"Gray Heavy Paintball Gun"|"Cyan Heavy Paintball Gun"|"Brown Heavy Paintball Gun"|"Blue Heavy Paintball Gun"|"Black Heavy Paintball Gun"|"Yellow Paintball Explosive Item"|"White Paintball Explosive Item"|"Red Paintball Explosive Item"|"Purple Paintball Explosive Item"|"Pink Paintball Explosive Item"|"Orange Paintball Explosive Item"|"Magenta Paintball Explosive Item"|"Lime Paintball Explosive Item"|"Light Gray Paintball Explosive Item"|"Light Blue Paintball Explosive Item"|"Green Paintball Explosive Item"|"Gray Paintball Explosive Item"|"Cyan Paintball Explosive Item"|"Brown Paintball Explosive Item"|"Blue Paintball Explosive Item"|"Black Paintball Explosive Item"|"Yellow Sticky Paintball Explosive Item"|"White Sticky Paintball Explosive Item"|"Red Sticky Paintball Explosive Item"|"Purple Sticky Paintball Explosive Item"|"Pink Sticky Paintball Explosive Item"|"Orange Sticky Paintball Explosive Item"|"Magenta Sticky Paintball Explosive Item"|"Lime Sticky Paintball Explosive Item"|"Light Gray Sticky Paintball Explosive Item"|"Light Blue Sticky Paintball Explosive Item"|"Green Sticky Paintball Explosive Item"|"Gray Sticky Paintball Explosive Item"|"Cyan Sticky Paintball Explosive Item"|"Brown Sticky Paintball Explosive Item"|"Blue Sticky Paintball Explosive Item"|"Black Sticky Paintball Explosive Item"|"Yellow Seeking Paintball Explosive Item"|"White Seeking Paintball Explosive Item"|"Red Seeking Paintball Explosive Item"|"Purple Seeking Paintball Explosive Item"|"Pink Seeking Paintball Explosive Item"|"Orange Seeking Paintball Explosive Item"|"Magenta Seeking Paintball Explosive Item"|"Lime Seeking Paintball Explosive Item"|"Light Gray Seeking Paintball Explosive Item"|"Light Blue Seeking Paintball Explosive Item"|"Green Seeking Paintball Explosive Item"|"Gray Seeking Paintball Explosive Item"|"Cyan Seeking Paintball Explosive Item"|"Brown Seeking Paintball Explosive Item"|"Blue Seeking Paintball Explosive Item"|"Black Seeking Paintball Explosive Item"|"Yellow Quick Paintball Explosive Item"|"White Quick Paintball Explosive Item"|"Red Quick Paintball Explosive Item"|"Purple Quick Paintball Explosive Item"|"Pink Quick Paintball Explosive Item"|"Orange Quick Paintball Explosive Item"|"Magenta Quick Paintball Explosive Item"|"Lime Quick Paintball Explosive Item"|"Light Gray Quick Paintball Explosive Item"|"Light Blue Quick Paintball Explosive Item"|"Green Quick Paintball Explosive Item"|"Gray Quick Paintball Explosive Item"|"Cyan Quick Paintball Explosive Item"|"Brown Quick Paintball Explosive Item"|"Blue Quick Paintball Explosive Item"|"Black Quick Paintball Explosive Item"|"Yellow Paint Bow"|"Yellow Paint Bow|meta|charging2"|"Yellow Paint Bow|meta|charging3"|"Yellow Paint Bow|meta|charging4"|"White Paint Bow"|"White Paint Bow|meta|charging2"|"White Paint Bow|meta|charging3"|"White Paint Bow|meta|charging4"|"Red Paint Bow"|"Red Paint Bow|meta|charging2"|"Red Paint Bow|meta|charging3"|"Red Paint Bow|meta|charging4"|"Purple Paint Bow"|"Purple Paint Bow|meta|charging2"|"Purple Paint Bow|meta|charging3"|"Purple Paint Bow|meta|charging4"|"Pink Paint Bow"|"Pink Paint Bow|meta|charging2"|"Pink Paint Bow|meta|charging3"|"Pink Paint Bow|meta|charging4"|"Orange Paint Bow"|"Orange Paint Bow|meta|charging2"|"Orange Paint Bow|meta|charging3"|"Orange Paint Bow|meta|charging4"|"Magenta Paint Bow"|"Magenta Paint Bow|meta|charging2"|"Magenta Paint Bow|meta|charging3"|"Magenta Paint Bow|meta|charging4"|"Lime Paint Bow"|"Lime Paint Bow|meta|charging2"|"Lime Paint Bow|meta|charging3"|"Lime Paint Bow|meta|charging4"|"Light Gray Paint Bow"|"Light Gray Paint Bow|meta|charging2"|"Light Gray Paint Bow|meta|charging3"|"Light Gray Paint Bow|meta|charging4"|"Light Blue Paint Bow"|"Light Blue Paint Bow|meta|charging2"|"Light Blue Paint Bow|meta|charging3"|"Light Blue Paint Bow|meta|charging4"|"Green Paint Bow"|"Green Paint Bow|meta|charging2"|"Green Paint Bow|meta|charging3"|"Green Paint Bow|meta|charging4"|"Gray Paint Bow"|"Gray Paint Bow|meta|charging2"|"Gray Paint Bow|meta|charging3"|"Gray Paint Bow|meta|charging4"|"Cyan Paint Bow"|"Cyan Paint Bow|meta|charging2"|"Cyan Paint Bow|meta|charging3"|"Cyan Paint Bow|meta|charging4"|"Brown Paint Bow"|"Brown Paint Bow|meta|charging2"|"Brown Paint Bow|meta|charging3"|"Brown Paint Bow|meta|charging4"|"Blue Paint Bow"|"Blue Paint Bow|meta|charging2"|"Blue Paint Bow|meta|charging3"|"Blue Paint Bow|meta|charging4"|"Black Paint Bow"|"Black Paint Bow|meta|charging2"|"Black Paint Bow|meta|charging3"|"Black Paint Bow|meta|charging4"|"Pig Spawn Orb"|"Cow Spawn Orb"|"Sheep Spawn Orb"|"Horse Spawn Orb"|"Deer Spawn Orb"|"Wolf Spawn Orb"|"Wildcat Spawn Orb"|"Spirit Golem Spawn Orb"|"Spirit Wolf Spawn Orb"|"Spirit Bear Spawn Orb"|"Spirit Stag Spawn Orb"|"Spirit Gorilla Spawn Orb"|"Bear Spawn Orb"|"Stag Spawn Orb"|"Gold Watermelon Stag Spawn Orb"|"Gorilla Spawn Orb"|"Cave Golem Spawn Orb"|"Draugr Zombie Spawn Orb"|"Draugr Skeleton Spawn Orb"|"Frost Golem Spawn Orb"|"Frost Zombie Spawn Orb"|"Frost Skeleton Spawn Orb"|"Draugr Knight Spawn Orb"|"Draugr Huntress Spawn Orb"|"Magma Golem Spawn Orb"|"Draugr Warper Spawn Orb"|"Frost Wraith Spawn Orb"|"Draugr Reaver Spawn Orb"|"Mob Catcher"|"Caught Mob Pig Default"|"Caught Mob Cow Default"|"Caught Mob Cow Cream"|"Caught Mob Sheep Default"|"Caught Mob Sheep Black"|"Caught Mob Sheep Red"|"Caught Mob Sheep Orange"|"Caught Mob Sheep Pink"|"Caught Mob Sheep Purple"|"Caught Mob Sheep Yellow"|"Caught Mob Sheep Blue"|"Caught Mob Sheep Brown"|"Caught Mob Sheep Cyan"|"Caught Mob Sheep Gray"|"Caught Mob Sheep Green"|"Caught Mob Sheep Lightblue"|"Caught Mob Sheep Lightgray"|"Caught Mob Sheep Lime"|"Caught Mob Sheep Magenta"|"Caught Mob Horse Default"|"Caught Mob Horse Black"|"Caught Mob Horse Brown"|"Caught Mob Horse Cream"|"Caught Mob Deer Default"|"Caught Mob Wolf Default"|"Caught Mob Wolf White"|"Caught Mob Wolf Brown"|"Caught Mob Wolf Grey"|"Caught Mob Wolf Spectral"|"Caught Mob Wildcat Default"|"Caught Mob Wildcat Tabby"|"Caught Mob Wildcat Grey"|"Caught Mob Wildcat Black"|"Caught Mob Wildcat Calico"|"Caught Mob Wildcat Siamese"|"Caught Mob Wildcat Leopard"|"Caught Mob Spirit_Golem Default"|"Caught Mob Spirit_Wolf Default"|"Caught Mob Spirit_Bear Default"|"Caught Mob Spirit_Stag Default"|"Caught Mob Spirit_Gorilla Default"|"Caught Mob Bear Default"|"Caught Mob Stag Default"|"Caught Mob Gold_Watermelon_Stag Default"|"Caught Mob Gorilla Default"|"Caught Mob Cave_Golem Default"|"Caught Mob Cave_Golem Iron"|"Caught Mob Draugr_Zombie Default"|"Caught Mob Draugr_Zombie Longhairchestplate"|"Caught Mob Draugr_Zombie Longhairclothed"|"Caught Mob Draugr_Zombie Shorthairclothed"|"Caught Mob Draugr_Skeleton Default"|"Caught Mob Frost_Golem Default"|"Caught Mob Frost_Zombie Default"|"Caught Mob Frost_Zombie Longhairchestplate"|"Caught Mob Frost_Zombie Shorthairclothed"|"Caught Mob Frost_Skeleton Default"|"Caught Mob Draugr_Knight Default"|"Caught Mob Draugr_Huntress Default"|"Caught Mob Draugr_Huntress Chainmail"|"Caught Mob Magma_Golem Default"|"Caught Mob Draugr_Warper Default"|"Caught Mob Frost_Wraith Default"|"Caught Mob Draugr_Reaver Default"|"Caught Mob NPC Default"|"Caught Mob NPC Emma"|"Caught Mob NPC Leo"|"Caught Mob NPC Isabel"|"Caught Mob NPC Sanjay"|"Caught Mob NPC Imara"|"Caught Mob NPC Enoch"|"Caught Mob NPC Sara"|"Caught Mob NPC Carmen"|"Caught Mob 67 Default"|"Caught Mob Bobino_Musculino Default"|"Caught Mob Capitano_Explovissimo Default"|"Timed Spike Bomb"|"Timed Spike Bomb|meta|charging2"|"Timed Spike Bomb|meta|charging3"|"Timed Spike Bomb|meta|charging4"|"Toxin Ball"|"Aura XP Fragment"|"Aura XP Orb"|"Aura XP Potion"|"Aura XP Potion II"|"Splash Aura XP Potion"|"Splash Aura XP Potion II"|"Arrow of Aura XP"|"Firecracker"|"Rainbow Firecracker"|"Yellow Firecracker"|"White Firecracker"|"Red Firecracker"|"Purple Firecracker"|"Pink Firecracker"|"Orange Firecracker"|"Magenta Firecracker"|"Lime Firecracker"|"Light Gray Firecracker"|"Light Blue Firecracker"|"Green Firecracker"|"Gray Firecracker"|"Cyan Firecracker"|"Brown Firecracker"|"Blue Firecracker"|"Black Firecracker"|"Firecracker Pebble"|"Rainbow Firecracker Pebble"|"Yellow Firecracker Pebble"|"White Firecracker Pebble"|"Red Firecracker Pebble"|"Purple Firecracker Pebble"|"Pink Firecracker Pebble"|"Orange Firecracker Pebble"|"Magenta Firecracker Pebble"|"Lime Firecracker Pebble"|"Light Gray Firecracker Pebble"|"Light Blue Firecracker Pebble"|"Green Firecracker Pebble"|"Gray Firecracker Pebble"|"Cyan Firecracker Pebble"|"Brown Firecracker Pebble"|"Blue Firecracker Pebble"|"Black Firecracker Pebble"|"WorldBuilder Wand"|"Red Strongfish"|"Green Strongfish"|"Moon Strongfish"|"Wheatfish"|"Moonfish"|"Bombfish"|"Boomerang Fish"|"Root Flounder"|"Abyss Carp"|"Boulder Bass"|"Barnaclejaw"|"Crystalized Wheatfish"|"Darter"|"Shadow Darter"|"Electric Eel"|"Grass Snapper"|"Jungle Spinefish"|"Mangler Catfish"|"Mossback Arapaima"|"Sandbelly Piranha"|"Shadeback Ray"|"Mudbelly Tilapia"|"Mireback Carp"|"Rotslab Eel"|"Aether Minnow"|"Murkborne Ray"|"Eldertide Leviathan"|"Oarfish"|"Alpha Moon Strongfish"|"Bamboo Catfish"|"Blackwater Bream"|"Blackwater Leviathan"|"Boned Sturgeon"|"Bull Shark"|"Channel Sawfish"|"Coastal Mullet"|"Coelacanth"|"Driftwood Catfish"|"Eagle Ray"|"Giant Grouper"|"Giant Moray"|"Giant Stingray"|"Golden Mahseer"|"Greenfin Loach"|"Mangrove Herring"|"Moonlit Boomerang Fish"|"Moonstone Pupfish"|"Mudline Perch"|"Murk Stingray"|"Needlefish"|"Nomai Moray"|"Pearlescent Moonfish"|"Rainbow Guppy"|"Red Snapper"|"Reedglass Minnow"|"Reef Sardine"|"Root Perch"|"Rust Scad"|"Seahorse"|"Snakehead"|"Spined Stickleback"|"Stone Grouper"|"Sumpback Carp"|"Sunset Minnow"|"Tarpon"|"Threadfin Bream"|"Tri-Pointed Needlefish"|"Game Dev Fish"|"Armoured Searobin"|"Ash Lionfish"|"Barefrost Toothfish"|"Blackfin Icefish"|"Basalt Pipefish"|"Brimstone Spikefish"|"Cinder Leviathan"|"Crowned Flame Angelfish"|"Deepwater Lanternfish"|"Driftice Capelin"|"Ember Chub"|"Embermark Wrasse"|"Eviota Vader"|"Frost Herring"|"Frost Wolf Eel"|"Frostpaint Notie"|"Frozen Grenadier"|"Giant Trevally"|"Glacial Lanternfish"|"Glacial Silverfish"|"Heatwarp Flounder"|"Hatchetfish"|"Ice Spined Notothenia"|"Iceshelf Skate"|"Icy Sculpin"|"Lavaflow Trout"|"Lavawake Slopefish"|"Magma Sardinella"|"Magma Trout"|"Marbled Moray Cod"|"Molten Lotella Cod"|"Northern Wolffish"|"Paleice Rockcod"|"Permafrost Halibut"|"Pithead"|"Polarflash Electron"|"Pyroclast Eel"|"Pyroscale Grouper"|"Red Pyreside"|"Rimesnouted Lancetfish"|"Scorched Sunfish"|"Scored Dace"|"Silver Dragonfish"|"Snow Haddock"|"Volcanic Catfish"|"Volcanic Semperi"|"Rusty Rod"|"Lucky Rod"|"Sturdy Rod"|"Jungle Rod"|"Draugr Rod"|"Cursed Rod"|"Tangle Resistant Rod"|"Speed Rod"|"Carbon Rod"|"Deep Sea Rod"|"Master Rod"|"Obsidian Rod"|"Molten Magma Rod"|"Frost Rod"|"Black Ice Rod"|"Mythic Rod"|"Acorn"|"Acorn Jelly"|"Cow's Milk"|"Cheese"|"Caught Fish"|"Fish Fillet"|"Meaty Bone"|"Blinding Pebble"|"Sheep's Milk"|"Yoghurt Pot"|"Truffle"|"Truffle Oil"|"Oats"|"Porridge"|"Poop"|"Fertiliser"|"Medkit"|"Wood Spear"|"Stone Spear"|"Iron Spear"|"Gold Spear"|"Diamond Spear"|"Moonstone Spear"|"Wood Dagger"|"Stone Dagger"|"Iron Dagger"|"Gold Dagger"|"Diamond Dagger"|"Moonstone Dagger"|"Wood Boomerang"|"Stone Boomerang"|"Iron Boomerang"|"Gold Boomerang"|"Diamond Boomerang"|"Moonstone Boomerang"|"Wood Club"|"Stone Club"|"Iron Club"|"Gold Club"|"Diamond Club"|"Moonstone Club"|"Wood Mace"|"Stone Mace"|"Iron Mace"|"Gold Mace"|"Diamond Mace"|"Moonstone Mace"|"Wood Whip"|"Stone Whip"|"Iron Whip"|"Gold Whip"|"Diamond Whip"|"Moonstone Whip"|"Beef Stew"|"Chicken"|"Coleslaw"|"Egg"|"Fish N Chips"|"Fried Rice"|"Lettuce"|"Omelette"|"Onion"|"Red Cabbage"|"Roast Dinner"|"Salad"|"Stuffed Pepper"|"Sushi"|"Tomato"|"Vegetable Soup"|"";
declare type WoodType =
    | "Maple"
    | "Pine"
    | "Plum"
    | "Cedar"
    | "Aspen"
    | "Jungle"
;

declare type BlockName =
    | "Dirt"
    | "Dirt|GrassRoots"
    | "Messy Dirt"
    | "Grass Block"
    | "Sand"
    | "Clay"
    | "Gravel"
    | "Snow"
    | "Maple Log"
    | `Maple Log|TreeBase|${WoodType}`
    | "Pine Log"
    | `Pine Log|TreeBase|${WoodType}`
    | "Plum Log"
    | `Plum Log|TreeBase|${WoodType}`
    | "Cedar Log"
    | `Cedar Log|TreeBase|${WoodType}`
    | "Aspen Log"
    | `Aspen Log|TreeBase|${WoodType}`
    | "Jungle Log"
    | `Jungle Log|TreeBase|${WoodType}`
    | "Maple Wood Planks"
    | "Aspen Wood Planks"
    | "Plum Wood Planks"
    | "Jungle Wood Planks"
    | "Pine Wood Planks"
    | "Cedar Wood Planks"
    | "Barkless Maple Log"
    | `Barkless Maple Log|TreeBase|${WoodType}`
    | "Barkless Aspen Log"
    | `Barkless Aspen Log|TreeBase|${WoodType}`
    | "Barkless Plum Log"
    | `Barkless Plum Log|TreeBase|${WoodType}`
    | "Barkless Jungle Log"
    | `Barkless Jungle Log|TreeBase|${WoodType}`
    | "Barkless Pine Log"
    | `Barkless Pine Log|TreeBase|${WoodType}`
    | "Barkless Cedar Log"
    | `Barkless Cedar Log|TreeBase|${WoodType}`
    | "free_placeholder2"
    | "Stone"
    | "Messy Stone"
    | "free_placeholder"
    | "Smooth Stone"
    | "Diorite"
    | "Smooth Diorite"
    | "Andesite"
    | "Smooth Andesite"
    | "Granite"
    | "Smooth Granite"
    | "Sandstone"
    | "Yellowstone"
    | "Coal Ore"
    | "Iron Ore"
    | "Gold Ore"
    | "Lapis Lazuli Ore"
    | "Emerald Ore"
    | "Diamond Ore"
    | "Block of Coal"
    | "Block of Iron"
    | "Block of Gold"
    | "Block of Lapis Lazuli"
    | "Block of Emerald"
    | "White Wool"
    | "Orange Wool"
    | "Magenta Wool"
    | "Light Blue Wool"
    | "Yellow Wool"
    | "Lime Wool"
    | "Pink Wool"
    | "Gray Wool"
    | "Light Gray Wool"
    | "Cyan Wool"
    | "Purple Wool"
    | "Blue Wool"
    | "Brown Wool"
    | "Green Wool"
    | "Red Wool"
    | "Black Wool"
    | "Baked Clay"
    | "White Baked Clay"
    | "Orange Baked Clay"
    | "Magenta Baked Clay"
    | "Light Blue Baked Clay"
    | "Yellow Baked Clay"
    | "Lime Baked Clay"
    | "Pink Baked Clay"
    | "Gray Baked Clay"
    | "Light Gray Baked Clay"
    | "Cyan Baked Clay"
    | "Purple Baked Clay"
    | "Blue Baked Clay"
    | "Brown Baked Clay"
    | "Green Baked Clay"
    | "Red Baked Clay"
    | "Black Baked Clay"
    | "Gray Concrete"
    | "Light Gray Concrete"
    | "Black Concrete"
    | "Blue Concrete"
    | "Brown Concrete"
    | "Cyan Concrete"
    | "Light Blue Concrete"
    | "Lime Concrete"
    | "Magenta Concrete"
    | "Orange Concrete"
    | "Pink Concrete"
    | "Purple Concrete"
    | "Red Concrete"
    | "White Concrete"
    | "Green Concrete"
    | "Yellow Concrete"
    | "Pine Leaves"
    | "Pine Leaves|TreeCanopy"
    | "Aspen Leaves"
    | "Aspen Leaves|TreeCanopy"
    | "Maple Leaves"
    | "Maple Leaves|TreeCanopy"
    | "Jungle Leaves"
    | "Jungle Leaves|TreeCanopy"
    | "Pumpkin_placeholder"
    | "Watermelon"
    | "Glass"
    | "Black Glass"
    | "Blue Glass"
    | "Brown Glass"
    | "Cyan Glass"
    | "Gray Glass"
    | "Light Gray Glass"
    | "Green Glass"
    | "Light Blue Glass"
    | "Lime Glass"
    | "Magenta Glass"
    | "Orange Glass"
    | "Pink Glass"
    | "Purple Glass"
    | "Red Glass"
    | "White Glass"
    | "Yellow Glass"
    | "UNUSED BLOCK TYPE"
    | "Dim Lamp On"
    | "Dim Lamp Off"
    | "Water"
    | "Invisible Solid"
    | "Bricks"
    | "Stone Bricks"
    | "Dark Red Brick"
    | "Dark Red Stone"
    | "Block of Quartz"
    | "Chiseled Block of Quartz"
    | "Engraved Stone"
    | "Mossy Stone Bricks"
    | "Cracked Stone Bricks"
    | "Smooth Sandstone"
    | "Engraved Sandstone"
    | "Ice"
    | "Obsidian"
    | "Hay Bale"
    | "Sponge"
    | "Beacon"
    | "temp"
    | "Golden Decoration"
    | "Moonstone Explosive"
    | "Bedrock"
    | "Smooth Double Stone Slab"
    | "Cactus"
    | "Cactus|Growing"
    | "Grass"
    | "Dandelion"
    | "Dandelion|Roots"
    | "Poppy"
    | "Poppy|Roots"
    | "Red Tulip"
    | "Red Tulip|Roots"
    | "Pink Tulip"
    | "Pink Tulip|Roots"
    | "White Tulip"
    | "White Tulip|Roots"
    | "Orange Tulip"
    | "Orange Tulip|Roots"
    | "Daisy"
    | "Daisy|Roots"
    | "Bluebell"
    | "Bluebell|Roots"
    | "Forget-me-not"
    | "Forget-me-not|Roots"
    | "Allium"
    | "Allium|Roots"
    | "Azure Bluet"
    | "Azure Bluet|Roots"
    | "Lily of the Valley"
    | "Lily of the Valley|Roots"
    | "Shadow Rose"
    | "Shadow Rose|Roots"
    | "Furnace"
    | `Furnace|meta|rot${1|2|3|4}`
    | "Workbench"
    | `Workbench|meta|rot${1|2|3|4}`
    | "Block of Diamond"
    | "Maple Door"
    | `Maple Door|meta|rot${1|2|3|4}|open`
    | `Maple Door|meta|rot${1|2|3|4}|closed`
    | `Maple Door|meta|rot${1|2|3|4}`
    | "_Maple Door Top"
    | `_Maple Door Top|meta|rot${1|2|3|4}|open`
    | `_Maple Door Top|meta|rot${1|2|3|4}|closed`
    | `_Maple Door Top|meta|rot${1|2|3|4}`
    | "Maple Trapdoor"
    | `Maple Trapdoor|meta|rot${1|2|3|4}|open`
    | `Maple Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Maple Trapdoor|meta|rot${1|2|3|4}`
    | "Aspen Sapling"
    | "Maple Sapling"
    | "Jungle Sapling"
    | "Plum Sapling"
    | "Pine Sapling"
    | "Cedar Sapling"
    | "Chest"
    | `Chest|meta|rot${1|2|3|4}`
    | "Protector"
    | "Fat Cactus"
    | "Fat Cactus|Growing"
    | "Dry Fat Cactus"
    | "Maple Ladder"
    | `Maple Ladder|meta|rot${1|2|3|4}`
    | "Vines"
    | "Vines|Growing"
    | `Vines|meta|rot${1|2|3|4}`
    | "Iron Ladder"
    | `Iron Ladder|meta|rot${1|2|3|4}`
    | "White Planks"
    | "Orange Planks"
    | "Magenta Planks"
    | "Light Blue Planks"
    | "Yellow Planks"
    | "Lime Planks"
    | "Pink Planks"
    | "Gray Planks"
    | "Light Gray Planks"
    | "Cyan Planks"
    | "Purple Planks"
    | "Blue Planks"
    | "Brown Planks"
    | "Green Planks"
    | "Red Planks"
    | "Black Planks"
    | "Artisan Bench"
    | "White Ceramic"
    | `White Ceramic|meta|rot${1|2|3|4}`
    | "Orange Ceramic"
    | `Orange Ceramic|meta|rot${1|2|3|4}`
    | "Magenta Ceramic"
    | `Magenta Ceramic|meta|rot${1|2|3|4}`
    | "Light Blue Ceramic"
    | `Light Blue Ceramic|meta|rot${1|2|3|4}`
    | "Yellow Ceramic"
    | `Yellow Ceramic|meta|rot${1|2|3|4}`
    | "Lime Ceramic"
    | `Lime Ceramic|meta|rot${1|2|3|4}`
    | "Pink Ceramic"
    | `Pink Ceramic|meta|rot${1|2|3|4}`
    | "Gray Ceramic"
    | `Gray Ceramic|meta|rot${1|2|3|4}`
    | "Light Gray Ceramic"
    | `Light Gray Ceramic|meta|rot${1|2|3|4}`
    | "Cyan Ceramic"
    | `Cyan Ceramic|meta|rot${1|2|3|4}`
    | "Purple Ceramic"
    | `Purple Ceramic|meta|rot${1|2|3|4}`
    | "Blue Ceramic"
    | `Blue Ceramic|meta|rot${1|2|3|4}`
    | "Brown Ceramic"
    | `Brown Ceramic|meta|rot${1|2|3|4}`
    | "Green Ceramic"
    | `Green Ceramic|meta|rot${1|2|3|4}`
    | "Red Ceramic"
    | `Red Ceramic|meta|rot${1|2|3|4}`
    | "Black Ceramic"
    | `Black Ceramic|meta|rot${1|2|3|4}`
    | "Wheat Seeds"
    | "Wheat_stage1"
    | "Wheat_stage2"
    | "Wheat_stage3"
    | "Wheat_stage4"
    | "Wheat_stage5"
    | "Wheat"
    | "Wheat|FreshlyGrown"
    | "Tilled Soil"
    | "Bread Block"
    | "ReservedBread BlockRotation1"
    | "ReservedBread BlockRotation2"
    | "ReservedBread BlockRotation3"
    | "Mossy Messy Stone"
    | "White Bed"
    | `White Bed|meta|rot${1|2|3|4}`
    | "_White Bed Head"
    | `_White Bed Head|meta|rot${1|2|3|4}`
    | "Orange Bed"
    | `Orange Bed|meta|rot${1|2|3|4}`
    | "_Orange Bed Head"
    | `_Orange Bed Head|meta|rot${1|2|3|4}`
    | "Magenta Bed"
    | `Magenta Bed|meta|rot${1|2|3|4}`
    | "_Magenta Bed Head"
    | `_Magenta Bed Head|meta|rot${1|2|3|4}`
    | "Light Blue Bed"
    | `Light Blue Bed|meta|rot${1|2|3|4}`
    | "_Light Blue Bed Head"
    | `_Light Blue Bed Head|meta|rot${1|2|3|4}`
    | "Yellow Bed"
    | `Yellow Bed|meta|rot${1|2|3|4}`
    | "_Yellow Bed Head"
    | `_Yellow Bed Head|meta|rot${1|2|3|4}`
    | "Lime Bed"
    | `Lime Bed|meta|rot${1|2|3|4}`
    | "_Lime Bed Head"
    | `_Lime Bed Head|meta|rot${1|2|3|4}`
    | "Pink Bed"
    | `Pink Bed|meta|rot${1|2|3|4}`
    | "_Pink Bed Head"
    | `_Pink Bed Head|meta|rot${1|2|3|4}`
    | "Gray Bed"
    | `Gray Bed|meta|rot${1|2|3|4}`
    | "_Gray Bed Head"
    | `_Gray Bed Head|meta|rot${1|2|3|4}`
    | "Light Gray Bed"
    | `Light Gray Bed|meta|rot${1|2|3|4}`
    | "_Light Gray Bed Head"
    | `_Light Gray Bed Head|meta|rot${1|2|3|4}`
    | "Cyan Bed"
    | `Cyan Bed|meta|rot${1|2|3|4}`
    | "_Cyan Bed Head"
    | `_Cyan Bed Head|meta|rot${1|2|3|4}`
    | "Purple Bed"
    | `Purple Bed|meta|rot${1|2|3|4}`
    | "_Purple Bed Head"
    | `_Purple Bed Head|meta|rot${1|2|3|4}`
    | "Blue Bed"
    | `Blue Bed|meta|rot${1|2|3|4}`
    | "_Blue Bed Head"
    | `_Blue Bed Head|meta|rot${1|2|3|4}`
    | "Brown Bed"
    | `Brown Bed|meta|rot${1|2|3|4}`
    | "_Brown Bed Head"
    | `_Brown Bed Head|meta|rot${1|2|3|4}`
    | "Green Bed"
    | `Green Bed|meta|rot${1|2|3|4}`
    | "_Green Bed Head"
    | `_Green Bed Head|meta|rot${1|2|3|4}`
    | "Red Bed"
    | `Red Bed|meta|rot${1|2|3|4}`
    | "_Red Bed Head"
    | `_Red Bed Head|meta|rot${1|2|3|4}`
    | "Black Bed"
    | `Black Bed|meta|rot${1|2|3|4}`
    | "_Black Bed Head"
    | `_Black Bed Head|meta|rot${1|2|3|4}`
    | "Apple Block"
    | "Moonstone Ore"
    | "Moonstone Chest"
    | `Moonstone Chest|meta|rot${1|2|3|4}`
    | "Block of Moonstone"
    | "Magma"
    | "Useless Soil"
    | "Marked Sandstone"
    | "Red Sandstone"
    | "Smooth Red Sandstone"
    | "Engraved Red Sandstone"
    | "Marked Red Sandstone"
    | "Green Stone"
    | "Green Bricks"
    | "Dark Green Bricks"
    | "Sandstone Bricks"
    | "Engraved Diorite"
    | "Diorite Bricks"
    | "Engraved Andesite"
    | "Andesite Bricks"
    | "Engraved Granite"
    | "Granite Bricks"
    | "Ice Bricks"
    | "Placeholder Packed Ice"
    | "Placeholder Blue Ice"
    | "Plum Leaves"
    | "Plum Leaves|TreeCanopy"
    | "Cedar Leaves"
    | "Cedar Leaves|TreeCanopy"
    | "Palm Leaves"
    | "Palm Leaves|TreeCanopy"
    | "Palm Log"
    | `Palm Log|TreeBase|${WoodType}`
    | "Palm Wood Planks"
    | "Palm Sapling"
    | "Pine Door"
    | `Pine Door|meta|rot${1|2|3|4}|open`
    | `Pine Door|meta|rot${1|2|3|4}|closed`
    | `Pine Door|meta|rot${1|2|3|4}`
    | "_Pine Door Top"
    | `_Pine Door Top|meta|rot${1|2|3|4}|open`
    | `_Pine Door Top|meta|rot${1|2|3|4}|closed`
    | `_Pine Door Top|meta|rot${1|2|3|4}`
    | "Plum Door"
    | `Plum Door|meta|rot${1|2|3|4}|open`
    | `Plum Door|meta|rot${1|2|3|4}|closed`
    | `Plum Door|meta|rot${1|2|3|4}`
    | "_Plum Door Top"
    | `_Plum Door Top|meta|rot${1|2|3|4}|open`
    | `_Plum Door Top|meta|rot${1|2|3|4}|closed`
    | `_Plum Door Top|meta|rot${1|2|3|4}`
    | "Cedar Door"
    | `Cedar Door|meta|rot${1|2|3|4}|open`
    | `Cedar Door|meta|rot${1|2|3|4}|closed`
    | `Cedar Door|meta|rot${1|2|3|4}`
    | "_Cedar Door Top"
    | `_Cedar Door Top|meta|rot${1|2|3|4}|open`
    | `_Cedar Door Top|meta|rot${1|2|3|4}|closed`
    | `_Cedar Door Top|meta|rot${1|2|3|4}`
    | "Aspen Door"
    | `Aspen Door|meta|rot${1|2|3|4}|open`
    | `Aspen Door|meta|rot${1|2|3|4}|closed`
    | `Aspen Door|meta|rot${1|2|3|4}`
    | "_Aspen Door Top"
    | `_Aspen Door Top|meta|rot${1|2|3|4}|open`
    | `_Aspen Door Top|meta|rot${1|2|3|4}|closed`
    | `_Aspen Door Top|meta|rot${1|2|3|4}`
    | "Jungle Door"
    | `Jungle Door|meta|rot${1|2|3|4}|open`
    | `Jungle Door|meta|rot${1|2|3|4}|closed`
    | `Jungle Door|meta|rot${1|2|3|4}`
    | "_Jungle Door Top"
    | `_Jungle Door Top|meta|rot${1|2|3|4}|open`
    | `_Jungle Door Top|meta|rot${1|2|3|4}|closed`
    | `_Jungle Door Top|meta|rot${1|2|3|4}`
    | "Palm Door"
    | `Palm Door|meta|rot${1|2|3|4}|open`
    | `Palm Door|meta|rot${1|2|3|4}|closed`
    | `Palm Door|meta|rot${1|2|3|4}`
    | "_Palm Door Top"
    | `_Palm Door Top|meta|rot${1|2|3|4}|open`
    | `_Palm Door Top|meta|rot${1|2|3|4}|closed`
    | `_Palm Door Top|meta|rot${1|2|3|4}`
    | "Pine Trapdoor"
    | `Pine Trapdoor|meta|rot${1|2|3|4}|open`
    | `Pine Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Pine Trapdoor|meta|rot${1|2|3|4}`
    | "Plum Trapdoor"
    | `Plum Trapdoor|meta|rot${1|2|3|4}|open`
    | `Plum Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Plum Trapdoor|meta|rot${1|2|3|4}`
    | "Cedar Trapdoor"
    | `Cedar Trapdoor|meta|rot${1|2|3|4}|open`
    | `Cedar Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Cedar Trapdoor|meta|rot${1|2|3|4}`
    | "Aspen Trapdoor"
    | `Aspen Trapdoor|meta|rot${1|2|3|4}|open`
    | `Aspen Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Aspen Trapdoor|meta|rot${1|2|3|4}`
    | "Jungle Trapdoor"
    | `Jungle Trapdoor|meta|rot${1|2|3|4}|open`
    | `Jungle Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Jungle Trapdoor|meta|rot${1|2|3|4}`
    | "Palm Trapdoor"
    | `Palm Trapdoor|meta|rot${1|2|3|4}|open`
    | `Palm Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Palm Trapdoor|meta|rot${1|2|3|4}`
    | "Red Sand"
    | "Red Sandstone Bricks"
    | "Rocky Dirt"
    | "Autumn Maple Leaves"
    | "Autumn Maple Leaves|TreeCanopy"
    | "Fallen Maple Leaves"
    | `Fallen Maple Leaves|meta|rot${1|2|3|4}|top`
    | `Fallen Maple Leaves|meta|rot${1|2|3|4}|bot`
    | `Fallen Maple Leaves|meta|rot${1|2|3|4}|side`
    | `Fallen Maple Leaves|meta|rot${1|2|3|4}`
    | "Maple Slab"
    | `Maple Slab|meta|rot${1|2|3|4}|top`
    | `Maple Slab|meta|rot${1|2|3|4}|bot`
    | `Maple Slab|meta|rot${1|2|3|4}|side`
    | `Maple Slab|meta|rot${1|2|3|4}`
    | "Pine Slab"
    | `Pine Slab|meta|rot${1|2|3|4}|top`
    | `Pine Slab|meta|rot${1|2|3|4}|bot`
    | `Pine Slab|meta|rot${1|2|3|4}|side`
    | `Pine Slab|meta|rot${1|2|3|4}`
    | "Plum Slab"
    | `Plum Slab|meta|rot${1|2|3|4}|top`
    | `Plum Slab|meta|rot${1|2|3|4}|bot`
    | `Plum Slab|meta|rot${1|2|3|4}|side`
    | `Plum Slab|meta|rot${1|2|3|4}`
    | "Cedar Slab"
    | `Cedar Slab|meta|rot${1|2|3|4}|top`
    | `Cedar Slab|meta|rot${1|2|3|4}|bot`
    | `Cedar Slab|meta|rot${1|2|3|4}|side`
    | `Cedar Slab|meta|rot${1|2|3|4}`
    | "Aspen Slab"
    | `Aspen Slab|meta|rot${1|2|3|4}|top`
    | `Aspen Slab|meta|rot${1|2|3|4}|bot`
    | `Aspen Slab|meta|rot${1|2|3|4}|side`
    | `Aspen Slab|meta|rot${1|2|3|4}`
    | "Jungle Slab"
    | `Jungle Slab|meta|rot${1|2|3|4}|top`
    | `Jungle Slab|meta|rot${1|2|3|4}|bot`
    | `Jungle Slab|meta|rot${1|2|3|4}|side`
    | `Jungle Slab|meta|rot${1|2|3|4}`
    | "Palm Slab"
    | `Palm Slab|meta|rot${1|2|3|4}|top`
    | `Palm Slab|meta|rot${1|2|3|4}|bot`
    | `Palm Slab|meta|rot${1|2|3|4}|side`
    | `Palm Slab|meta|rot${1|2|3|4}`
    | "Dirt Slab"
    | `Dirt Slab|meta|rot${1|2|3|4}|top`
    | `Dirt Slab|meta|rot${1|2|3|4}|bot`
    | `Dirt Slab|meta|rot${1|2|3|4}|side`
    | `Dirt Slab|meta|rot${1|2|3|4}`
    | "Grass Slab"
    | `Grass Slab|meta|rot${1|2|3|4}|top`
    | `Grass Slab|meta|rot${1|2|3|4}|bot`
    | `Grass Slab|meta|rot${1|2|3|4}|side`
    | `Grass Slab|meta|rot${1|2|3|4}`
    | "Messy Stone Slab"
    | `Messy Stone Slab|meta|rot${1|2|3|4}|top`
    | `Messy Stone Slab|meta|rot${1|2|3|4}|bot`
    | `Messy Stone Slab|meta|rot${1|2|3|4}|side`
    | `Messy Stone Slab|meta|rot${1|2|3|4}`
    | "Stone Slab"
    | `Stone Slab|meta|rot${1|2|3|4}|top`
    | `Stone Slab|meta|rot${1|2|3|4}|bot`
    | `Stone Slab|meta|rot${1|2|3|4}|side`
    | `Stone Slab|meta|rot${1|2|3|4}`
    | "Smooth Stone Slab"
    | `Smooth Stone Slab|meta|rot${1|2|3|4}|top`
    | `Smooth Stone Slab|meta|rot${1|2|3|4}|bot`
    | `Smooth Stone Slab|meta|rot${1|2|3|4}|side`
    | `Smooth Stone Slab|meta|rot${1|2|3|4}`
    | "Engraved Stone Slab"
    | `Engraved Stone Slab|meta|rot${1|2|3|4}|top`
    | `Engraved Stone Slab|meta|rot${1|2|3|4}|bot`
    | `Engraved Stone Slab|meta|rot${1|2|3|4}|side`
    | `Engraved Stone Slab|meta|rot${1|2|3|4}`
    | "Stone Bricks Slab"
    | `Stone Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Stone Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Stone Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Stone Bricks Slab|meta|rot${1|2|3|4}`
    | "Mossy Stone Slab"
    | `Mossy Stone Slab|meta|rot${1|2|3|4}|top`
    | `Mossy Stone Slab|meta|rot${1|2|3|4}|bot`
    | `Mossy Stone Slab|meta|rot${1|2|3|4}|side`
    | `Mossy Stone Slab|meta|rot${1|2|3|4}`
    | "Mossy Stone Bricks Slab"
    | `Mossy Stone Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Mossy Stone Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Mossy Stone Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Mossy Stone Bricks Slab|meta|rot${1|2|3|4}`
    | "Andesite Slab"
    | `Andesite Slab|meta|rot${1|2|3|4}|top`
    | `Andesite Slab|meta|rot${1|2|3|4}|bot`
    | `Andesite Slab|meta|rot${1|2|3|4}|side`
    | `Andesite Slab|meta|rot${1|2|3|4}`
    | "Smooth Andesite Slab"
    | `Smooth Andesite Slab|meta|rot${1|2|3|4}|top`
    | `Smooth Andesite Slab|meta|rot${1|2|3|4}|bot`
    | `Smooth Andesite Slab|meta|rot${1|2|3|4}|side`
    | `Smooth Andesite Slab|meta|rot${1|2|3|4}`
    | "Engraved Andesite Slab"
    | `Engraved Andesite Slab|meta|rot${1|2|3|4}|top`
    | `Engraved Andesite Slab|meta|rot${1|2|3|4}|bot`
    | `Engraved Andesite Slab|meta|rot${1|2|3|4}|side`
    | `Engraved Andesite Slab|meta|rot${1|2|3|4}`
    | "Andesite Bricks Slab"
    | `Andesite Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Andesite Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Andesite Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Andesite Bricks Slab|meta|rot${1|2|3|4}`
    | "Diorite Slab"
    | `Diorite Slab|meta|rot${1|2|3|4}|top`
    | `Diorite Slab|meta|rot${1|2|3|4}|bot`
    | `Diorite Slab|meta|rot${1|2|3|4}|side`
    | `Diorite Slab|meta|rot${1|2|3|4}`
    | "Smooth Diorite Slab"
    | `Smooth Diorite Slab|meta|rot${1|2|3|4}|top`
    | `Smooth Diorite Slab|meta|rot${1|2|3|4}|bot`
    | `Smooth Diorite Slab|meta|rot${1|2|3|4}|side`
    | `Smooth Diorite Slab|meta|rot${1|2|3|4}`
    | "Engraved Diorite Slab"
    | `Engraved Diorite Slab|meta|rot${1|2|3|4}|top`
    | `Engraved Diorite Slab|meta|rot${1|2|3|4}|bot`
    | `Engraved Diorite Slab|meta|rot${1|2|3|4}|side`
    | `Engraved Diorite Slab|meta|rot${1|2|3|4}`
    | "Diorite Bricks Slab"
    | `Diorite Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Diorite Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Diorite Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Diorite Bricks Slab|meta|rot${1|2|3|4}`
    | "Granite Slab"
    | `Granite Slab|meta|rot${1|2|3|4}|top`
    | `Granite Slab|meta|rot${1|2|3|4}|bot`
    | `Granite Slab|meta|rot${1|2|3|4}|side`
    | `Granite Slab|meta|rot${1|2|3|4}`
    | "Smooth Granite Slab"
    | `Smooth Granite Slab|meta|rot${1|2|3|4}|top`
    | `Smooth Granite Slab|meta|rot${1|2|3|4}|bot`
    | `Smooth Granite Slab|meta|rot${1|2|3|4}|side`
    | `Smooth Granite Slab|meta|rot${1|2|3|4}`
    | "Engraved Granite Slab"
    | `Engraved Granite Slab|meta|rot${1|2|3|4}|top`
    | `Engraved Granite Slab|meta|rot${1|2|3|4}|bot`
    | `Engraved Granite Slab|meta|rot${1|2|3|4}|side`
    | `Engraved Granite Slab|meta|rot${1|2|3|4}`
    | "Granite Bricks Slab"
    | `Granite Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Granite Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Granite Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Granite Bricks Slab|meta|rot${1|2|3|4}`
    | "Sandstone Slab"
    | `Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Sandstone Slab|meta|rot${1|2|3|4}`
    | "Smooth Sandstone Slab"
    | `Smooth Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Smooth Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Smooth Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Smooth Sandstone Slab|meta|rot${1|2|3|4}`
    | "Engraved Sandstone Slab"
    | `Engraved Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Engraved Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Engraved Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Engraved Sandstone Slab|meta|rot${1|2|3|4}`
    | "Marked Sandstone Slab"
    | `Marked Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Marked Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Marked Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Marked Sandstone Slab|meta|rot${1|2|3|4}`
    | "Sandstone Bricks Slab"
    | `Sandstone Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Sandstone Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Sandstone Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Sandstone Bricks Slab|meta|rot${1|2|3|4}`
    | "Red Sandstone Slab"
    | `Red Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Red Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Red Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Red Sandstone Slab|meta|rot${1|2|3|4}`
    | "Smooth Red Sandstone Slab"
    | `Smooth Red Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Smooth Red Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Smooth Red Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Smooth Red Sandstone Slab|meta|rot${1|2|3|4}`
    | "Engraved Red Sandstone Slab"
    | `Engraved Red Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Engraved Red Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Engraved Red Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Engraved Red Sandstone Slab|meta|rot${1|2|3|4}`
    | "Marked Red Sandstone Slab"
    | `Marked Red Sandstone Slab|meta|rot${1|2|3|4}|top`
    | `Marked Red Sandstone Slab|meta|rot${1|2|3|4}|bot`
    | `Marked Red Sandstone Slab|meta|rot${1|2|3|4}|side`
    | `Marked Red Sandstone Slab|meta|rot${1|2|3|4}`
    | "Red Sandstone Bricks Slab"
    | `Red Sandstone Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Red Sandstone Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Red Sandstone Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Red Sandstone Bricks Slab|meta|rot${1|2|3|4}`
    | "Bricks Slab"
    | `Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Bricks Slab|meta|rot${1|2|3|4}`
    | "Ice Bricks Slab"
    | `Ice Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Ice Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Ice Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Ice Bricks Slab|meta|rot${1|2|3|4}`
    | "Plum Block"
    | "Coconut Block"
    | "Pear Log"
    | `Pear Log|TreeBase|${WoodType}`
    | "Pear Wood Planks"
    | "Pear Leaves"
    | "Pear Leaves|TreeCanopy"
    | "Pear Door"
    | `Pear Door|meta|rot${1|2|3|4}|open`
    | `Pear Door|meta|rot${1|2|3|4}|closed`
    | `Pear Door|meta|rot${1|2|3|4}`
    | "_Pear Door Top"
    | `_Pear Door Top|meta|rot${1|2|3|4}|open`
    | `_Pear Door Top|meta|rot${1|2|3|4}|closed`
    | `_Pear Door Top|meta|rot${1|2|3|4}`
    | "Pear Trapdoor"
    | `Pear Trapdoor|meta|rot${1|2|3|4}|open`
    | `Pear Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Pear Trapdoor|meta|rot${1|2|3|4}`
    | "Pear Sapling"
    | "Pear Slab"
    | `Pear Slab|meta|rot${1|2|3|4}|top`
    | `Pear Slab|meta|rot${1|2|3|4}|bot`
    | `Pear Slab|meta|rot${1|2|3|4}|side`
    | `Pear Slab|meta|rot${1|2|3|4}`
    | "Pear Block"
    | "Compressed Messy Stone"
    | "Extra Compressed Messy Stone"
    | "Super Compressed Messy Stone"
    | "Hyper Compressed Messy Stone"
    | "Ultra Compressed Messy Stone"
    | "Mega Compressed Messy Stone"
    | "Board"
    | `Board|meta|rot${1|2|3|4}`
    | "Net"
    | "Cobweb"
    | "Brown Mushroom Block"
    | "Red Mushroom Block"
    | "Mushroom Stem"
    | "Fireball Block"
    | "Iceball Block"
    | "Watermelon Seeds"
    | "Watermelon Seeds|Growing"
    | "Attached Watermelon Stem"
    | `Attached Watermelon Stem|meta|rot${1|2|3|4}`
    | "Pumpkin Seeds"
    | "Pumpkin Seeds|Growing"
    | "Attached Pumpkin Stem"
    | `Attached Pumpkin Stem|meta|rot${1|2|3|4}`
    | "Pumpkin"
    | "Carved Pumpkin"
    | `Carved Pumpkin|meta|rot${1|2|3|4}`
    | "Jack o'Lantern"
    | `Jack o'Lantern|meta|rot${1|2|3|4}`
    | "Melon Seeds"
    | "Melon Seeds|Growing"
    | "Attached Melon Stem"
    | `Attached Melon Stem|meta|rot${1|2|3|4}`
    | "Melon"
    | "Iron Watermelon"
    | "Patterned Black Glass"
    | "Patterned Blue Glass"
    | "Patterned Brown Glass"
    | "Patterned Cyan Glass"
    | "Patterned Gray Glass"
    | "Patterned Light Gray Glass"
    | "Patterned Green Glass"
    | "Patterned Light Blue Glass"
    | "Patterned Lime Glass"
    | "Patterned Magenta Glass"
    | "Patterned Orange Glass"
    | "Patterned Pink Glass"
    | "Patterned Purple Glass"
    | "Patterned Red Glass"
    | "Patterned White Glass"
    | "Patterned Yellow Glass"
    | "Potion Table"
    | `Potion Table|meta|rot${1|2|3|4}`
    | "Pine Ladder"
    | `Pine Ladder|meta|rot${1|2|3|4}`
    | "Plum Ladder"
    | `Plum Ladder|meta|rot${1|2|3|4}`
    | "Cedar Ladder"
    | `Cedar Ladder|meta|rot${1|2|3|4}`
    | "Aspen Ladder"
    | `Aspen Ladder|meta|rot${1|2|3|4}`
    | "Jungle Ladder"
    | `Jungle Ladder|meta|rot${1|2|3|4}`
    | "Palm Ladder"
    | `Palm Ladder|meta|rot${1|2|3|4}`
    | "Pear Ladder"
    | `Pear Ladder|meta|rot${1|2|3|4}`
    | "Black Carpet"
    | "Blue Carpet"
    | "Brown Carpet"
    | "Cyan Carpet"
    | "Gray Carpet"
    | "Light Gray Carpet"
    | "Green Carpet"
    | "Light Blue Carpet"
    | "Lime Carpet"
    | "Magenta Carpet"
    | "Orange Carpet"
    | "Pink Carpet"
    | "Purple Carpet"
    | "Red Carpet"
    | "White Carpet"
    | "Yellow Carpet"
    | "Bookshelf"
    | `Bookshelf|meta|rot${1|2|3|4}|books${1|2|3|4|5|6}`
    | `Bookshelf|meta|rot${1|2|3|4}`
    | "Empty Bookshelf"
    | `Empty Bookshelf|meta|rot${1|2|3|4}|books${1|2|3|4|5|6}`
    | `Empty Bookshelf|meta|rot${1|2|3|4}`
    | "Mailbox"
    | `Mailbox|meta|rot${1|2|3|4}`
    | "Rice"
    | "Rice|FreshlyGrown"
    | "Rice_stage1"
    | "Rice_stage2"
    | "Rice_stage3"
    | "Rice_stage4"
    | "Rice_stage5"
    | "Cranberries"
    | "Cranberries_stage1"
    | "Cranberries_stage2"
    | "Red Mushroom"
    | "Brown Mushroom"
    | "Cotton Seeds"
    | "Cotton_stage1"
    | "Cotton_stage2"
    | "Cotton_stage3"
    | "Tribe Protector"
    | "Tall Grass"
    | "Tall Grass|Top"
    | "Faction Protector"
    | "Barkless Palm Log"
    | `Barkless Palm Log|TreeBase|${WoodType}`
    | "Barkless Pear Log"
    | `Barkless Pear Log|TreeBase|${WoodType}`
    | "Mystery Block"
    | "Rocket"
    | "Super Rocket"
    | "Yellow Concrete Slab"
    | `Yellow Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Yellow Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Yellow Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Yellow Concrete Slab|meta|rot${1|2|3|4}`
    | "White Concrete Slab"
    | `White Concrete Slab|meta|rot${1|2|3|4}|top`
    | `White Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `White Concrete Slab|meta|rot${1|2|3|4}|side`
    | `White Concrete Slab|meta|rot${1|2|3|4}`
    | "Red Concrete Slab"
    | `Red Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Red Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Red Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Red Concrete Slab|meta|rot${1|2|3|4}`
    | "Purple Concrete Slab"
    | `Purple Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Purple Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Purple Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Purple Concrete Slab|meta|rot${1|2|3|4}`
    | "Pink Concrete Slab"
    | `Pink Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Pink Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Pink Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Pink Concrete Slab|meta|rot${1|2|3|4}`
    | "Orange Concrete Slab"
    | `Orange Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Orange Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Orange Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Orange Concrete Slab|meta|rot${1|2|3|4}`
    | "Magenta Concrete Slab"
    | `Magenta Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Magenta Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Magenta Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Magenta Concrete Slab|meta|rot${1|2|3|4}`
    | "Lime Concrete Slab"
    | `Lime Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Lime Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Lime Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Lime Concrete Slab|meta|rot${1|2|3|4}`
    | "Light Gray Concrete Slab"
    | `Light Gray Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Light Gray Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Light Gray Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Light Gray Concrete Slab|meta|rot${1|2|3|4}`
    | "Light Blue Concrete Slab"
    | `Light Blue Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Light Blue Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Light Blue Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Light Blue Concrete Slab|meta|rot${1|2|3|4}`
    | "Green Concrete Slab"
    | `Green Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Green Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Green Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Green Concrete Slab|meta|rot${1|2|3|4}`
    | "Gray Concrete Slab"
    | `Gray Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Gray Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Gray Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Gray Concrete Slab|meta|rot${1|2|3|4}`
    | "Cyan Concrete Slab"
    | `Cyan Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Cyan Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Cyan Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Cyan Concrete Slab|meta|rot${1|2|3|4}`
    | "Brown Concrete Slab"
    | `Brown Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Brown Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Brown Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Brown Concrete Slab|meta|rot${1|2|3|4}`
    | "Blue Concrete Slab"
    | `Blue Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Blue Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Blue Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Blue Concrete Slab|meta|rot${1|2|3|4}`
    | "Black Concrete Slab"
    | `Black Concrete Slab|meta|rot${1|2|3|4}|top`
    | `Black Concrete Slab|meta|rot${1|2|3|4}|bot`
    | `Black Concrete Slab|meta|rot${1|2|3|4}|side`
    | `Black Concrete Slab|meta|rot${1|2|3|4}`
    | "Grenade"
    | "Cherry Log"
    | `Cherry Log|TreeBase|${WoodType}`
    | "Barkless Cherry Log"
    | `Barkless Cherry Log|TreeBase|${WoodType}`
    | "Cherry Wood Planks"
    | "Cherry Leaves"
    | "Cherry Leaves|TreeCanopy"
    | "Fallen Cherry Leaves"
    | `Fallen Cherry Leaves|meta|rot${1|2|3|4}|top`
    | `Fallen Cherry Leaves|meta|rot${1|2|3|4}|bot`
    | `Fallen Cherry Leaves|meta|rot${1|2|3|4}|side`
    | `Fallen Cherry Leaves|meta|rot${1|2|3|4}`
    | "Cherry Door"
    | `Cherry Door|meta|rot${1|2|3|4}|open`
    | `Cherry Door|meta|rot${1|2|3|4}|closed`
    | `Cherry Door|meta|rot${1|2|3|4}`
    | "_Cherry Door Top"
    | `_Cherry Door Top|meta|rot${1|2|3|4}|open`
    | `_Cherry Door Top|meta|rot${1|2|3|4}|closed`
    | `_Cherry Door Top|meta|rot${1|2|3|4}`
    | "Cherry Trapdoor"
    | `Cherry Trapdoor|meta|rot${1|2|3|4}|open`
    | `Cherry Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Cherry Trapdoor|meta|rot${1|2|3|4}`
    | "Cherry Sapling"
    | "Cherry Slab"
    | `Cherry Slab|meta|rot${1|2|3|4}|top`
    | `Cherry Slab|meta|rot${1|2|3|4}|bot`
    | `Cherry Slab|meta|rot${1|2|3|4}|side`
    | `Cherry Slab|meta|rot${1|2|3|4}`
    | "Cherry Ladder"
    | `Cherry Ladder|meta|rot${1|2|3|4}`
    | "Cherry Block"
    | "Bouncy Bomb Block"
    | "Obby Rocket"
    | "Wood Spikes"
    | "Stone Spikes"
    | "Iron Spikes"
    | "Gold Spikes"
    | "Diamond Spikes"
    | "Kill Spikes"
    | "Corn Block"
    | "Corn Seeds"
    | "Corn Seeds|FreshlyGrown"
    | "Corn Seeds|Growing"
    | "Corn Seeds_stage1"
    | "Corn Plant_stage1"
    | "Corn Plant_stage2"
    | "Corn Plant_stage3"
    | "Corn Plant_stage4"
    | "Corn Plant_stage5"
    | "Corn Plant"
    | "Corn Plant|FreshlyGrown"
    | "Loot Chest"
    | `Loot Chest|meta|rot${1|2|3|4}`
    | "Melting Ice"
    | "Melting Ice|Breaking"
    | "Yellow Paintball Explosive"
    | "White Paintball Explosive"
    | "Red Paintball Explosive"
    | "Purple Paintball Explosive"
    | "Pink Paintball Explosive"
    | "Orange Paintball Explosive"
    | "Magenta Paintball Explosive"
    | "Lime Paintball Explosive"
    | "Light Gray Paintball Explosive"
    | "Light Blue Paintball Explosive"
    | "Green Paintball Explosive"
    | "Gray Paintball Explosive"
    | "Cyan Paintball Explosive"
    | "Brown Paintball Explosive"
    | "Blue Paintball Explosive"
    | "Black Paintball Explosive"
    | "Yellow Quick Paintball Explosive"
    | "White Quick Paintball Explosive"
    | "Red Quick Paintball Explosive"
    | "Purple Quick Paintball Explosive"
    | "Pink Quick Paintball Explosive"
    | "Orange Quick Paintball Explosive"
    | "Magenta Quick Paintball Explosive"
    | "Lime Quick Paintball Explosive"
    | "Light Gray Quick Paintball Explosive"
    | "Light Blue Quick Paintball Explosive"
    | "Green Quick Paintball Explosive"
    | "Gray Quick Paintball Explosive"
    | "Cyan Quick Paintball Explosive"
    | "Brown Quick Paintball Explosive"
    | "Blue Quick Paintball Explosive"
    | "Black Quick Paintball Explosive"
    | "Yellow Seeking Paintball Explosive"
    | "White Seeking Paintball Explosive"
    | "Red Seeking Paintball Explosive"
    | "Purple Seeking Paintball Explosive"
    | "Pink Seeking Paintball Explosive"
    | "Orange Seeking Paintball Explosive"
    | "Magenta Seeking Paintball Explosive"
    | "Lime Seeking Paintball Explosive"
    | "Light Gray Seeking Paintball Explosive"
    | "Light Blue Seeking Paintball Explosive"
    | "Green Seeking Paintball Explosive"
    | "Gray Seeking Paintball Explosive"
    | "Cyan Seeking Paintball Explosive"
    | "Brown Seeking Paintball Explosive"
    | "Blue Seeking Paintball Explosive"
    | "Black Seeking Paintball Explosive"
    | "Yellow Sticky Paintball Explosive"
    | "White Sticky Paintball Explosive"
    | "Red Sticky Paintball Explosive"
    | "Purple Sticky Paintball Explosive"
    | "Pink Sticky Paintball Explosive"
    | "Orange Sticky Paintball Explosive"
    | "Magenta Sticky Paintball Explosive"
    | "Lime Sticky Paintball Explosive"
    | "Light Gray Sticky Paintball Explosive"
    | "Light Blue Sticky Paintball Explosive"
    | "Green Sticky Paintball Explosive"
    | "Gray Sticky Paintball Explosive"
    | "Cyan Sticky Paintball Explosive"
    | "Brown Sticky Paintball Explosive"
    | "Blue Sticky Paintball Explosive"
    | "Black Sticky Paintball Explosive"
    | "White Strongbed"
    | `White Strongbed|meta|rot${1|2|3|4}`
    | "_White Strongbed Head"
    | `_White Strongbed Head|meta|rot${1|2|3|4}`
    | "Orange Strongbed"
    | `Orange Strongbed|meta|rot${1|2|3|4}`
    | "_Orange Strongbed Head"
    | `_Orange Strongbed Head|meta|rot${1|2|3|4}`
    | "Magenta Strongbed"
    | `Magenta Strongbed|meta|rot${1|2|3|4}`
    | "_Magenta Strongbed Head"
    | `_Magenta Strongbed Head|meta|rot${1|2|3|4}`
    | "Light Blue Strongbed"
    | `Light Blue Strongbed|meta|rot${1|2|3|4}`
    | "_Light Blue Strongbed Head"
    | `_Light Blue Strongbed Head|meta|rot${1|2|3|4}`
    | "Yellow Strongbed"
    | `Yellow Strongbed|meta|rot${1|2|3|4}`
    | "_Yellow Strongbed Head"
    | `_Yellow Strongbed Head|meta|rot${1|2|3|4}`
    | "Lime Strongbed"
    | `Lime Strongbed|meta|rot${1|2|3|4}`
    | "_Lime Strongbed Head"
    | `_Lime Strongbed Head|meta|rot${1|2|3|4}`
    | "Pink Strongbed"
    | `Pink Strongbed|meta|rot${1|2|3|4}`
    | "_Pink Strongbed Head"
    | `_Pink Strongbed Head|meta|rot${1|2|3|4}`
    | "Gray Strongbed"
    | `Gray Strongbed|meta|rot${1|2|3|4}`
    | "_Gray Strongbed Head"
    | `_Gray Strongbed Head|meta|rot${1|2|3|4}`
    | "Light Gray Strongbed"
    | `Light Gray Strongbed|meta|rot${1|2|3|4}`
    | "_Light Gray Strongbed Head"
    | `_Light Gray Strongbed Head|meta|rot${1|2|3|4}`
    | "Cyan Strongbed"
    | `Cyan Strongbed|meta|rot${1|2|3|4}`
    | "_Cyan Strongbed Head"
    | `_Cyan Strongbed Head|meta|rot${1|2|3|4}`
    | "Purple Strongbed"
    | `Purple Strongbed|meta|rot${1|2|3|4}`
    | "_Purple Strongbed Head"
    | `_Purple Strongbed Head|meta|rot${1|2|3|4}`
    | "Blue Strongbed"
    | `Blue Strongbed|meta|rot${1|2|3|4}`
    | "_Blue Strongbed Head"
    | `_Blue Strongbed Head|meta|rot${1|2|3|4}`
    | "Brown Strongbed"
    | `Brown Strongbed|meta|rot${1|2|3|4}`
    | "_Brown Strongbed Head"
    | `_Brown Strongbed Head|meta|rot${1|2|3|4}`
    | "Green Strongbed"
    | `Green Strongbed|meta|rot${1|2|3|4}`
    | "_Green Strongbed Head"
    | `_Green Strongbed Head|meta|rot${1|2|3|4}`
    | "Red Strongbed"
    | `Red Strongbed|meta|rot${1|2|3|4}`
    | "_Red Strongbed Head"
    | `_Red Strongbed Head|meta|rot${1|2|3|4}`
    | "Black Strongbed"
    | `Black Strongbed|meta|rot${1|2|3|4}`
    | "_Black Strongbed Head"
    | `_Black Strongbed Head|meta|rot${1|2|3|4}`
    | "Timed Spike Bomb Block"
    | "Timed Spike Bomb Block|Flashing"
    | "Lava"
    | "Fat Brown Mushroom"
    | "Fat Red Mushroom"
    | "Chili Pepper Block"
    | "Chili Pepper Seeds"
    | "Chili Pepper Seeds|Lava"
    | "Chili Pepper Plant_stage1"
    | "Chili Pepper Plant_stage1|Lava"
    | "Chili Pepper Plant_stage2"
    | "Chili Pepper Plant_stage2|Lava"
    | "Chili Pepper Plant_stage3"
    | "Chili Pepper Plant_stage3|Lava"
    | "Chili Pepper Plant_stage4"
    | "Chili Pepper Plant_stage4|Lava"
    | "Chili Pepper Plant"
    | "Chili Pepper Plant|FreshlyGrown"
    | "Chili Pepper Plant|Lava"
    | "Chili Pepper Plant_stage5"
    | "Chili Pepper Plant_stage5|Lava"
    | "Code Block"
    | "Toxin Ball Block"
    | "Spawn Block (Yellow)"
    | `Spawn Block (Yellow)|meta|rot${1|2|3|4}`
    | "Spawn Block (White)"
    | `Spawn Block (White)|meta|rot${1|2|3|4}`
    | "Spawn Block (Red)"
    | `Spawn Block (Red)|meta|rot${1|2|3|4}`
    | "Spawn Block (Purple)"
    | `Spawn Block (Purple)|meta|rot${1|2|3|4}`
    | "Spawn Block (Pink)"
    | `Spawn Block (Pink)|meta|rot${1|2|3|4}`
    | "Spawn Block (Orange)"
    | `Spawn Block (Orange)|meta|rot${1|2|3|4}`
    | "Spawn Block (Magenta)"
    | `Spawn Block (Magenta)|meta|rot${1|2|3|4}`
    | "Spawn Block (Lime)"
    | `Spawn Block (Lime)|meta|rot${1|2|3|4}`
    | "Spawn Block (Light Gray)"
    | `Spawn Block (Light Gray)|meta|rot${1|2|3|4}`
    | "Spawn Block (Light Blue)"
    | `Spawn Block (Light Blue)|meta|rot${1|2|3|4}`
    | "Spawn Block (Green)"
    | `Spawn Block (Green)|meta|rot${1|2|3|4}`
    | "Spawn Block (Gray)"
    | `Spawn Block (Gray)|meta|rot${1|2|3|4}`
    | "Spawn Block (Cyan)"
    | `Spawn Block (Cyan)|meta|rot${1|2|3|4}`
    | "Spawn Block (Brown)"
    | `Spawn Block (Brown)|meta|rot${1|2|3|4}`
    | "Spawn Block (Blue)"
    | `Spawn Block (Blue)|meta|rot${1|2|3|4}`
    | "Spawn Block (Black)"
    | `Spawn Block (Black)|meta|rot${1|2|3|4}`
    | "Checkpoint Block"
    | `Checkpoint Block|meta|rot${1|2|3|4}`
    | "Custom Lobby Block"
    | `Custom Lobby Block|meta|rot${1|2|3|4}`
    | "Generator Spawn Block (Red)"
    | "Generator Spawn Block (Blue)"
    | "Generator Spawn Block (Lime)"
    | "Generator Spawn Block (Yellow)"
    | "Generator Spawn Block (Cyan)"
    | "Generator Spawn Block (White)"
    | "Generator Spawn Block (Pink)"
    | "Generator Spawn Block (Gray)"
    | "Trader Shop Spawn Block"
    | `Trader Shop Spawn Block|meta|rot${1|2|3|4}`
    | "Wizard Shop Spawn Block"
    | `Wizard Shop Spawn Block|meta|rot${1|2|3|4}`
    | "Generator Spawn Block (Diamond)"
    | "Generator Spawn Block (Moonstone)"
    | "Generator Spawn Block (Ore)"
    | "Goal Block (Red)"
    | "Goal Block (Blue)"
    | "Finish Block"
    | "Drop Location Block"
    | "Obby Death Block"
    | "Obby Absorb Block"
    | "Obby Absorb Death Block"
    | "Bone Block"
    | "Pig Spawner Block"
    | "Cow Spawner Block"
    | "Sheep Spawner Block"
    | "Cave Golem Spawner Block"
    | "Draugr Zombie Spawner Block"
    | "Draugr Skeleton Spawner Block"
    | "Empty Spawner Block"
    | "Frost Golem Spawner Block"
    | "Frost Zombie Spawner Block"
    | "Frost Skeleton Spawner Block"
    | "Snowy Messy Stone"
    | "Snowy Stone Slab"
    | `Snowy Stone Slab|meta|rot${1|2|3|4}|top`
    | `Snowy Stone Slab|meta|rot${1|2|3|4}|bot`
    | `Snowy Stone Slab|meta|rot${1|2|3|4}|side`
    | `Snowy Stone Slab|meta|rot${1|2|3|4}`
    | "Draugr Knight Spawner Block"
    | "Packed Snow"
    | "Carved Messy Stone"
    | "Spectral Grass"
    | "Spectral Log"
    | `Spectral Log|TreeBase|${WoodType}`
    | "Barkless Spectral Log"
    | `Barkless Spectral Log|TreeBase|${WoodType}`
    | "Spectral Wood Planks"
    | "Spectral Leaves"
    | "Spectral Leaves|TreeCanopy"
    | "Spectral Door"
    | `Spectral Door|meta|rot${1|2|3|4}|open`
    | `Spectral Door|meta|rot${1|2|3|4}|closed`
    | `Spectral Door|meta|rot${1|2|3|4}`
    | "_Spectral Door Top"
    | `_Spectral Door Top|meta|rot${1|2|3|4}|open`
    | `_Spectral Door Top|meta|rot${1|2|3|4}|closed`
    | `_Spectral Door Top|meta|rot${1|2|3|4}`
    | "Spectral Trapdoor"
    | `Spectral Trapdoor|meta|rot${1|2|3|4}|open`
    | `Spectral Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Spectral Trapdoor|meta|rot${1|2|3|4}`
    | "Spectral Sapling"
    | "Spectral Slab"
    | `Spectral Slab|meta|rot${1|2|3|4}|top`
    | `Spectral Slab|meta|rot${1|2|3|4}|bot`
    | `Spectral Slab|meta|rot${1|2|3|4}|side`
    | `Spectral Slab|meta|rot${1|2|3|4}`
    | "Spectral Ladder"
    | `Spectral Ladder|meta|rot${1|2|3|4}`
    | "Wood Enchanting Table"
    | `Wood Enchanting Table|meta|rot${1|2|3|4}`
    | "Stone Enchanting Table"
    | `Stone Enchanting Table|meta|rot${1|2|3|4}`
    | "Iron Enchanting Table"
    | `Iron Enchanting Table|meta|rot${1|2|3|4}`
    | "Gold Enchanting Table"
    | `Gold Enchanting Table|meta|rot${1|2|3|4}`
    | "Diamond Enchanting Table"
    | `Diamond Enchanting Table|meta|rot${1|2|3|4}`
    | "Pine Grass Block"
    | "Pine Grass Slab"
    | `Pine Grass Slab|meta|rot${1|2|3|4}|top`
    | `Pine Grass Slab|meta|rot${1|2|3|4}|bot`
    | `Pine Grass Slab|meta|rot${1|2|3|4}|side`
    | `Pine Grass Slab|meta|rot${1|2|3|4}`
    | "Pine Grass"
    | "Pine Fern"
    | "Fallen Pine Cone"
    | "Pine Cone Block"
    | "Wolf Spawner Block"
    | "Bear Spawner Block"
    | "Deer Spawner Block"
    | "Stag Spawner Block"
    | "Bone Antlers"
    | `Bone Antlers|meta|rot${1|2|3|4}`
    | "Gold Antlers"
    | `Gold Antlers|meta|rot${1|2|3|4}`
    | "Gold Watermelon Stag Spawner Block"
    | "Salvaging Table"
    | `Salvaging Table|meta|rot${1|2|3|4}`
    | "Chalk"
    | "Yellow Chalk"
    | "White Chalk"
    | "Red Chalk"
    | "Purple Chalk"
    | "Pink Chalk"
    | "Orange Chalk"
    | "Magenta Chalk"
    | "Lime Chalk"
    | "Light Gray Chalk"
    | "Light Blue Chalk"
    | "Green Chalk"
    | "Gray Chalk"
    | "Cyan Chalk"
    | "Brown Chalk"
    | "Blue Chalk"
    | "Black Chalk"
    | "Yellow Chalk Bricks"
    | "White Chalk Bricks"
    | "Red Chalk Bricks"
    | "Purple Chalk Bricks"
    | "Pink Chalk Bricks"
    | "Orange Chalk Bricks"
    | "Magenta Chalk Bricks"
    | "Lime Chalk Bricks"
    | "Light Gray Chalk Bricks"
    | "Light Blue Chalk Bricks"
    | "Green Chalk Bricks"
    | "Gray Chalk Bricks"
    | "Cyan Chalk Bricks"
    | "Brown Chalk Bricks"
    | "Blue Chalk Bricks"
    | "Black Chalk Bricks"
    | "Yellow Chalk Slab"
    | `Yellow Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Yellow Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Yellow Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Yellow Chalk Slab|meta|rot${1|2|3|4}`
    | "White Chalk Slab"
    | `White Chalk Slab|meta|rot${1|2|3|4}|top`
    | `White Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `White Chalk Slab|meta|rot${1|2|3|4}|side`
    | `White Chalk Slab|meta|rot${1|2|3|4}`
    | "Red Chalk Slab"
    | `Red Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Red Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Red Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Red Chalk Slab|meta|rot${1|2|3|4}`
    | "Purple Chalk Slab"
    | `Purple Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Purple Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Purple Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Purple Chalk Slab|meta|rot${1|2|3|4}`
    | "Pink Chalk Slab"
    | `Pink Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Pink Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Pink Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Pink Chalk Slab|meta|rot${1|2|3|4}`
    | "Orange Chalk Slab"
    | `Orange Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Orange Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Orange Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Orange Chalk Slab|meta|rot${1|2|3|4}`
    | "Magenta Chalk Slab"
    | `Magenta Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Magenta Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Magenta Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Magenta Chalk Slab|meta|rot${1|2|3|4}`
    | "Lime Chalk Slab"
    | `Lime Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Lime Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Lime Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Lime Chalk Slab|meta|rot${1|2|3|4}`
    | "Light Gray Chalk Slab"
    | `Light Gray Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Light Gray Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Light Gray Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Light Gray Chalk Slab|meta|rot${1|2|3|4}`
    | "Light Blue Chalk Slab"
    | `Light Blue Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Light Blue Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Light Blue Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Light Blue Chalk Slab|meta|rot${1|2|3|4}`
    | "Green Chalk Slab"
    | `Green Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Green Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Green Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Green Chalk Slab|meta|rot${1|2|3|4}`
    | "Gray Chalk Slab"
    | `Gray Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Gray Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Gray Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Gray Chalk Slab|meta|rot${1|2|3|4}`
    | "Cyan Chalk Slab"
    | `Cyan Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Cyan Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Cyan Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Cyan Chalk Slab|meta|rot${1|2|3|4}`
    | "Brown Chalk Slab"
    | `Brown Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Brown Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Brown Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Brown Chalk Slab|meta|rot${1|2|3|4}`
    | "Blue Chalk Slab"
    | `Blue Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Blue Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Blue Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Blue Chalk Slab|meta|rot${1|2|3|4}`
    | "Black Chalk Slab"
    | `Black Chalk Slab|meta|rot${1|2|3|4}|top`
    | `Black Chalk Slab|meta|rot${1|2|3|4}|bot`
    | `Black Chalk Slab|meta|rot${1|2|3|4}|side`
    | `Black Chalk Slab|meta|rot${1|2|3|4}`
    | "Yellow Chalk Bricks Slab"
    | `Yellow Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Yellow Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Yellow Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Yellow Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "White Chalk Bricks Slab"
    | `White Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `White Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `White Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `White Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Red Chalk Bricks Slab"
    | `Red Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Red Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Red Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Red Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Purple Chalk Bricks Slab"
    | `Purple Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Purple Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Purple Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Purple Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Pink Chalk Bricks Slab"
    | `Pink Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Pink Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Pink Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Pink Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Orange Chalk Bricks Slab"
    | `Orange Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Orange Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Orange Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Orange Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Magenta Chalk Bricks Slab"
    | `Magenta Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Magenta Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Magenta Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Magenta Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Lime Chalk Bricks Slab"
    | `Lime Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Lime Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Lime Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Lime Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Light Gray Chalk Bricks Slab"
    | `Light Gray Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Light Gray Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Light Gray Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Light Gray Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Light Blue Chalk Bricks Slab"
    | `Light Blue Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Light Blue Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Light Blue Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Light Blue Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Green Chalk Bricks Slab"
    | `Green Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Green Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Green Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Green Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Gray Chalk Bricks Slab"
    | `Gray Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Gray Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Gray Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Gray Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Cyan Chalk Bricks Slab"
    | `Cyan Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Cyan Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Cyan Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Cyan Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Brown Chalk Bricks Slab"
    | `Brown Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Brown Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Brown Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Brown Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Blue Chalk Bricks Slab"
    | `Blue Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Blue Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Blue Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Blue Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Black Chalk Bricks Slab"
    | `Black Chalk Bricks Slab|meta|rot${1|2|3|4}|top`
    | `Black Chalk Bricks Slab|meta|rot${1|2|3|4}|bot`
    | `Black Chalk Bricks Slab|meta|rot${1|2|3|4}|side`
    | `Black Chalk Bricks Slab|meta|rot${1|2|3|4}`
    | "Leaf Bed"
    | `Leaf Bed|meta|rot${1|2|3|4}`
    | "_Leaf Bed Head"
    | `_Leaf Bed Head|meta|rot${1|2|3|4}`
    | "Jungle Grass Block"
    | "Jungle Grass Slab"
    | `Jungle Grass Slab|meta|rot${1|2|3|4}|top`
    | `Jungle Grass Slab|meta|rot${1|2|3|4}|bot`
    | `Jungle Grass Slab|meta|rot${1|2|3|4}|side`
    | `Jungle Grass Slab|meta|rot${1|2|3|4}`
    | "Jungle Tall Grass"
    | "Jungle Tall Grass|Top"
    | "Catnip"
    | "Mango Log"
    | `Mango Log|TreeBase|${WoodType}`
    | "Barkless Mango Log"
    | `Barkless Mango Log|TreeBase|${WoodType}`
    | "Mango Wood Planks"
    | "Mango Leaves"
    | "Mango Leaves|TreeCanopy"
    | "Mango Door"
    | `Mango Door|meta|rot${1|2|3|4}|open`
    | `Mango Door|meta|rot${1|2|3|4}|closed`
    | `Mango Door|meta|rot${1|2|3|4}`
    | "_Mango Door Top"
    | `_Mango Door Top|meta|rot${1|2|3|4}|open`
    | `_Mango Door Top|meta|rot${1|2|3|4}|closed`
    | `_Mango Door Top|meta|rot${1|2|3|4}`
    | "Mango Trapdoor"
    | `Mango Trapdoor|meta|rot${1|2|3|4}|open`
    | `Mango Trapdoor|meta|rot${1|2|3|4}|closed`
    | `Mango Trapdoor|meta|rot${1|2|3|4}`
    | "Mango Sapling"
    | "Mango Slab"
    | `Mango Slab|meta|rot${1|2|3|4}|top`
    | `Mango Slab|meta|rot${1|2|3|4}|bot`
    | `Mango Slab|meta|rot${1|2|3|4}|side`
    | `Mango Slab|meta|rot${1|2|3|4}`
    | "Mango Ladder"
    | `Mango Ladder|meta|rot${1|2|3|4}`
    | "Mango Block"
    | "Banana Block"
    | "Banana Seeds"
    | "Banana Seeds|Growing"
    | "Attached Banana Stem"
    | `Attached Banana Stem|meta|rot${1|2|3|4}`
    | "Dangling Rope"
    | "Dangling Vine"
    | "Gorilla Spawner Block"
    | "Wildcat Spawner Block"
    | "Fruity Maple Leaves"
    | "Pine Cone Leaves"
    | "Fruity Plum Leaves"
    | "Fruity Palm Leaves"
    | "Fruity Pear Leaves"
    | "Fruity Cherry Leaves"
    | "Fruity Mango Leaves"
    | "Draugr Huntress Spawner Block"
    | "Magma Golem Spawner Block"
    | "Black Portal"
    | "Blue Portal"
    | "Brown Portal"
    | "Cyan Portal"
    | "Gray Portal"
    | "Green Portal"
    | "Grey Portal"
    | "Light Blue Portal"
    | "Light Gray Portal"
    | "Lime Portal"
    | "Magenta Portal"
    | "Orange Portal"
    | "Pink Portal"
    | "Purple Portal"
    | "Red Portal"
    | "White Portal"
    | "Yellow Portal"
    | "Leather Block"
    | "Horse Spawner Block"
    | "Tomato Plant"
    | "Tomato Plant|FreshlyGrown"
    | "Tomato Plant|Top"
    | "Tomato Plant_stage1"
    | "Carrot Plant"
    | "Carrot Plant|FreshlyGrown"
    | "Carrot Plant_stage1"
    | "Potato Plant"
    | "Potato Plant|FreshlyGrown"
    | "Potato Plant_stage1"
    | "Strawberry Bush"
    | "Strawberry Bush_stage1"
    | "Strawberry Bush_stage2"
    | "Sugar Cane Plant"
    | "Sugar Cane Plant|FreshlyGrown"
    | "Sugar Cane Plant|Top"
    | "Sugar Cane Plant_stage1"
    | "Lettuce Plant"
    | "Lettuce Plant|FreshlyGrown"
    | "Lettuce Plant_stage1"
    | "Coffee Plant"
    | "Coffee Plant|FreshlyGrown"
    | "Coffee Plant_stage1"
    | "Cauliflower Plant"
    | "Cauliflower Plant|FreshlyGrown"
    | "Cauliflower Plant_stage1"
    | "Parsnip Plant"
    | "Parsnip Plant|FreshlyGrown"
    | "Parsnip Plant_stage1"
    | "Blueberry Bush"
    | "Blueberry Bush_stage1"
    | "Blueberry Bush_stage2"
    | "Red Cabbage Plant"
    | "Red Cabbage Plant|FreshlyGrown"
    | "Red Cabbage Plant_stage1"
    | "Beetroot Plant"
    | "Beetroot Plant|FreshlyGrown"
    | "Beetroot Plant_stage1"
    | "Autumn Aspen Leaves"
    | "Autumn Aspen Leaves|TreeCanopy"
    | "Autumn Fern"
    | "Iron Chest"
    | `Iron Chest|meta|rot${1|2|3|4}`
    | "Crate"
    | "Carrot Block"
    | "Carrot Seeds"
    | "Potato Block"
    | "Potato Seeds"
    | "Beetroot Block"
    | "Beetroot Seeds"
    | "White Banner"
    | `White Banner|meta|rot${1|2|3|4}|top`
    | `White Banner|meta|rot${1|2|3|4}|bot`
    | `White Banner|meta|rot${1|2|3|4}|side`
    | `White Banner|meta|rot${1|2|3|4}`
    | "_White Banner Flag"
    | `_White Banner Flag|meta|rot${1|2|3|4}|top`
    | `_White Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_White Banner Flag|meta|rot${1|2|3|4}|side`
    | `_White Banner Flag|meta|rot${1|2|3|4}`
    | "Orange Banner"
    | `Orange Banner|meta|rot${1|2|3|4}|top`
    | `Orange Banner|meta|rot${1|2|3|4}|bot`
    | `Orange Banner|meta|rot${1|2|3|4}|side`
    | `Orange Banner|meta|rot${1|2|3|4}`
    | "_Orange Banner Flag"
    | `_Orange Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Orange Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Orange Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Orange Banner Flag|meta|rot${1|2|3|4}`
    | "Magenta Banner"
    | `Magenta Banner|meta|rot${1|2|3|4}|top`
    | `Magenta Banner|meta|rot${1|2|3|4}|bot`
    | `Magenta Banner|meta|rot${1|2|3|4}|side`
    | `Magenta Banner|meta|rot${1|2|3|4}`
    | "_Magenta Banner Flag"
    | `_Magenta Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Magenta Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Magenta Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Magenta Banner Flag|meta|rot${1|2|3|4}`
    | "Light Blue Banner"
    | `Light Blue Banner|meta|rot${1|2|3|4}|top`
    | `Light Blue Banner|meta|rot${1|2|3|4}|bot`
    | `Light Blue Banner|meta|rot${1|2|3|4}|side`
    | `Light Blue Banner|meta|rot${1|2|3|4}`
    | "_Light Blue Banner Flag"
    | `_Light Blue Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Light Blue Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Light Blue Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Light Blue Banner Flag|meta|rot${1|2|3|4}`
    | "Yellow Banner"
    | `Yellow Banner|meta|rot${1|2|3|4}|top`
    | `Yellow Banner|meta|rot${1|2|3|4}|bot`
    | `Yellow Banner|meta|rot${1|2|3|4}|side`
    | `Yellow Banner|meta|rot${1|2|3|4}`
    | "_Yellow Banner Flag"
    | `_Yellow Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Yellow Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Yellow Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Yellow Banner Flag|meta|rot${1|2|3|4}`
    | "Lime Banner"
    | `Lime Banner|meta|rot${1|2|3|4}|top`
    | `Lime Banner|meta|rot${1|2|3|4}|bot`
    | `Lime Banner|meta|rot${1|2|3|4}|side`
    | `Lime Banner|meta|rot${1|2|3|4}`
    | "_Lime Banner Flag"
    | `_Lime Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Lime Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Lime Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Lime Banner Flag|meta|rot${1|2|3|4}`
    | "Pink Banner"
    | `Pink Banner|meta|rot${1|2|3|4}|top`
    | `Pink Banner|meta|rot${1|2|3|4}|bot`
    | `Pink Banner|meta|rot${1|2|3|4}|side`
    | `Pink Banner|meta|rot${1|2|3|4}`
    | "_Pink Banner Flag"
    | `_Pink Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Pink Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Pink Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Pink Banner Flag|meta|rot${1|2|3|4}`
    | "Gray Banner"
    | `Gray Banner|meta|rot${1|2|3|4}|top`
    | `Gray Banner|meta|rot${1|2|3|4}|bot`
    | `Gray Banner|meta|rot${1|2|3|4}|side`
    | `Gray Banner|meta|rot${1|2|3|4}`
    | "_Gray Banner Flag"
    | `_Gray Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Gray Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Gray Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Gray Banner Flag|meta|rot${1|2|3|4}`
    | "Light Gray Banner"
    | `Light Gray Banner|meta|rot${1|2|3|4}|top`
    | `Light Gray Banner|meta|rot${1|2|3|4}|bot`
    | `Light Gray Banner|meta|rot${1|2|3|4}|side`
    | `Light Gray Banner|meta|rot${1|2|3|4}`
    | "_Light Gray Banner Flag"
    | `_Light Gray Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Light Gray Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Light Gray Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Light Gray Banner Flag|meta|rot${1|2|3|4}`
    | "Cyan Banner"
    | `Cyan Banner|meta|rot${1|2|3|4}|top`
    | `Cyan Banner|meta|rot${1|2|3|4}|bot`
    | `Cyan Banner|meta|rot${1|2|3|4}|side`
    | `Cyan Banner|meta|rot${1|2|3|4}`
    | "_Cyan Banner Flag"
    | `_Cyan Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Cyan Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Cyan Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Cyan Banner Flag|meta|rot${1|2|3|4}`
    | "Purple Banner"
    | `Purple Banner|meta|rot${1|2|3|4}|top`
    | `Purple Banner|meta|rot${1|2|3|4}|bot`
    | `Purple Banner|meta|rot${1|2|3|4}|side`
    | `Purple Banner|meta|rot${1|2|3|4}`
    | "_Purple Banner Flag"
    | `_Purple Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Purple Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Purple Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Purple Banner Flag|meta|rot${1|2|3|4}`
    | "Blue Banner"
    | `Blue Banner|meta|rot${1|2|3|4}|top`
    | `Blue Banner|meta|rot${1|2|3|4}|bot`
    | `Blue Banner|meta|rot${1|2|3|4}|side`
    | `Blue Banner|meta|rot${1|2|3|4}`
    | "_Blue Banner Flag"
    | `_Blue Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Blue Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Blue Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Blue Banner Flag|meta|rot${1|2|3|4}`
    | "Brown Banner"
    | `Brown Banner|meta|rot${1|2|3|4}|top`
    | `Brown Banner|meta|rot${1|2|3|4}|bot`
    | `Brown Banner|meta|rot${1|2|3|4}|side`
    | `Brown Banner|meta|rot${1|2|3|4}`
    | "_Brown Banner Flag"
    | `_Brown Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Brown Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Brown Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Brown Banner Flag|meta|rot${1|2|3|4}`
    | "Green Banner"
    | `Green Banner|meta|rot${1|2|3|4}|top`
    | `Green Banner|meta|rot${1|2|3|4}|bot`
    | `Green Banner|meta|rot${1|2|3|4}|side`
    | `Green Banner|meta|rot${1|2|3|4}`
    | "_Green Banner Flag"
    | `_Green Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Green Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Green Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Green Banner Flag|meta|rot${1|2|3|4}`
    | "Red Banner"
    | `Red Banner|meta|rot${1|2|3|4}|top`
    | `Red Banner|meta|rot${1|2|3|4}|bot`
    | `Red Banner|meta|rot${1|2|3|4}|side`
    | `Red Banner|meta|rot${1|2|3|4}`
    | "_Red Banner Flag"
    | `_Red Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Red Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Red Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Red Banner Flag|meta|rot${1|2|3|4}`
    | "Black Banner"
    | `Black Banner|meta|rot${1|2|3|4}|top`
    | `Black Banner|meta|rot${1|2|3|4}|bot`
    | `Black Banner|meta|rot${1|2|3|4}|side`
    | `Black Banner|meta|rot${1|2|3|4}`
    | "_Black Banner Flag"
    | `_Black Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Black Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Black Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Black Banner Flag|meta|rot${1|2|3|4}`
    | "Draugr Banner"
    | `Draugr Banner|meta|rot${1|2|3|4}|top`
    | `Draugr Banner|meta|rot${1|2|3|4}|bot`
    | `Draugr Banner|meta|rot${1|2|3|4}|side`
    | `Draugr Banner|meta|rot${1|2|3|4}`
    | "_Draugr Banner Flag"
    | `_Draugr Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Draugr Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Draugr Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Draugr Banner Flag|meta|rot${1|2|3|4}`
    | "Spirit Golem Spawner Block"
    | "Spirit Wolf Spawner Block"
    | "Spirit Bear Spawner Block"
    | "Spirit Stag Spawner Block"
    | "Spirit Gorilla Spawner Block"
    | "Fertilised Soil"
    | "_Grant Wool Top Left"
    | `_Grant Wool Top Left|meta|rot${1|2|3|4}`
    | "_Grant Wool Top Right"
    | `_Grant Wool Top Right|meta|rot${1|2|3|4}`
    | "Grant Wool"
    | `Grant Wool|meta|rot${1|2|3|4}`
    | "_Grant Wool Bottom Right"
    | `_Grant Wool Bottom Right|meta|rot${1|2|3|4}`
    | "_Stampede Top Left"
    | `_Stampede Top Left|meta|rot${1|2|3|4}`
    | "_Stampede Top Right"
    | `_Stampede Top Right|meta|rot${1|2|3|4}`
    | "Stampede"
    | `Stampede|meta|rot${1|2|3|4}`
    | "_Stampede Bottom Right"
    | `_Stampede Bottom Right|meta|rot${1|2|3|4}`
    | "_Unforgotten Pig Top Left"
    | `_Unforgotten Pig Top Left|meta|rot${1|2|3|4}`
    | "_Unforgotten Pig Top Right"
    | `_Unforgotten Pig Top Right|meta|rot${1|2|3|4}`
    | "Unforgotten Pig"
    | `Unforgotten Pig|meta|rot${1|2|3|4}`
    | "_Unforgotten Pig Bottom Right"
    | `_Unforgotten Pig Bottom Right|meta|rot${1|2|3|4}`
    | "_Sunbathed Gallope Top Left"
    | `_Sunbathed Gallope Top Left|meta|rot${1|2|3|4}`
    | "_Sunbathed Gallope Top Right"
    | `_Sunbathed Gallope Top Right|meta|rot${1|2|3|4}`
    | "Sunbathed Gallope"
    | `Sunbathed Gallope|meta|rot${1|2|3|4}`
    | "_Sunbathed Gallope Bottom Right"
    | `_Sunbathed Gallope Bottom Right|meta|rot${1|2|3|4}`
    | "_Dreaming Canine Top Left"
    | `_Dreaming Canine Top Left|meta|rot${1|2|3|4}`
    | "_Dreaming Canine Top Right"
    | `_Dreaming Canine Top Right|meta|rot${1|2|3|4}`
    | "Dreaming Canine"
    | `Dreaming Canine|meta|rot${1|2|3|4}`
    | "_Dreaming Canine Bottom Right"
    | `_Dreaming Canine Bottom Right|meta|rot${1|2|3|4}`
    | "_A Doe Through The Green Top Left"
    | `_A Doe Through The Green Top Left|meta|rot${1|2|3|4}`
    | "_A Doe Through The Green Top Right"
    | `_A Doe Through The Green Top Right|meta|rot${1|2|3|4}`
    | "A Doe Through The Green"
    | `A Doe Through The Green|meta|rot${1|2|3|4}`
    | "_A Doe Through The Green Bottom Right"
    | `_A Doe Through The Green Bottom Right|meta|rot${1|2|3|4}`
    | "_Whiskers Top Left"
    | `_Whiskers Top Left|meta|rot${1|2|3|4}`
    | "_Whiskers Top Right"
    | `_Whiskers Top Right|meta|rot${1|2|3|4}`
    | "Whiskers"
    | `Whiskers|meta|rot${1|2|3|4}`
    | "_Whiskers Bottom Right"
    | `_Whiskers Bottom Right|meta|rot${1|2|3|4}`
    | "Hollow Crate"
    | "Draugr Warper Spawner Block"
    | "Radar"
    | `Radar|meta|rot${1|2|3|4}`
    | "_Radar Back"
    | `_Radar Back|meta|rot${1|2|3|4}`
    | "_Radar Dish"
    | `_Radar Dish|meta|rot${1|2|3|4}`
    | "Inactive Radar"
    | `Inactive Radar|meta|rot${1|2|3|4}`
    | "_Inactive Radar Back"
    | `_Inactive Radar Back|meta|rot${1|2|3|4}`
    | "_Inactive Radar Dish"
    | `_Inactive Radar Dish|meta|rot${1|2|3|4}`
    | "Active Radar"
    | `Active Radar|meta|rot${1|2|3|4}`
    | "_Active Radar Back"
    | `_Active Radar Back|meta|rot${1|2|3|4}`
    | "_Active Radar Dish"
    | `_Active Radar Dish|meta|rot${1|2|3|4}`
    | "Lucky Block"
    | "Ultra Lucky Block"
    | "Gold Trophy"
    | `Gold Trophy|meta|rot${1|2|3|4}`
    | "Small Magenta Pod"
    | "_Small Magenta Pod Mid"
    | "_Small Magenta Pod Top"
    | "Small Light Gray Pod"
    | "_Small Light Gray Pod Mid"
    | "_Small Light Gray Pod Top"
    | "Small Red Pod"
    | "_Small Red Pod Mid"
    | "_Small Red Pod Top"
    | "INTERNAL_MESH_Gold Trophy"
    | "Frost Wraith Spawner Block"
    | "Draugr Reaver Spawner Block"
    | "Small White Pod"
    | "_Small White Pod Mid"
    | "_Small White Pod Top"
    | "Small Orange Pod"
    | "_Small Orange Pod Mid"
    | "_Small Orange Pod Top"
    | "Small Light Blue Pod"
    | "_Small Light Blue Pod Mid"
    | "_Small Light Blue Pod Top"
    | "Small Yellow Pod"
    | "_Small Yellow Pod Mid"
    | "_Small Yellow Pod Top"
    | "Small Lime Pod"
    | "_Small Lime Pod Mid"
    | "_Small Lime Pod Top"
    | "Small Pink Pod"
    | "_Small Pink Pod Mid"
    | "_Small Pink Pod Top"
    | "Small Gray Pod"
    | "_Small Gray Pod Mid"
    | "_Small Gray Pod Top"
    | "Small Cyan Pod"
    | "_Small Cyan Pod Mid"
    | "_Small Cyan Pod Top"
    | "Small Purple Pod"
    | "_Small Purple Pod Mid"
    | "_Small Purple Pod Top"
    | "Small Blue Pod"
    | "_Small Blue Pod Mid"
    | "_Small Blue Pod Top"
    | "Small Brown Pod"
    | "_Small Brown Pod Mid"
    | "_Small Brown Pod Top"
    | "Small Green Pod"
    | "_Small Green Pod Mid"
    | "_Small Green Pod Top"
    | "Small Black Pod"
    | "_Small Black Pod Mid"
    | "_Small Black Pod Top"
    | "Skull Banner"
    | `Skull Banner|meta|rot${1|2|3|4}|top`
    | `Skull Banner|meta|rot${1|2|3|4}|bot`
    | `Skull Banner|meta|rot${1|2|3|4}|side`
    | `Skull Banner|meta|rot${1|2|3|4}`
    | "_Skull Banner Flag"
    | `_Skull Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Skull Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Skull Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Skull Banner Flag|meta|rot${1|2|3|4}`
    | "Rainbow Banner"
    | `Rainbow Banner|meta|rot${1|2|3|4}|top`
    | `Rainbow Banner|meta|rot${1|2|3|4}|bot`
    | `Rainbow Banner|meta|rot${1|2|3|4}|side`
    | `Rainbow Banner|meta|rot${1|2|3|4}`
    | "_Rainbow Banner Flag"
    | `_Rainbow Banner Flag|meta|rot${1|2|3|4}|top`
    | `_Rainbow Banner Flag|meta|rot${1|2|3|4}|bot`
    | `_Rainbow Banner Flag|meta|rot${1|2|3|4}|side`
    | `_Rainbow Banner Flag|meta|rot${1|2|3|4}`
    | "Duo Blocchino Statue"
    | "Bebek Bebek Bebek Statue"
    | "Bobino Musculino Statue"
    | "Bobzilla Statue"
    | "Brra Brra Pachim Statue"
    | "Capitano Explovissimo Statue"
    | "Cappuccino Ninjino Statue"
    | "Chimpanzano Bananano Statue"
    | "Il Wizardini Del Porko Statue"
    | "Lucchia Blocchi Statue"
    | "Monsieur Bedwar Statue"
    | "Twirlina Cappucina Statue"
    | "Weapon Lucky Block"
    | "Boiling Pot"
    | "Chopping Board"
    | "Frying Pan"
    | "Hob Boiling"
    | "Hob Frying"
    | "Kitchen Worktop"
    | "Slicing Board"
    | "Wood Trophy"
    | `Wood Trophy|meta|rot${1|2|3|4}`
    | "INTERNAL_MESH_Wood Trophy"
    | "Stone Trophy"
    | `Stone Trophy|meta|rot${1|2|3|4}`
    | "INTERNAL_MESH_Stone Trophy"
    | "Iron Trophy"
    | `Iron Trophy|meta|rot${1|2|3|4}`
    | "INTERNAL_MESH_Iron Trophy"
    | "Diamond Trophy"
    | `Diamond Trophy|meta|rot${1|2|3|4}`
    | "INTERNAL_MESH_Diamond Trophy"
    | "Moonstone Trophy"
    | `Moonstone Trophy|meta|rot${1|2|3|4}`
    | "INTERNAL_MESH_Moonstone Trophy"
    | "Black Wave"
    | "Blue Wave"
    | "Brown Wave"
    | "Cyan Wave"
    | "Green Wave"
    | "Grey Wave"
    | "Light Blue Wave"
    | "Light Grey Wave"
    | "Lime Wave"
    | "Magenta Wave"
    | "Orange Wave"
    | "Pink Wave"
    | "Purple Wave"
    | "Red Wave"
    | "White Wave"
    | "Yellow Wave"
    | "White Directional Arrow"
    | `White Directional Arrow|meta|rot${1|2|3|4}`
    | "Orange Directional Arrow"
    | `Orange Directional Arrow|meta|rot${1|2|3|4}`
    | "Magenta Directional Arrow"
    | `Magenta Directional Arrow|meta|rot${1|2|3|4}`
    | "Light Blue Directional Arrow"
    | `Light Blue Directional Arrow|meta|rot${1|2|3|4}`
    | "Yellow Directional Arrow"
    | `Yellow Directional Arrow|meta|rot${1|2|3|4}`
    | "Lime Directional Arrow"
    | `Lime Directional Arrow|meta|rot${1|2|3|4}`
    | "Pink Directional Arrow"
    | `Pink Directional Arrow|meta|rot${1|2|3|4}`
    | "Grey Directional Arrow"
    | `Grey Directional Arrow|meta|rot${1|2|3|4}`
    | "Light Grey Directional Arrow"
    | `Light Grey Directional Arrow|meta|rot${1|2|3|4}`
    | "Cyan Directional Arrow"
    | `Cyan Directional Arrow|meta|rot${1|2|3|4}`
    | "Purple Directional Arrow"
    | `Purple Directional Arrow|meta|rot${1|2|3|4}`
    | "Blue Directional Arrow"
    | `Blue Directional Arrow|meta|rot${1|2|3|4}`
    | "Brown Directional Arrow"
    | `Brown Directional Arrow|meta|rot${1|2|3|4}`
    | "Green Directional Arrow"
    | `Green Directional Arrow|meta|rot${1|2|3|4}`
    | "Red Directional Arrow"
    | `Red Directional Arrow|meta|rot${1|2|3|4}`
    | "Black Directional Arrow"
    | `Black Directional Arrow|meta|rot${1|2|3|4}`
    | "Bin"
    | "Vending Machine"
    | `Vending Machine|meta|rot${1|2|3|4}`
    | "_Vending Machine Top"
    | `_Vending Machine Top|meta|rot${1|2|3|4}`
    | "Job Application Statue"
    | "John Beef Statue"
    | "67 Statue"
    | "Coloured Wheel"
    | "UFO"
    | "Torch"
    | `Torch|meta|rot${1|2|3|4}|top`
    | `Torch|meta|rot${1|2|3|4}|bot`
    | `Torch|meta|rot${1|2|3|4}|side`
    | `Torch|meta|rot${1|2|3|4}`
    | "Yellow Torch"
    | `Yellow Torch|meta|rot${1|2|3|4}|top`
    | `Yellow Torch|meta|rot${1|2|3|4}|bot`
    | `Yellow Torch|meta|rot${1|2|3|4}|side`
    | `Yellow Torch|meta|rot${1|2|3|4}`
    | "White Torch"
    | `White Torch|meta|rot${1|2|3|4}|top`
    | `White Torch|meta|rot${1|2|3|4}|bot`
    | `White Torch|meta|rot${1|2|3|4}|side`
    | `White Torch|meta|rot${1|2|3|4}`
    | "Red Torch"
    | `Red Torch|meta|rot${1|2|3|4}|top`
    | `Red Torch|meta|rot${1|2|3|4}|bot`
    | `Red Torch|meta|rot${1|2|3|4}|side`
    | `Red Torch|meta|rot${1|2|3|4}`
    | "Purple Torch"
    | `Purple Torch|meta|rot${1|2|3|4}|top`
    | `Purple Torch|meta|rot${1|2|3|4}|bot`
    | `Purple Torch|meta|rot${1|2|3|4}|side`
    | `Purple Torch|meta|rot${1|2|3|4}`
    | "Pink Torch"
    | `Pink Torch|meta|rot${1|2|3|4}|top`
    | `Pink Torch|meta|rot${1|2|3|4}|bot`
    | `Pink Torch|meta|rot${1|2|3|4}|side`
    | `Pink Torch|meta|rot${1|2|3|4}`
    | "Orange Torch"
    | `Orange Torch|meta|rot${1|2|3|4}|top`
    | `Orange Torch|meta|rot${1|2|3|4}|bot`
    | `Orange Torch|meta|rot${1|2|3|4}|side`
    | `Orange Torch|meta|rot${1|2|3|4}`
    | "Magenta Torch"
    | `Magenta Torch|meta|rot${1|2|3|4}|top`
    | `Magenta Torch|meta|rot${1|2|3|4}|bot`
    | `Magenta Torch|meta|rot${1|2|3|4}|side`
    | `Magenta Torch|meta|rot${1|2|3|4}`
    | "Lime Torch"
    | `Lime Torch|meta|rot${1|2|3|4}|top`
    | `Lime Torch|meta|rot${1|2|3|4}|bot`
    | `Lime Torch|meta|rot${1|2|3|4}|side`
    | `Lime Torch|meta|rot${1|2|3|4}`
    | "Light Gray Torch"
    | `Light Gray Torch|meta|rot${1|2|3|4}|top`
    | `Light Gray Torch|meta|rot${1|2|3|4}|bot`
    | `Light Gray Torch|meta|rot${1|2|3|4}|side`
    | `Light Gray Torch|meta|rot${1|2|3|4}`
    | "Light Blue Torch"
    | `Light Blue Torch|meta|rot${1|2|3|4}|top`
    | `Light Blue Torch|meta|rot${1|2|3|4}|bot`
    | `Light Blue Torch|meta|rot${1|2|3|4}|side`
    | `Light Blue Torch|meta|rot${1|2|3|4}`
    | "Green Torch"
    | `Green Torch|meta|rot${1|2|3|4}|top`
    | `Green Torch|meta|rot${1|2|3|4}|bot`
    | `Green Torch|meta|rot${1|2|3|4}|side`
    | `Green Torch|meta|rot${1|2|3|4}`
    | "Gray Torch"
    | `Gray Torch|meta|rot${1|2|3|4}|top`
    | `Gray Torch|meta|rot${1|2|3|4}|bot`
    | `Gray Torch|meta|rot${1|2|3|4}|side`
    | `Gray Torch|meta|rot${1|2|3|4}`
    | "Cyan Torch"
    | `Cyan Torch|meta|rot${1|2|3|4}|top`
    | `Cyan Torch|meta|rot${1|2|3|4}|bot`
    | `Cyan Torch|meta|rot${1|2|3|4}|side`
    | `Cyan Torch|meta|rot${1|2|3|4}`
    | "Brown Torch"
    | `Brown Torch|meta|rot${1|2|3|4}|top`
    | `Brown Torch|meta|rot${1|2|3|4}|bot`
    | `Brown Torch|meta|rot${1|2|3|4}|side`
    | `Brown Torch|meta|rot${1|2|3|4}`
    | "Blue Torch"
    | `Blue Torch|meta|rot${1|2|3|4}|top`
    | `Blue Torch|meta|rot${1|2|3|4}|bot`
    | `Blue Torch|meta|rot${1|2|3|4}|side`
    | `Blue Torch|meta|rot${1|2|3|4}`
    | "Black Torch"
    | `Black Torch|meta|rot${1|2|3|4}|top`
    | `Black Torch|meta|rot${1|2|3|4}|bot`
    | `Black Torch|meta|rot${1|2|3|4}|side`
    | `Black Torch|meta|rot${1|2|3|4}`
    | "Yellow Neon"
    | "White Neon"
    | "Red Neon"
    | "Purple Neon"
    | "Pink Neon"
    | "Orange Neon"
    | "Magenta Neon"
    | "Lime Neon"
    | "Light Gray Neon"
    | "Light Blue Neon"
    | "Green Neon"
    | "Gray Neon"
    | "Cyan Neon"
    | "Brown Neon"
    | "Blue Neon"
    | "Black Neon"
    | "Landing Pad"
    | "Weak Jump Pad"
    | "Jump Pad"
    | "Strong Jump Pad"
    | "Super Jump Pad"
    | "Invisible Yellow Light"
    | "Invisible White Light"
    | "Invisible Red Light"
    | "Invisible Purple Light"
    | "Invisible Pink Light"
    | "Invisible Orange Light"
    | "Invisible Magenta Light"
    | "Invisible Lime Light"
    | "Invisible Light Gray Light"
    | "Invisible Light Blue Light"
    | "Invisible Green Light"
    | "Invisible Gray Light"
    | "Invisible Cyan Light"
    | "Invisible Brown Light"
    | "Invisible Blue Light"
    | "Invisible Black Light"
    | "Invisible Sky Light"
    | "Gun Lucky Block"
    | "Ghost Chest"
    | "Ghost Lucky Block"
    | "Ghost Mystery Block"
    | "Football"
    | "Pet Lucky Block"
    | "Glowing Mushroom"
    | `Glowing Mushroom|meta|rot${1|2|3|4}|top`
    | `Glowing Mushroom|meta|rot${1|2|3|4}|bot`
    | `Glowing Mushroom|meta|rot${1|2|3|4}|side`
    | `Glowing Mushroom|meta|rot${1|2|3|4}`
    | "Crystal"
    | `Crystal|meta|rot${1|2|3|4}|top`
    | `Crystal|meta|rot${1|2|3|4}|bot`
    | `Crystal|meta|rot${1|2|3|4}|side`
    | `Crystal|meta|rot${1|2|3|4}`
    | "Slime Trail"
    | `Slime Trail|meta|rot${1|2|3|4}`
;


declare type IngameIconName =
  | "Damage"
  | "Damage Reduction"
  | "Speed"
  | "VoidJump"
  | "Fist"
  | "Frozen"
  | "Hydrated"
  | "Invisible"
  | "Jump Boost"
  | "Poisoned"
  | "Slowness"
  | "Weakness"
  | "Health Regen"
  | "Haste"
  | "Double Jump"
  | "Heat Resistance"
  | "Gliding"
  | "Boating"
  | "Obsidian Boating"
  | "Riding"
  | "Bunny Hop"
  | "FallDamage"
  | "Feather Falling"
  | "Thief"
  | "X-Ray Vision"
  | "Mining Yield"
  | "Brain Rot"
  | "Rested Damage"
  | "Rested Haste"
  | "Rested Speed"
  | "Rested Farming Yield"
  | "Rested Aura"
  | "Blindness"
  | "Pickpocketer"
  | "Lifesteal"
  | "Bounciness"
  | "Air Walk"
  | "Wall Climbing"
  | "Thorns"
  | "Poopy"
  | "Draugr Knight Head"
  | "Draugr Warper Head"
  | "Magma Golem Head"
  | "Mystery Fish"
  | "Damage Enchantment"
  | "Critical Damage Enchantment"
  | "Attack Speed Enchantment"
  | "Protection Enchantment"
  | "Health Enchantment"
  | "Health Regen Enchantment"
  | "Stomp Damage Enchantment"
  | "Knockback Resist Enchantment"
  | "Arrow Speed Enchantment"
  | "Arrow Damage Enchantment"
  | "Quick Charge Enchantment"
  | "Break Speed Enchantment"
  | "Momentum Enchantment"
  | "Mining Yield Enchantment"
  | "Farming Yield Enchantment"
  | "Mining Aura Enchantment"
  | "Digging Aura Enchantment"
  | "Lumber Aura Enchantment"
  | "Farming Aura Enchantment"
  | "Vertical Knockback Enchantment"
  | "Horizontal Knockback Enchantment"
  | "Self Yield"
  | "Friends"
  | "Riding Speed"
  | "Feed Aura"
  | "Double Poop"
  | "Mob Slayer"
  | "Rainbow Wool"
  | "Pack Leader"
  | "Max Health"
  | "Poison Claws"
  | "Mob Yield"
  | "Antlers Bonus"
  | "Health"
  | "HealthShield"
  | "Cross"
  | "Friendship"
  | "Dotted Friendship"
  | "Hunger"
  | "Empty Hunger"
  | "Pixelated Heart"
  | "Question Mark"
  | "Trader Black"
  | "Trader Blue"
  | "Trader Piggy";


declare type FontAwesomeIconName =
  | "fa-add"
  | "fa-angle-double-up"
  | "fa-angle-down"
  | "fa-angle-up"
  | "fa-angles-up"
  | "fa-arrow-up"
  | "fa-arrow-up-right-from-square"
  | "fa-arrows"
  | "fa-arrows-h"
  | "fa-arrows-left-right"
  | "fa-arrows-rotate"
  | "fa-arrows-up-down-left-right"
  | "fa-award"
  | "fa-backpack"
  | "fa-bars"
  | "fa-block-question"
  | "fa-bolt"
  | "fa-boot"
  | "fa-caret-up"
  | "fa-cart-shopping"
  | "fa-check"
  | "fa-chess-rook"
  | "fa-circle-info"
  | "fa-circle-plus"
  | "fa-clock-rotate-left"
  | "fa-cog"
  | "fa-coins"
  | "fa-comment-dots"
  | "fa-commenting"
  | "fa-compress"
  | "fa-computer-mouse"
  | "fa-cookie"
  | "fa-copy"
  | "fa-crosshairs"
  | "fa-crown"
  | "fa-cube"
  | "fa-cubes"
  | "fa-cut"
  | "fa-dice"
  | "fa-dizzy"
  | "fa-door-closed"
  | "fa-door-open"
  | "fa-download"
  | "fa-edit"
  | "fa-ellipsis"
  | "fa-ellipsis-h"
  | "fa-exclamation"
  | "fa-exclamation-triangle"
  | "fa-expand"
  | "fa-external-link"
  | "fa-eye"
  | "fa-eye-slash"
  | "fa-face-diagonal-mouth"
  | "fa-face-dizzy"
  | "fa-face-raised-eyebrow"
  | "fa-face-smile"
  | "fa-face-worried"
  | "fa-feather-alt"
  | "fa-feather-pointed"
  | "fa-file-alt"
  | "fa-file-clipboard"
  | "fa-file-lines"
  | "fa-file-text"
  | "fa-film"
  | "fa-fire"
  | "fa-fist-raised"
  | "fa-flag"
  | "fa-folder-image"
  | "fa-gauge-high"
  | "fa-gear"
  | "fa-gem"
  | "fa-globe"
  | "fa-hammer"
  | "fa-hand-back-point-up"
  | "fa-hand-fist"
  | "fa-hand-holding-medical"
  | "fa-hand-point-left"
  | "fa-hand-wave"
  | "fa-hands-clapping"
  | "fa-hat-santa"
  | "fa-hat-witch"
  | "fa-heart"
  | "fa-heart-music-camera-bolt"
  | "fa-history"
  | "fa-hourglass-clock"
  | "fa-icons"
  | "fa-image"
  | "fa-image-slash"
  | "fa-info-circle"
  | "fa-joystick"
  | "fa-layer-group"
  | "fa-lightbulb"
  | "fa-list"
  | "fa-list-squares"
  | "fa-location-check"
  | "fa-location-xmark"
  | "fa-lock"
  | "fa-lock-open"
  | "fa-magnifying-glass"
  | "fa-male"
  | "fa-map-marker-check"
  | "fa-map-marker-times"
  | "fa-map-marker-xmark"
  | "fa-minus-square"
  | "fa-mouse"
  | "fa-music"
  | "fa-navicon"
  | "fa-palette"
  | "fa-party-horn"
  | "fa-paste"
  | "fa-pen"
  | "fa-pen-field"
  | "fa-pen-to-square"
  | "fa-person"
  | "fa-person-arrow-down-to-line"
  | "fa-person-arrow-up-from-line"
  | "fa-person-falling-burst"
  | "fa-person-military-pointing"
  | "fa-planet-ringed"
  | "fa-plus"
  | "fa-plus-circle"
  | "fa-power-off"
  | "fa-recycle"
  | "fa-redo-alt"
  | "fa-refresh"
  | "fa-right-from-bracket"
  | "fa-rocket-launch"
  | "fa-rotate-forward"
  | "fa-rotate-right"
  | "fa-scissors"
  | "fa-search"
  | "fa-shield"
  | "fa-shield-alt"
  | "fa-shield-blank"
  | "fa-shield-halved"
  | "fa-shirt"
  | "fa-shopping-cart"
  | "fa-sign-out-alt"
  | "fa-smile"
  | "fa-snowflake"
  | "fa-square-dashed"
  | "fa-square-minus"
  | "fa-star"
  | "fa-store"
  | "fa-swords"
  | "fa-sync"
  | "fa-t-shirt"
  | "fa-tachometer-alt"
  | "fa-tachometer-alt-fast"
  | "fa-terminal"
  | "fa-trash-alt"
  | "fa-trash-can"
  | "fa-triangle-exclamation"
  | "fa-trophy"
  | "fa-tshirt"
  | "fa-up-from-bracket"
  | "fa-upload"
  | "fa-user"
  | "fa-user-astronaut"
  | "fa-user-friends"
  | "fa-user-group"
  | "fa-user-group-crown"
  | "fa-user-minus"
  | "fa-user-plus"
  | "fa-user-slash"
  | "fa-user-unlock"
  | "fa-users-crown"
  | "fa-video"
  | "fa-video-camera"
  | "fa-volume"
  | "fa-volume-down"
  | "fa-volume-low"
  | "fa-volume-medium"
  | "fa-volume-slash"
  | "fa-warning"
  | "fa-wrench"
  | "fa-x"
  | "fa-zap";


declare type FontAwesomeFullIcon =
  | "fa-solid fa-add"
  | "fa-solid fa-angle-double-up"
  | "fa-solid fa-angle-down"
  | "fa-solid fa-angle-up"
  | "fa-solid fa-angles-up"
  | "fa-solid fa-arrow-up"
  | "fa-solid fa-arrow-up-right-from-square"
  | "fa-solid fa-arrows"
  | "fa-solid fa-arrows-h"
  | "fa-solid fa-arrows-left-right"
  | "fa-solid fa-arrows-rotate"
  | "fa-solid fa-arrows-up-down-left-right"
  | "fa-solid fa-award"
  | "fa-solid fa-backpack"
  | "fa-solid fa-bars"
  | "fa-solid fa-block-question"
  | "fa-solid fa-bolt"
  | "fa-solid fa-boot"
  | "fa-solid fa-caret-up"
  | "fa-solid fa-cart-shopping"
  | "fa-solid fa-check"
  | "fa-solid fa-chess-rook"
  | "fa-solid fa-circle-info"
  | "fa-solid fa-circle-plus"
  | "fa-solid fa-clock-rotate-left"
  | "fa-solid fa-cog"
  | "fa-solid fa-coins"
  | "fa-solid fa-comment-dots"
  | "fa-solid fa-commenting"
  | "fa-solid fa-compress"
  | "fa-solid fa-computer-mouse"
  | "fa-solid fa-cookie"
  | "fa-solid fa-copy"
  | "fa-solid fa-crosshairs"
  | "fa-solid fa-crown"
  | "fa-solid fa-cube"
  | "fa-solid fa-cubes"
  | "fa-solid fa-cut"
  | "fa-solid fa-dice"
  | "fa-solid fa-dizzy"
  | "fa-solid fa-door-closed"
  | "fa-solid fa-door-open"
  | "fa-solid fa-download"
  | "fa-solid fa-edit"
  | "fa-solid fa-ellipsis"
  | "fa-solid fa-ellipsis-h"
  | "fa-solid fa-exclamation"
  | "fa-solid fa-exclamation-triangle"
  | "fa-solid fa-expand"
  | "fa-solid fa-external-link"
  | "fa-solid fa-eye"
  | "fa-solid fa-eye-slash"
  | "fa-solid fa-face-diagonal-mouth"
  | "fa-solid fa-face-dizzy"
  | "fa-solid fa-face-raised-eyebrow"
  | "fa-solid fa-face-smile"
  | "fa-solid fa-face-worried"
  | "fa-solid fa-feather-alt"
  | "fa-solid fa-feather-pointed"
  | "fa-solid fa-file-alt"
  | "fa-solid fa-file-clipboard"
  | "fa-solid fa-file-lines"
  | "fa-solid fa-file-text"
  | "fa-solid fa-film"
  | "fa-solid fa-fire"
  | "fa-solid fa-fist-raised"
  | "fa-solid fa-flag"
  | "fa-solid fa-folder-image"
  | "fa-solid fa-gauge-high"
  | "fa-solid fa-gear"
  | "fa-solid fa-gem"
  | "fa-solid fa-globe"
  | "fa-solid fa-hammer"
  | "fa-solid fa-hand-back-point-up"
  | "fa-solid fa-hand-fist"
  | "fa-solid fa-hand-holding-medical"
  | "fa-solid fa-hand-point-left"
  | "fa-solid fa-hand-wave"
  | "fa-solid fa-hands-clapping"
  | "fa-solid fa-hat-santa"
  | "fa-solid fa-hat-witch"
  | "fa-solid fa-heart"
  | "fa-solid fa-heart-music-camera-bolt"
  | "fa-solid fa-history"
  | "fa-solid fa-hourglass-clock"
  | "fa-solid fa-icons"
  | "fa-solid fa-image"
  | "fa-solid fa-image-slash"
  | "fa-solid fa-info-circle"
  | "fa-solid fa-joystick"
  | "fa-solid fa-layer-group"
  | "fa-solid fa-lightbulb"
  | "fa-solid fa-list"
  | "fa-solid fa-list-squares"
  | "fa-solid fa-location-check"
  | "fa-solid fa-location-xmark"
  | "fa-solid fa-lock"
  | "fa-solid fa-lock-open"
  | "fa-solid fa-magnifying-glass"
  | "fa-solid fa-male"
  | "fa-solid fa-map-marker-check"
  | "fa-solid fa-map-marker-times"
  | "fa-solid fa-map-marker-xmark"
  | "fa-solid fa-minus-square"
  | "fa-solid fa-mouse"
  | "fa-solid fa-music"
  | "fa-solid fa-navicon"
  | "fa-solid fa-palette"
  | "fa-solid fa-party-horn"
  | "fa-solid fa-paste"
  | "fa-solid fa-pen"
  | "fa-solid fa-pen-field"
  | "fa-solid fa-pen-to-square"
  | "fa-solid fa-person"
  | "fa-solid fa-person-arrow-down-to-line"
  | "fa-solid fa-person-arrow-up-from-line"
  | "fa-solid fa-person-falling-burst"
  | "fa-solid fa-person-military-pointing"
  | "fa-solid fa-planet-ringed"
  | "fa-solid fa-plus"
  | "fa-solid fa-plus-circle"
  | "fa-solid fa-power-off"
  | "fa-solid fa-recycle"
  | "fa-solid fa-redo-alt"
  | "fa-solid fa-refresh"
  | "fa-solid fa-right-from-bracket"
  | "fa-solid fa-rocket-launch"
  | "fa-solid fa-rotate-forward"
  | "fa-solid fa-rotate-right"
  | "fa-solid fa-scissors"
  | "fa-solid fa-search"
  | "fa-solid fa-shield"
  | "fa-solid fa-shield-alt"
  | "fa-solid fa-shield-blank"
  | "fa-solid fa-shield-halved"
  | "fa-solid fa-shirt"
  | "fa-solid fa-shopping-cart"
  | "fa-solid fa-sign-out-alt"
  | "fa-solid fa-smile"
  | "fa-solid fa-snowflake"
  | "fa-solid fa-square-dashed"
  | "fa-solid fa-square-minus"
  | "fa-solid fa-star"
  | "fa-solid fa-store"
  | "fa-solid fa-swords"
  | "fa-solid fa-sync"
  | "fa-solid fa-t-shirt"
  | "fa-solid fa-tachometer-alt"
  | "fa-solid fa-tachometer-alt-fast"
  | "fa-solid fa-terminal"
  | "fa-solid fa-trash-alt"
  | "fa-solid fa-trash-can"
  | "fa-solid fa-triangle-exclamation"
  | "fa-solid fa-trophy"
  | "fa-solid fa-tshirt"
  | "fa-solid fa-up-from-bracket"
  | "fa-solid fa-upload"
  | "fa-solid fa-user"
  | "fa-solid fa-user-astronaut"
  | "fa-solid fa-user-friends"
  | "fa-solid fa-user-group"
  | "fa-solid fa-user-group-crown"
  | "fa-solid fa-user-minus"
  | "fa-solid fa-user-plus"
  | "fa-solid fa-user-slash"
  | "fa-solid fa-user-unlock"
  | "fa-solid fa-users-crown"
  | "fa-solid fa-video"
  | "fa-solid fa-video-camera"
  | "fa-solid fa-volume"
  | "fa-solid fa-volume-down"
  | "fa-solid fa-volume-low"
  | "fa-solid fa-volume-medium"
  | "fa-solid fa-volume-slash"
  | "fa-solid fa-warning"
  | "fa-solid fa-wrench"
  | "fa-solid fa-x"
  | "fa-solid fa-zap";


declare type CustomKitIcon =
  | "fa-solid fa-kit fa-pants"
  | "fa-solid fa-kit fa-shoe";


declare type BrandIcon =
  | "fa-solid fa-brands fa-apple"
  | "fa-solid fa-brands fa-discord"
  | "fa-solid fa-brands fa-youtube";


declare type SimpleIconAlias =
;


declare type IconName =
  | IngameIconName
  | FontAwesomeIconName
  | CustomKitIcon
  | BrandIcon;

}
