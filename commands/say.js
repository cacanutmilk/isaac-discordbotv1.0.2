module.exports = {
    name: 'say',
    description: 'Makes the bot repeat your message. Optionally target a specific channel.',

    async execute(message, args) {
        try {
            if (!message.member.roles.cache.some(role => role.name === "Staff")) {
                return await message.channel.send("Only Staff members can use this command!");
            }

            if (args.length === 0) {
                return await message.channel.send("Please provide a message to say.");
            }

            let targetChannel = message.mentions.channels.first();
            let textToSay;

            if (targetChannel) {
                textToSay = args.slice(1).join(" ");
                if (!targetChannel.isTextBased() || !targetChannel.permissionsFor(message.guild.me).has('SendMessages')) {
                    return await message.channel.send("I can't send messages in the specified channel.");
                }
            } else {
                targetChannel = message.channel;
                textToSay = args.join(" ");
            }

            if (!textToSay.trim()) {
                return await message.channel.send("Please provide a message to say.");
            }

            if (textToSay.includes("@everyone") || textToSay.includes("@here")) {
                return await message.channel.send("❌ You can't use `@everyone` or `@here` in a say command.");
            }

            await message.delete().catch(() => {});

            await targetChannel.send({
                content: textToSay,
                allowedMentions: {
                    parse: ['roles', 'users'],
                }
            });
        } catch (error) {
            console.error('Error in say command:', error);
            await message.channel.send("❌ Oops! Something went wrong while trying to say that.");
        }
    }
};
