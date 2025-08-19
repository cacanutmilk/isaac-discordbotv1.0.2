const fs = require('fs').promises; // use promise version of fs
const path = require('path');

const notesPath = path.join(__dirname, '..', 'notes.json');

module.exports = {
    name: 'delnote',
    description: "Deletes a specific note from a user by note number.",

    async execute(message, args) {
        try {
            if (!message.member.roles.cache.some(role => role.name === "Staff")) {
                return await message.channel.send("Only Staff members can use this command!");
            }

            const user = message.mentions.users.first();
            if (!user) return await message.channel.send("Please mention a user.");

            const noteIndex = parseInt(args[1], 10) - 1;
            if (isNaN(noteIndex)) return await message.channel.send("Please provide a valid note number, use -notes to check the note id!");

            let notes = {};
            try {
                const data = await fs.readFile(notesPath, 'utf8');
                notes = JSON.parse(data);
            } catch {
                return await message.channel.send(`${user.tag} has no notes.`);
            }

            const userNotes = notes[user.id];
            if (!userNotes || userNotes.length === 0) {
                return await message.channel.send(`${user.tag} has no notes.`);
            }

            if (noteIndex < 0 || noteIndex >= userNotes.length) {
                return await message.channel.send("Note number out of range.");
            }

            const removedNote = userNotes.splice(noteIndex, 1);
            notes[user.id] = userNotes;

            await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));

            await message.channel.send(`✅ Removed note #${noteIndex + 1} from **${user.tag}**:\n${removedNote[0].note}`);
        } catch (error) {
            console.error('Error in delnote command:', error);
            await message.channel.send('❌ An error occurred while trying to delete the note.');
        }
    }
};

