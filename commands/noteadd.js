const fs = require('fs');
const path = require('path');

const notesPath = path.join(__dirname, '..', 'notes.json');

module.exports = {
    name: 'noteadd',
    description: "Adds a note to a user.",

    async execute(message, args) {
        try {
            if (!message.member.roles.cache.some(role => role.name === "Staff")) {
                return message.channel.send("Only Staff members can use this command!");
            }

            const user = message.mentions.users.first();
            if (!user) return message.channel.send("Please mention a user.");

            const noteText = args.slice(1).join(" ");
            if (!noteText) return message.channel.send("Please provide a note to add.");

            let notes = {};
            if (fs.existsSync(notesPath)) {
                const data = fs.readFileSync(notesPath, 'utf8');
                notes = JSON.parse(data);
            }

            if (!notes[user.id]) {
                notes[user.id] = [];
            }

            const now = new Date();
            const formattedUTC = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}-${String(now.getUTCDate()).padStart(2,'0')} ${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')} UTC`;

            notes[user.id].push({
                note: noteText,
                addedBy: message.author.tag,
                date: formattedUTC
            });

            fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));

            message.channel.send(`✅ Added note to **${user.tag}**.`);
        } catch (error) {
            console.error('Error in noteadd command:', error);
            message.channel.send('❌ An error occurred while trying to add the note.');
        }
    }
};

