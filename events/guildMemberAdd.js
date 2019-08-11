const { RichEmbed } = require('discord.js');

module.exports = (client, member) => {
    const settings = client.config.settings;

    if (!settings.logEnabled) return;

    const response = new RichEmbed()
        .setColor([67, 221, 47])
        .setAuthor(`${member.displayName} joined`, member.user.avatarURL)
        .setTimestamp(new Date());
    const logChannel = member.guild.channels.get(settings.logChannel);
    if (logChannel) logChannel.send(response).catch(client.logger.error);
};
