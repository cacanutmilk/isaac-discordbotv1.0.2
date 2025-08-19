module.exports = {
    name: 'ping',
    description: "Ping command!",
    execute(message, args) {
        
    if (message.member && message.member.roles.cache.some(r => r.name === "Fish")) {
        message.channel.send('Pong!');
    } else {
        message.channel.send('You do not have the permission to use this command!');
    }
}
}

