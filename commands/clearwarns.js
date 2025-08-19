const fs = require('fs');
const path = require('path');
const warningsPath = path.join(__dirname, '..', 'warnings.json');

module.exports = {
    name: 'clearwarns',
    description: "Clears all warnings from a user.",

    async execute(message, args) {
        try {
            if (!message.member.roles.cache.some(role => role.name === "Staff")) {
                return message.channel.send("Only Staff members can use this command!");
            }

            const user = message.mentions.users.first();
            if (!user) return message.channel.send("Please mention a user.");

            let warnings = {};
            if (fs.existsSync(warningsPath)) {
                const data = fs.readFileSync(warningsPath, 'utf8');
                warnings = JSON.parse(data);
            }

            if (!warnings[user.id] || warnings[user.id].length === 0) {
                return message.channel.send(`**${user.tag}** has no warnings.`);
            }

            delete warnings[user.id];
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2));

            message.channel.send(`🗑️ Cleared all warnings for **${user.tag}**.`);
        } catch (error) {
            console.error('Error in clearwarns command:', error);
            message.channel.send('❌ An error occurred while trying to clear warnings.');
        }
    }
};
