exports.run = (client, message, args, level) => {
    if (args.length < 1) return message.reply("You have to give me a word or words to generate a robot image.");

    const term = 'https://robohash.org/' + args.join('+');

    message.channel.send({
        files: [{
            attachment: term,
            name: 'Robot.png'
        }]
    })
    .catch(client.logger.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "robo",
    category: "Miscelaneous",
    description: "Send a random robot image based on the keyword(s) provided",
    usage: "robo <term(s)>"
};
