const fs = require('fs');
const path = require('path');

const warningsPath = path.join(__dirname, '..', 'warnings.json');
const casesPath = path.join(__dirname, '..', 'cases.json');

module.exports = {
    name: 'warn',
    description: "Warns a user.",

    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("Only Staff members can use this command!");
        }

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ");

        if (!user) {
            return message.channel.send("Please mention a user to warn.");
        }

        if (!reason) {
            return message.channel.send("Please provide a reason for the warning.");
        }

        const memberToWarn = message.guild.members.cache.get(user.id);
        if (memberToWarn && memberToWarn.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("You cannot warn another Staff member.");
        }

        let warnings = {};

        if (fs.existsSync(warningsPath)) {
            try {
                const data = fs.readFileSync(warningsPath, 'utf8');
                warnings = JSON.parse(data);
            } catch (err) {
                console.error('Error reading warnings.json:', err);
                return message.channel.send("⚠️ Failed to load warnings file.");
            }
        }

        if (!warnings[user.id]) {
            warnings[user.id] = [];
        }

        const now = new Date();
        const formattedUTC = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`;

        const warningEntry = {
            reason: reason,
            date: formattedUTC,
            warnedBy: message.author.tag
        };

        warnings[user.id].push(warningEntry);

        try {
            fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing to warnings.json:', err);
            return message.channel.send("⚠️ Could not save warning.");
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

        message.channel.send(`⚠️ Warned **${user.tag}** for: **${reason}**`);

        const logChannel = message.guild.channels.cache.find(channel => channel.name === '🏴│moderation-logs');
        if (logChannel && logChannel.isTextBased()) {
            logChannel.send(`📄 **Case #${caseNumber} | Warning**
**User:** ${user.tag} (${user.id})
**Warned By:** ${message.author.tag}
**Reason:** ${reason}
**Date:** ${formattedUTC}`);
        } else {
            console.warn('Warning log channel not found!');
        }
    }
};