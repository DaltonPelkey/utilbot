module.exports = async (client, message) => {
    if (message.author.bot) return;

    // Check if bot can send messages
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return;

    const settings = message.settings = client.config.settings;

    // Return guild prefix if bot is mentioned without message
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${settings.prefix}\``).catch(client.logger.error);
    }

    const prefix = message.content[0];
    if (prefix !== settings.prefix) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Get guild member's permission level
    const level = client.permlevel(message);

    // Check whether the command or alias of the command exist
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // Ignore the command silently if it doesn't exist
    if (!cmd) return;

    if (cmd.conf.permissions && !message.guild.me.permissions.has(cmd.conf.permissions))
        return message.reply(`I can not perform this command... I require the following permissions in order to do this: ${cmd.conf.permissions.join(', ')}`);

    // Check if command can be used in DMs
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.reply("This command is unavailable via private message. Please run this command in a guild.").catch(client.logger.error);

    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === true) {
            return message.reply(`You do not have permission to use this command.`).catch(client.logger.error);
        } else {
            return;
        }
    }

    // Set permission level in author object
    message.author.permLevel = level;

    // Collect flags (if any) into message object
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
    }

    // Log and Run command after all checks
    client.logger.cmd(`${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
    try {
        cmd.run(client, message, args, level, prefix);
    } catch (err) {
        client.logger.error(err);
        message.reply('Uh oh... Something broke and I can not do this right now, sorry!').catch(client.logger.error);
    }
};
