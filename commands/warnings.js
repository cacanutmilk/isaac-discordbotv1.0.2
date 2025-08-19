const fs = require('fs');
const path = require('path');
const warningsPath = path.join(__dirname, '..', 'warnings.json');

module.exports = {
    name: 'warnings',
    description: "Shows a user's warnings.",

    async execute(message, args) {
        try {
            if (!message.member.roles.cache.some(role => role.name === "Staff")) {
                return message.channel.send("Only Staff members can use this command!");
            }

            const user = message.mentions.users.first();
            if (!user) return message.channel.send("Please mention a user to view warnings.");

            let warnings = {};
            if (fs.existsSync(warningsPath)) {
                const data = fs.readFileSync(warningsPath, 'utf8');
                warnings = JSON.parse(data);
            }

            const userWarnings = warnings[user.id];
            if (!userWarnings || userWarnings.length === 0) {
                return message.channel.send(`✅ **${user.tag}** has no warnings.`);
            }

            let reply = `⚠️ Warnings for **${user.tag}**:\n\n`;
            userWarnings.forEach((warn, index) => {
                reply += `**${index + 1}.** ${warn.reason} - *by ${warn.warnedBy} on ${new Date(warn.date).toLocaleString()}*\n`;
            });

            message.channel.send(reply);
        } catch (error) {
            console.error('Error in warnings command:', error);
            message.channel.send('❌ An error occurred while trying to fetch warnings.');
        }
    }
};

