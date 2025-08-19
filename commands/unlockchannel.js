const fs = require('fs');
const path = require('path');
const { PermissionsBitField } = require('discord.js');

const casesPath = path.join(__dirname, '..', 'cases.json');

module.exports = {
    name: 'unlockchannel',
    description: "Unlocks the current channel, allowing everyone to send messages.",

    async execute(message, args) {
        if (
            !message.member.roles.cache.some(role => role.name === "Management Fish") &&
            !message.member.roles.cache.some(role => role.name === "Community Holder") &&
            !message.member.roles.cache.some(role => role.name === "Goldfish")
        ) {
            return message.channel.send("Only Management Fish, Community Holder, or Goldfish can use this command!");
        }

        const reason = args.join(" ") || "No reason provided";
        const everyoneRole = message.guild.roles.everyone;

        try {
            await message.channel.permissionOverwrites.edit(everyoneRole, { [PermissionsBitField.Flags.SendMessages]: null });

            message.channel.send(`🔓 Channel unlocked. Reason: ${reason}`);

            // Handle case number
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

            const now = new Date();
            const formattedUTC = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2,'0')}-${String(now.getUTCDate()).padStart(2,'0')} ${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}:${String(now.getUTCSeconds()).padStart(2,'0')} UTC`;

            const logChannel = message.guild.channels.cache.find(channel => channel.name === '🏴│moderation-logs');

            if (logChannel && logChannel.isTextBased()) {
                logChannel.send(`🔓 **Case #${caseNumber} | Channel Unlocked**
**Channel:** ${message.channel.name} (${message.channel.id})
**Moderator:** ${message.author.tag}
**Reason:** ${reason}
**Date:** ${formattedUTC}`);
            } else {
                console.warn('Moderation log channel not found!');
            }
        } catch (error) {
            console.error(error);
            message.channel.send("❌ Failed to unlock the channel.");
        }
    }
};
