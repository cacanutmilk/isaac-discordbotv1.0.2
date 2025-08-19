module.exports = {
    name: 'youtube',
    description: "Ooferguide's social!",
    execute(message, args) {
        
    if (message.member && message.member.roles.cache.some(r => r.name === "Fish")) {
        message.channel.send('Ooferguide Youtube Social: https://www.youtube.com/@Goldfishiess');
    } else {
        message.channel.send('You do not have the permission to use this command!');
    }
}

}