const fs = require('fs');
const path = require('path');

const notesPath = path.join(__dirname, '..', 'notes.json');

module.exports = {
    name: 'notes',
    description: "Shows all notes for a user.",

    async execute(message, args) {
        try {
            if (!message.member.roles.cache.some(role => role.name === "Staff")) {
                return message.channel.send("Only Staff members can use this command!");
            }

            const user = message.mentions.users.first();
            if (!user) return message.channel.send("Please mention a user.");

            if (!fs.existsSync(notesPath)) {
                return message.channel.send(`${user.tag} has no notes.`);
            }

            const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
            const userNotes = notes[user.id];

            if (!userNotes || userNotes.length === 0) {
                return message.channel.send(`${user.tag} has no notes.`);
            }

            let reply = `📝 Notes for **${user.tag}**:\n`;
            userNotes.forEach((n, i) => {
                reply += `\n**${i + 1}.** ${n.note} (Added by: ${n.addedBy} on ${n.date})`;
            });

            message.channel.send(reply);
        } catch (error) {
            console.error('Error in notes command:', error);
            message.channel.send('❌ An error occurred while trying to fetch notes.');
        }
    }
};

