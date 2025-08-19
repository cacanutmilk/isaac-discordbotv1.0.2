const fs = require('fs');
const path = require('path');

const casesPath = path.join(__dirname, '..', 'cases.json');

module.exports = {
    name: 'kick',
    description: "Kicks a member from the server.",

    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("Only Staff members can use this command!");
        }

        const member = message.mentions.users.first();
        if (!member) {
            return message.channel.send("Please mention a member to kick!");
        }

        const memberTarget = message.guild.members.cache.get(member.id);
        if (!memberTarget) {
            return message.channel.send("User not found in the server.");
        }

        if (memberTarget.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("You cannot kick a Staff member!");
        }

        const reason = args.slice(1).join(" ") || "No reason provided";

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

        try {
            await member.send(`🚪 You have been kicked from **${message.guild.name}**.\nReason: ${reason}`);

            await memberTarget.kick(reason);
            message.channel.send(`✅ **${member.tag}** has been kicked. Reason: **${reason}**`);

            const logChannel = message.guild.channels.cache.find(ch => ch.name === '🏴│moderation-logs');
            const formattedDate = new Date().toUTCString();

            if (logChannel && logChannel.isTextBased()) {
                logChannel.send(`🚪 **Case #${caseNumber} | Kick**
**User:** ${member.tag} (${member.id})
**Moderator:** ${message.author.tag}
**Reason:** ${reason}
**Date:** ${formattedDate}`);
            } else {
                console.warn("Moderation log channel not found!");
            }

        } catch (error) {
            console.error(error);
            message.channel.send("❌ I couldn't kick that member.");
        }
    }
};
