module.exports = {
    name: 'serverinfo',
    description: 'Displays basic information about the server.',

    async execute(message, args) {
        const { guild } = message;
        const owner = await guild.fetchOwner();

        const info = `📊 **Server Info**
**Name:** ${guild.name}
**Owner:** ${owner.user.tag}
**Members:** ${guild.memberCount}`;

        message.channel.send(info);
    }
};
