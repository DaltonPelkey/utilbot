const axios = require('axios');

exports.run = async (client, message, [num], level) => {
    const comic = parseInt(num) || Math.floor(Math.random() * 2000) + 1; // Rough estimate of total number of comics from site
    try {
        const result = await axios.get(`http://xkcd.com/${comic}/info.0.json`);
        message.channel.send({
            files: [{
                attachment: result.data.img,
                name: 'Comic.png'
            }]
        });
    } catch (err) {
        return message.reply(`404.. Comic not found!`);
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "comic",
    category: "Miscelaneous",
    description: "Send a random comic from xkcd.com or specify a specific comic.",
    usage: "comic [comic #]"
};
