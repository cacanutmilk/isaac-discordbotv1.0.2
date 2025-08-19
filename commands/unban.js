const fs = require('fs');
const path = require('path');

const casesPath = path.join(__dirname, '..', 'cases.json');

module.exports = {
    name: 'unban',
    description: "Unbans a user via their user ID.",

    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("Only Staff members can use this command!");
        }

        const userId = args[0];
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!userId) {
            return message.channel.send("Please enter a user ID to unban!");
        }

        try {
            const bannedUsers = await message.guild.bans.fetch();
            const bannedUser = bannedUsers.get(userId);

            if (!bannedUser) {
                return message.channel.send("That user isn't banned, or the user ID is incorrect!");
            }

            await message.guild.members.unban(userId, reason);
            message.channel.send(`✅ Successfully unbanned **${bannedUser.user.tag}**.\nReason: **${reason}**`);

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

            const logChannel = message.guild.channels.cache.find(ch => ch.name === '🏴│moderation-logs');
            const formattedDate = new Date().toUTCString();

            if (logChannel && logChannel.isTextBased()) {
                logChannel.send(`🔓 **Case #${caseNumber} | Unban**
**User:** ${bannedUser.user.tag} (${bannedUser.user.id})
**Moderator:** ${message.author.tag}
**Reason:** ${reason}
**Date:** ${formattedDate}`);
            } else {
                console.warn("Moderation log channel not found.");
            }

        } catch (error) {
            console.error("Error unbanning user:", error);
            message.channel.send("❌ Failed to unban the user. Please check the user ID and try again..!");
        }
    }
};
