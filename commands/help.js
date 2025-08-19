module.exports = {
    name: 'help',
    description: 'Shows a list of commands based on your role.',

    async execute(message, args) {
        const allowedChannels = ['🤖│bot-commands', '🏴│staff-chat', '🏴│cmds'];

        if (!allowedChannels.includes(message.channel.name)) {
            return message.channel.send("You can only type help command in 🤖│bot-commands!");
        }

        const roles = message.member.roles.cache.map(role => role.name);
        const hasRole = (role) => roles.includes(role);

        let helpText = `📬 **Help Menu for ${message.author.tag}**\n`;

        // Fish + higher
        if (hasRole('Fish') || hasRole('Staff') || hasRole('Management Fish') || hasRole('Community Holder') || hasRole('Goldfish')) {
            helpText += `
🐟 **Basic Commands**:
- \`ping\` - Ping command!
- \`serverinfo\` - Displays basic information about the server.
- \`version\` - Displays the current version of the bot.
- \`youtube\` - Ooferguide's social!
`;
        }

        // Staff + higher
        if (hasRole('Staff') || hasRole('Management Fish') || hasRole('Community Holder') || hasRole('Goldfish')) {
            helpText += `
🛠️ **Staff Commands**:
- \`warn\` - Warns a user.  
  Format: \`-warn @username reason\`

- \`warnings\` - Shows a user's warnings.  
  Format: \`-warnings @username\`

- \`removewarn\` - Removes a specific warning from a user.  
  Format: \`-removewarn @username warning_id\`

- \`clearwarns\` - Clears all warnings from a user.  
  Format: \`-clearwarns @username\`

- \`kick\` - Kicks a member from the server.  
  Format: \`-kick @username\`

- \`ban\` - Bans a user with time and reason.  
  Format: \`-ban @username time reason\` (for permanent: use \`perm\`)

- \`unban\` - Unbans a user via their user ID.  
  Format: \`-unban userID reason\`

- \`clear\` - Clear messages!  
  Format: \`-clear messageCount\` (limit: 100)

- \`noteadd\` - Adds a note to a user.  
  Format: \`-noteadd @username note\`

- \`notes\` - Shows all notes for a user.  
  Format: \`-notes @username\`

- \`delnote\` - Deletes a specific note from a user by note number.  
  Format: \`-delnote @username note_id\`

- \`say\` - Makes the bot repeat your message.  
  Format: \`-say message\` or \`-say #channel message\`
`;
        }

        // Management level
        if (hasRole('Management Fish') || hasRole('Community Holder') || hasRole('Goldfish')) {
            helpText += `
🔐 **Management Commands**:
- \`lockchannel\` - Locks the current channel to prevent everyone from sending messages.  
  Format: \`-lockchannel reason\`

- \`unlockchannel\` - Unlocks the current channel, allowing everyone to send messages.  
  Format: \`-unlockchannel reason\`
`;
        }

        try {
            const reply = await message.reply(helpText);
            setTimeout(() => {
                reply.delete().catch(() => {});
            }, 30000); // Delete after 30 seconds
        } catch (err) {
            console.error('Error sending help message:', err);
            message.channel.send("⚠️ Couldn't send help info.");
        }
    }
};
