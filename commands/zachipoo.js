
module.exports = {
    name: 'zachipoo',
    description: "zack",
    execute(message, args) {
        
    if (message.member && message.member.roles.cache.some(r => r.name === "Fish")) {
        message.channel.send('You are zachipoo certificatied!!! Yay!');
    } else {
        message.channel.send('You are not zachipoo certificatied >:(');
    }
}
}

