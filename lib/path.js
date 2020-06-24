/**
 * A collection of waypoints which can be traversed in order to reach a goal.
 * 
 * @property {Bot} bot - The bot walking on this path.
 * @property {Waypoint[]} waypoints - A list of waypoints which make up this path.
 * @property {number} index - The index of the next waypoint in the list.
 * @property {boolean} running - Whether or not this path is currently running.
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

        this.waypoints[this.index].update();

        if (this.waypoints[this.index].isFinished())
            this.index++;
    }
}

module.exports = Path;
