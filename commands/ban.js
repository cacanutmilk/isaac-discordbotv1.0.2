const fs = require('fs');
const path = require('path');
const ms = require('ms');

const casesPath = path.join(__dirname, '..', 'cases.json');

module.exports = {
    name: 'ban',
    description: "Bans a user with time and reason",

    async execute(message, args) {
        if (!message.member.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("Only Staff members can use this command!");
        }

        const member = message.mentions.users.first();
        if (!member) {
            return message.channel.send("Please mention a user to ban!");
        }

        const memberTarget = message.guild.members.cache.get(member.id);
        if (!memberTarget) {
            return message.channel.send("Couldn't find that user in this server.");
        }

        if (memberTarget.roles.cache.some(role => role.name === "Staff")) {
            return message.channel.send("You cannot ban a Staff member!");
        }

        const timeArg = args[1];
        const reason = args.slice(2).join(" ") || "No reason provided";

        if (!timeArg) {
            return message.channel.send("Please specify a ban duration (e.g. `10m`, `2h`, `1d`, or `perm`).");
        }

        let duration;
        if (timeArg.toLowerCase() === "perm") {
            duration = null;
        } else {
            duration = ms(timeArg);
            if (!duration) {
                return message.channel.send("Invalid time format. Use `10m`, `2h`, `1d`, etc.");
            }
        }

        // 🔢 Get and increment case number
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

        // Save new case number
        try {
            fs.writeFileSync(casesPath, JSON.stringify({ lastCase: caseNumber }, null, 2), 'utf8');
        } catch (err) {
            console.error('Error writing to cases.json:', err);
        }

        try {
            await member.send(`🚫 You have been banned from **${message.guild.name}**.\n**Reason:** ${reason}\n**Duration:** ${duration ? timeArg : "Permanent"}`);
            await memberTarget.ban({ reason });

            message.channel.send(`✅ **${member.tag}** has been banned. Reason: **${reason}**. Duration: **${duration ? timeArg : "Permanent"}**`);

            const logChannel = message.guild.channels.cache.find(ch => ch.name === '🏴│moderation-logs');
            const formattedDate = new Date().toUTCString();

            if (logChannel && logChannel.isTextBased()) {
                logChannel.send(`🚫 **Case #${caseNumber} | Ban**
**User:** ${member.tag} (${member.id})
**Moderator:** ${message.author.tag}
**Reason:** ${reason}
**Duration:** ${duration ? timeArg : "Permanent"}
**Date:** ${formattedDate}`);
            } else {
                console.warn("Moderation log channel not found.");
            }

            if (duration) {
                setTimeout(async () => {
                    try {
                        await message.guild.members.unban(member.id);
                        console.log(`✅ Automatically unbanned ${member.tag} after ${timeArg}`);
                        
                        // Log the unban
                        if (logChannel && logChannel.isTextBased()) {
                            logChannel.send(`🔓 **User Unbanned Automatically**
**User:** ${member.tag} (${member.id})
**Original Case:** #${caseNumber}
**Duration:** ${timeArg} expired.`);
                        }
                    } catch (err) {
                        console.error(`Failed to unban ${member.tag}:`, err);
                    }
                }, duration);
            }

        } catch (error) {
            console.error(error);
            message.channel.send("❌ I couldn't ban that member.");
        }
    }
}
