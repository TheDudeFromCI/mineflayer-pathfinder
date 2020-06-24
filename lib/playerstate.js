/**
 * A data wrapper for storing information about a bots state.
 */
class PlayerState
{
    /**
     * Creates a new player state object, copying information from the bot.
     * 
     * @param {Bot} bot - The bot to reference.
     * @param {*} control
     */
    constructor(bot, control)
    {
        // Input / Outputs
        this.pos = bot.entity.position.clone();
        this.vel = bot.entity.velocity.clone();
        this.onGround = bot.entity.onGround;
        this.isInWater = bot.entity.isInWater;
        this.isInLava = bot.entity.isInLava;
        this.isInWeb = bot.entity.isInWeb;
        this.isCollidedHorizontally = bot.entity.isCollidedHorizontally;
        this.isCollidedVertically = bot.entity.isCollidedVertically;
        this.jumpTicks = bot.jumpTicks;
        this.jumpQueued = bot.jumpQueued;

        // Input only (not modified)
        this.yaw = bot.entity.yaw;
        this.control = control;
    }

    /**
     * Applies the state information in this container to the bot.
     * 
     * @param {Bot} bot - The bot
     */
    apply(bot)
    {
        bot.entity.position = this.pos;
        bot.entity.velocity = this.vel;
        bot.entity.onGround = this.onGround;
        bot.entity.isInWater = this.isInWater;
        bot.entity.isInLava = this.isInLava;
        bot.entity.isInWeb = this.isInWeb;
        bot.entity.isCollidedHorizontally = this.isCollidedHorizontally;
        bot.entity.isCollidedVertically = this.isCollidedVertically;
        bot.jumpTicks = this.jumpTicks;
        bot.jumpQueued = this.jumpQueued;
    }
}

module.exports = PlayerState;