const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const prefixes = ['-', '!', '/', '?'];
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`Loaded event: ${event.name} (once: ${event.once})`);
}

const cooldowns = new Map();

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = prefixes.find(p => message.content.startsWith(p));
    if (!prefix) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const now = Date.now();
    const cooldownAmount = 3 * 1000;

    if (!cooldowns.has(message.author.id)) {
        cooldowns.set(message.author.id, now);
    } else {
        const expiration = cooldowns.get(message.author.id) + cooldownAmount;
        if (now < expiration) {
            const timeLeft = ((expiration - now) / 1000).toFixed(1);
            message.reply(`⏳ Please wait ${timeLeft}s before using another command.`)
                .then(msg => {
                    setTimeout(() => msg.delete().catch(() => {}), cooldownAmount);
                });
            return;
        } else {
            cooldowns.set(message.author.id, now);
        }
    }

    const command = client.commands.get(commandName);
    if (!command) {
        return message.reply("❌ This command doesn't exist!");
    }

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('⚠️ There was an error trying to execute that command!');
    }

require('./port');
});


client.login(process.env.TOKEN);

