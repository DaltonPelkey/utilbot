const moment = require('moment-timezone');

exports.run = async (client, message, args, level) => {
    const joinedAt = message.member.joinedAt
    message.reply(`you joined this Discord server on **${moment(joinedAt).tz('America/New_York').format("dddd, MMMM Do YYYY, h:mm A")} EST**`)
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['joined', 'joinat', 'joinedon'],
    permLevel: "User"
};

exports.help = {
    name: "joinedat",
    category: "Miscelaneous",
    description: "Replies with the date you joined the current Discord server",
    usage: "joinedat"
};
