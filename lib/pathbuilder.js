const Path = require('./path');
const { performance } = require('perf_hooks');
const Heap = require('heap');

/**
 * Converts a node into a waypoint.
 *
 * @param {*} node - The node to convert.
 *
 * @returns The waypoint
 */
function nodeToWaypoint(node)
{
    // TODO
    return null;
}

/**
 * Gets a list of all available neighbors from the given node.
 * 
 * @param {*} openSet - The set of nodes which are waiting to be explored.
 * @param {*} closedSet - The set of nodes which were already explored.
 * @param {*} node - The node.
 *
 * @returns A list of neighboring nodes.
 */
function getNeighbors(openSet, closedSet, movements, goal, node)
{
    const neighbors = movements.getNeighbors(node.pos);
    const finalList = [];

    nList:
    for (const n in neighbors)
    {
        n.floor = {
            x: Math.floor(n.x),
            y: Math.floor(n.y),
            z: Math.floor(n.z),
        };

        for (const o of closedSet)
            if (n.floor == o.floor)
                continue nList;

        for (const o of openSet)
            if (n.floor == o.floor)
            {
                finalList.push(o);
                continue nList;
            }

        n.h = goal.heuristic(neighborData);
        finalList.push(n);
    }

    // TODO Assign node g, defaulting to infinity if not already explored.

    return finalList;
}

/**
 * An object which is in charge of constructing a bot path between two points.
 * 
 * @property {Bot} bot - The bot this path builder is building the path for.
 * @property {Movements} movements - The movement configuration properties.
 * @property {Vec3} goal - The goal of the path builder.
 
 * @property {Path} path - The path being generated.
 * @property {Heap} open - A collection of nodes to explore.
 * @property {list} closed - A collection of nodes which have already been explored.
 * @property {boolean} complete - Whether or not this path has finished being built.
 */
class PathBuilder
{
    /**
     * Creates a new path builder.
     * 
     * @property {Bot} bot - The bot this path builder is building the path for.
     * @property {Movements} movements - The movement configuration properties.
     * @property {Goal} goal - The goal of the path builder.
     */
    constructor(bot, movements, goal)
    {
        this.bot = bot;
        this.start = bot.entity.position;
        this.movements = movements;
        this.goal = goal;

        this.path = new Path(bot);
        this.open = new Heap((a, b) => a.f - b.f);
        this.closed = [];
        this.complete = false;

        this.start.remainingBlocks = movements.countScaffoldingItems();
        this._addOpenPos(this.start, 0);
    }

    /**
     * An internal function that adds a new node to the open list.
     * 
     * @param {Vec3} position - The node position in world coordinates.
     * @param {number} g - The total cost to get to this position.
     */
    _addOpenPos(position, g)
    {
        const h = this.goal.heuristic(position);

        const floor = {
            x: Math.floor(position.x),
            y: Math.floor(position.y),
            z: Math.floor(position.z),
        };

        this._addOpenNode({
            pos: position,
            floor: floor,
            g: g,
            h: h,
            f: g + h,
        });
    }

    _addOpenNode(node)
    {
        for (const o of this.open.nodes)
        {
            if (node.floor == o.floor)
            {
                this.open.updateItem(node);
                return;
            }
        }

        this.open.push(node);
    }

    /**
     * Runs a single astar iteration. Does nothing if path is complete.
     * The complete property on this path builder is assigned to true if
     * the path is completed in this iteration.
     * 
     * If no path could be found, the path will remain empty after completing.
     */
    runIteration()
    {
        if (this.open.isEmpty())
        {
            this.complete = true;
            return;
        }

        const node = this.open.pop();

        if (this.goal.isEnd(node.pos))
        {
            this._constructPath(node);
            return true;
        }

        this.closed.add(node.pos);

        for (const neighbor in getNeighbors(this.open.nodes, this.closed, this.movements, this.goal, node))
        {
            const newG = node.g + neighbor.cost;
            if (neighbor.g === undefined || newG < neighbor.g)
            {
                neighbor.parent = node;
                neighbor.g = newG;
                neighbor.f = neighbor.g + neighbor.h;

                this._addOpenNode(neighbor);
            }
        }

        return false;
    }

    /**
     * An internal function that converts the set of nodes which make up the path and
     * pushes them into the path object.
     * 
     * @param {*} node - The goal node.
     */
    _constructPath(node)
    {
        const path = [];
        while (node.parent)
        {
            path.push(node.data);
            node = node.parent;
        }
        path = path.reverse();

        for (const n of path)
            this.path.addWaypoint(nodeToWaypoint(n));
    }

    /**
     * Runs as many iterations as possible within the given number of milliseconds. If
     * the path is completed or all available paths are exhausted before the time is up,
     * this function returns early.
     * 
     * @param {number} ms - The maximum number of milliseconds to run for.
     *
     * @see runIteration()
     */
    runForTime(ms)
    {
        const startTime = performance.now();
        while (performance.now() - startTime < ms)
        {
            const isDone = this.runIteration();

            if (isDone)
                break;
        }
    }
}

module.exports = PathBuilder;
