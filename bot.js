require('dotenv').config();

const Discord = require("discord.js");
const { readdirSync, lstatSync } = require('fs');
const { join } = require('path');
const client = new Discord.Client();

client.config = require("./config.js");
client.logger = require("./modules/logger");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

require("./modules/helpers")(client);

const init = async () => {

    //Load command files
    const modDirs = readdirSync('./commands')
        .map(name => join('./commands', name))
        .filter(source => lstatSync(source).isDirectory());
    client.logger.log(`Loading a total of ${modDirs.length} modules.`);
    console.log('');
    modDirs.forEach(f => {
        client.logger.log(`Loading module: ${f}`);
        const cmdFiles = readdirSync(f)
            .map(name => join(f, name))
            .filter(source => source.endsWith('.js'));
        cmdFiles.forEach(g => {
            client.loadCommand(g);
        });
        console.log('');
    });

    //Load event files
    const evtFiles = readdirSync("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client));
    });

    //Generate permission cache
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }

    client.login(process.env.DISCORD_SECRET);

};

init();
