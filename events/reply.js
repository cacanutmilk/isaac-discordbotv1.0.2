const cooldowns = new Map(); // Map to store cooldown timestamps per user

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        try {
            if (message.author.bot) return;

            // Check if message mentions the bot
            if (message.mentions.users.has(client.user.id)) {
                const userId = message.author.id;
                const now = Date.now();
                const cooldownAmount = 10 * 1000; // 10 seconds cooldown

                if (cooldowns.has(userId)) {
                    const expirationTime = cooldowns.get(userId) + cooldownAmount;
                    if (now < expirationTime) {
                        // User is still in cooldown, ignore mention
                        return;
                    }
                }

                // Not in cooldown or cooldown expired
                cooldowns.set(userId, now);

                // Send reply message
                return message.channel.send(
                    `Hello, ${message.author}!\n` +
                    `If you need help in the server, feel free to make a new ticket or ping a staff!\n` +
                    `But, please do not ping our owner, because most of the time, hes busy..!\n\n` +
                    `Have a nice day!`
                );
            }
        } catch (error) {
            console.error('Error in reply event:', error);
            message.channel.send('❌ Oops, something went wrong while responding to your message.');
        }
    }
};
