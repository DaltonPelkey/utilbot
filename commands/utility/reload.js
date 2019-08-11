exports.run = async (client, message, args, level) => {
    if (!args || args.length < 1) return message.reply("Must provide a command to reload.");
    let response = await client.reloadCommand(args[0]);
    if (response) return message.reply(`Error Reloading: ${response}`);
    message.reply(`The command \`${args[0]}\` has been reloaded :thumbsup:`);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Bot Admin"
};

exports.help = {
    name: "reload",
    category: "System",
    description: "Reloads a command that\"s been modified.",
    usage: "reload <command>"
};
