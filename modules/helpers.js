module.exports = (client) => {

    // Permission level function
    client.permlevel = message => {
        let permlvl = 0;

        const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    };

    // Single-line async awaitMessage function
    client.awaitReply = async (msg, question, limit = client.config.defaults.awaitMessageTimeout) => {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ["time"]
            });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };


    // Message sanitation function
    client.clean = async (client, text) => {
        if (text && text.constructor.name == "Promise")
            text = await text;
        if (typeof evaled !== "string")
            text = require("util").inspect(text, {
                depth: 1
            });

        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

        return text;
    };

    // Load command function
    client.loadCommand = (source) => {
        try {
            client.logger.log(`    Loading Command: ${source}`);
            const props = require(`../${source}`);
            if (props.init) {
                props.init(client);
            }
            props.path = `../${source}`;
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            client.logger.error(`Unable to load command ${source}: ${e}`);
            return 'Unable to load command';
        }
    };

    // Unload command function
    client.unloadCommand = async (commandName) => {
        let command;
        if (client.commands.has(commandName)) {
            command = client.commands.get(commandName);
        } else if (client.aliases.has(commandName)) {
            command = client.commands.get(client.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

        if (command.shutdown) {
            await command.shutdown(client);
        }
        const mod = require.cache[require.resolve(command.path)];
        delete require.cache[require.resolve(command.path)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            if (mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
        }
        return false;
    };

    // Reload command function
    client.reloadCommand = async (commandName) => {
        let command;
        if (client.commands.has(commandName)) {
            command = client.commands.get(commandName);
        } else if (client.aliases.has(commandName)) {
            command = client.commands.get(client.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

        // Unload command
        if (command.shutdown) {
            await command.shutdown(client);
        }
        const mod = require.cache[require.resolve(command.path)];
        delete require.cache[require.resolve(command.path)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            if (mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
        }

        try {
            client.logger.log(`Reloading Command: ${commandName}`);
            const props = require(command.path);
            if (props.init) {
                props.init(client);
            }
            props.path = command.path;
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            client.logger.error(`Unable to reload command ${commandName}: ${e}`);
            return 'Unable to load command';
        }
    };

    // String.toProperCase() E.x. "something to proper case".toProperCase() > "Something To Proper Case"
    Object.defineProperty(String.prototype, "toProperCase", {
        value: function () {
            return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }
    });

    // Array.random() E.x. [1, 2, 3, 4, 5].random() > 1, 2, 3, 4, or 5 will return
    Object.defineProperty(Array.prototype, "random", {
        value: function () {
            return this[Math.floor(Math.random() * this.length)];
        }
    });

    // Promisify client.wait for use with await
    client.wait = require("util").promisify(setTimeout);

    // Catch exceptions
    process.on("uncaughtException", (err) => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        client.logger.error(`Uncaught Exception: ${errorMsg}`);
        process.exit(1);
    });

    process.on("unhandledRejection", err => {
        // client.logger.error(`Unhandled Rejection: ${err}`);
        console.error(err);
    });
};
