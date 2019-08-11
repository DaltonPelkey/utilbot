const axios = require('axios');

exports.run = async (client, message, args, level) => {
    try {
        const result = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' } });
        message.reply(result.data.joke);
    } catch (err) {
        return message.reply("404... Joke not found!");
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['joke'],
    permLevel: "User"
};

exports.help = {
    name: "dadjoke",
    category: "Miscelaneous",
    description: "Replies with a random dad joke from icanhazdadjoke.com",
    usage: "dadjoke"
};
