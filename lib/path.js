/**
 * A collection of waypoints which can be traversed in order to reach a goal.
 * 
 * @property {Bot} bot - The bot walking on this path.
 * @property {Waypoint[]} waypoints - A list of waypoints which make up this path.
 * @property {number} index - The index of the next waypoint in the list.
 * @property {boolean} running - Whether or not this path is currently running.
 * @property {Waypoint} currentWaypoint - The currently active waypoint.
 */
class Path
{
    /**
     * Creates a new, empty path.
     */
    constructor(bot)
    {
        this.bot = bot;
        this.waypoints = [];
        this.index = 0;
        this.running = false;
    }

    /**
     * Adds a new waypoint to the end of this path.
     * @param {Waypoint} waypoint - The waypoint to add.
     */
    addWaypoint(waypoint)
    {
        this.waypoints.push(waypoint);
    }

    /**
     * Starts executing this path, if not already running.
     */
    start()
    {
        if (this.running)
            return;

        this.index = 0;
        this.tickListener = () => this.update();
        this.bot.on('physicTick', this.tickListener);
    }

    /**
     * Stops executing this path if it currently running.
     */
    end()
    {
        if (!this.running)
            return;

        if (this.currentWaypoint && this.currentWaypoint.isRunning)
            this.currentWaypoint.finish();

        this.running = false;
        this.index = 0;

        this.bot.removeListener('physicTick', this.tickListener);
        this.tickListener = undefined;
    }

    /**
     * An internal function which is called each tick, while the path is being executed.
     */
    update()
    {
        if (this.index === this.waypoints.length)
        {
            this.end();
            return;
        }

        if (!this.currentWaypoint.isRunning)
        {
            this.currentWaypoint.isRunning = true;
            this.currentWaypoint.start();
        }

        this.currentWaypoint.update();

        if (this.currentWaypoint.isFinished())
        {
            this.currentWaypoint.finish();
            this.currentWaypoint.isRunning = false;
            this.index++;
        }
    }

    /**
     * Gets the currently active waypoint.
     */
    get currentWaypoint()
    {
        if (this.waypoints.length === 0)
            return undefined;

        return this.waypoints[this.index];
    }

    /**
     * Checks if the given block position is within 3 blocks of this path.
     * 
     * @param {Vec3} pos - The block position.
     * 
     * @returns True if the block position is near this path. False otherwise.
     */
    isPositionNearPath(pos)
    {
        for (const wp in this.waypoints)
        {
            const dx = Math.abs(wp.x - pos.x);
            const dy = Math.abs(wp.y - pos.y);
            const dz = Math.abs(wp.z - pos.z);

            if (dx <= 3 && dy <= 3 && dz <= 3)
                return true;
        }

        return false;
    }
}

module.exports = Path;
