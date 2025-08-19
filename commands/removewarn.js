const fs = require('fs');
const path = require('path');

const warningsPath = path.join(__dirname, '..', 'warnings.json');
const casesPath = path.join(__dirname, '..', 'cases.json');

module.exports = {
    name: 'removewarn',
    description: "Removes a specific warning from a user.",

    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("Only Staff members can use this command!");
        }

        const user = message.mentions.users.first();
        const index = parseInt(args[1]) - 1;

        if (!user) return message.channel.send("Please mention a user.");
        if (isNaN(index)) return message.channel.send("Please provide a valid warning number, to check warnings, please use -warnings command!");

        let warnings = {};
        if (fs.existsSync(warningsPath)) {
            try {
                warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
            } catch (err) {
                console.error('Error reading warnings.json:', err);
                return message.channel.send("⚠️ Failed to load warnings file.");
            }
        }

        const userWarnings = warnings[user.id];
        if (!userWarnings || userWarnings.length === 0) {
            return message.channel.send(`**${user.tag}** has no warnings.`);
        }

        if (index < 0 || index >= userWarnings.length) {
            return message.channel.send("⚠️ Warning number is out of range.");
        }

        const removed = userWarnings.splice(index, 1);
        warnings[user.id] = userWarnings;

        try {
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing warnings.json:', err);
            return message.channel.send("⚠️ Failed to save warnings file.");
        }

        let caseNumber = 1;
        if (fs.existsSync(casesPath)) {
            try {
                const data = fs.readFileSync(casesPath, 'utf8');
                const json = JSON.parse(data);
                caseNumber = json.lastCase + 1;
            } catch (err) {
                console.error('Error reading cases.json:', err);
            }
        }

        try {
            fs.writeFileSync(casesPath, JSON.stringify({ lastCase: caseNumber }, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing to cases.json:', err);
        }

        message.channel.send(`✅ Removed warning **${index + 1}** from **${user.tag}**.\nReason was: **${removed[0].reason}**`);

        const logChannel = message.guild.channels.cache.find(ch => ch.name === '🏴│moderation-logs');
        const formattedDate = new Date().toUTCString();

        if (logChannel && logChannel.isTextBased()) {
            logChannel.send(`❌ **Case #${caseNumber} | Warning Removed**
**User:** ${user.tag} (${user.id})
**Moderator:** ${message.author.tag}
**Removed Warning Reason:** ${removed[0].reason}
**Warning Number:** ${index + 1}
**Date:** ${formattedDate}`);
        } else {
            console.warn("Moderation log channel not found..!");
        }
    }
};
