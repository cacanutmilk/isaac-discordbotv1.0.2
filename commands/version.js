const packageJson = require('../package.json');

module.exports = {
    name: 'version',
    description: 'Displays the current version of the bot.',

    async execute(message, args) {
        const version = packageJson.version || 'Unknown';
        const name = packageJson.name || 'Discord Bot';
        const author = packageJson.author || 'Unknown';

        const versionMessage = `🤖 **${name}**
**Version:** ${version}
**Author:** ${author}`;

        message.channel.send(versionMessage);
    }
};
