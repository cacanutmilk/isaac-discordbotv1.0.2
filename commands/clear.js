module.exports = {
    name: 'clear',
    description: "Clear messages!",
    async execute(message, args) {
        try {
            if (message.member && message.member.roles.cache.some(r => r.name === "Staff")) {
                if (!args[0]) return message.reply("Please enter the amount of messages you want to delete!");
                if (isNaN(args[0])) return message.reply("Please enter a real number!");

                const amount = parseInt(args[0]);

                if (amount > 100) return message.reply("You cannot delete more than 100 messages!!");
                if (amount < 1) return message.reply("You must delete at least 1 message!");

                const messages = await message.channel.messages.fetch({ limit: amount });
                await message.channel.bulkDelete(messages);
            } else {
                message.channel.send('You do not have the permission to use this command!');
            }
        } catch (error) {
            console.error('Error in clear command:', error);
            message.channel.send('❌ An error occurred while trying to clear messages.');
        }
    }
};
