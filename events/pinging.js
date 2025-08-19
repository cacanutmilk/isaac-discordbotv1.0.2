
module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        try {
            if (message.author.bot) return;

            const ownershipUserIds = [
                '1225855414936010864',
                '700341168927539230',
                '761949400557682719',
            ];

            const mentionedOwnership = ownershipUserIds.some(id =>
                message.mentions.users.has(id)
            );

            if (mentionedOwnership) {
                return message.channel.send(
                    `⚠️ Oops!\n` +
                    `It looks like you've pinged one of our **Owners**.\n` +
                    `If you need assistance, please create a ticket or ping a **staff member** instead.`
                );
            }

        } catch (error) {
            console.error('Error in pinging event:', error);
        }
    }
};
