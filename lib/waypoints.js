/**
 * A singular point within a path which defines an action to take.
 * 
 * All classes extending this class should override the start(), update(),
 * finish(),  and isFinished() functions.
 * 
 * @property {number} x - The X position of this waypoint.
 * @property {number} y - The Y position of this waypoint.
 * @property {number} z - The Z position of this waypoint.
 * @property {Bot} bot - The bot which is walking on the path.
 * @property {boolean} isRunning - Whether or not this waypoint is currently running.
 */
class Waypoint
{
    /**
     * Creates a new waypoint for the given world coordinates.
     * 
     * @param {number} x - The world X position.
     * @param {number} y - The world Y position.
     * @param {number} z - The world Z position.
     * @param {Bot} bot - The bot which is walking on the path.
     */
    constructor(x, y, z, bot)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.bot = bot;
        this.isRunning = false;
    }

    /**
     * Called on the first tick this waypoint begins running.
     */
    start() { }

    /**
     * Called each tick this waypoint is active.
     */
    update() { }

    /**
     * Called on the tick this waypoint finishes running, after update. This
     * method is also called if the path is stopped execution for any reason.
     */
    finish() { }

    /**
     * Returns true if this waypoint has finished executing.
     */
    isFinished() { return true; }
}

/**
 * Moves the bot linearly to this point.
 */
class MoveWaypoint extends Waypoint
{
    /**
     * Creates a new movement waypoint for the given world coordinates.
     *
     * @param {number} x - The world X position.
     * @param {number} y - The world Y position.
     * @param {number} z - The world Z position.
     * @param {Bot} bot - The bot which is walking on the path.
     */
    constructor(x, y, z, bot)
    {
        super(x, y, z, bot);
    }

    start()
    {
        // TODO
    }

    update()
    {
        // TODO
    }

    finish()
    {
        // TODO
    }

    isFinished()
    {
        // TODO
    }
}

/**
 * Breaks a block of the given type at this location.
 */
class BreakBlockWaypoint extends Waypoint
{
    /**
     * Creates a new break block waypoint for the given world coordinates.
     *
     * @param {number} x - The world X position of the block to break.
     * @param {number} y - The world Y position of the block to break.
     * @param {number} z - The world Z position of the block to break.
     * @param {Bot} bot - The bot which is walking on the path.
     */
    constructor(x, y, z, bot)
    {
        super(x, y, z, bot);
    }

    start()
    {
        // TODO
    }

    update()
    {
        // TODO
    }

    finish()
    {
        this.bot.stopDigging();
    }

    isFinished()
    {
        // TODO
    }
}

/**
 * Places a block of the given type at this location.
 */
class PlaceBlockWaypoint extends Waypoint
{
    /**
     * Creates a new place block waypoint for the given world coordinates.
     *
     * @param {number} x - The world X position of the block to place.
     * @param {number} y - The world Y position of the block to place.
     * @param {number} z - The world Z position of the block to place.
     * @param {Bot} bot - The bot which is walking on the path.
     * @param {Item} item - The itemized block to place.
     */
    constructor(x, y, z, bot, item)
    {
        super(x, y, z, bot);
        this.item = item;
    }

    start()
    {
        // TODO
    }

    update()
    {
        // TODO
    }

    finish()
    {
        // TODO
    }

    isFinished()
    {
        // TODO
    }
}

module.exports = {
    Waypoint,
    MoveWaypoint,
    BreakBlockWaypoint,
    PlaceBlockWaypoint
};
