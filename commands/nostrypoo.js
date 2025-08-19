module.exports = {
    name: 'nostrypoo',
    description: "easter egg 1",
    execute(message, args) {
        
    if (message.member && message.member.roles.cache.some(r => r.name === "Fish")) {
        message.channel.send('You are nostrypoo certified!!! Yay!');
    } else {
        message.channel.send('You are not nostrypoo certified >:(');
    }
}
}

