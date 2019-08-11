const config = {
    // Bot own user ID
    "ownerID": "169974007800528896",

    // Array of bot admin user IDs
    "admins": [],

    // Array of bot support user IDs
    "support": [],

    "settings": {
        "prefix": "!",
        "modLogChannel": "607666810657177610",
        "logChannel": "607663844717887549",
        "systemNotice": true,
        "logEnabled": true
    },

    "defaults": {
        // Default single-line async awaitMessage function timeout
        "awaitMessageTimeout": 30000
    },

    "presence": {
        "game": {
            "name": "with your ❤",
            "type": 0
        },
        "status": "online"
    },

    // PERMISSION LEVEL DEFINITIONS.
    "permLevels": [
        {
            "level": 0,
            "name": "User",
            "check": (message) => {
                try {
                    if (message.member.roles.has(message.settings.prospectRole)) return false;
                    return true;
                } catch (err) {
                    return false;
                }
            }
        },
        {
            "level": 2,
            "name": "Moderator",
            "check": (message) => {
                try {
                    for (let i = 0; i < message.settings.officerRoles.length; i++) {
                        if (message.member.roles.has(message.settings.officerRoles[i])) return true;
                    }
                    return false;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            "level": 5,
            "name": "Administrator",
            "check": (message) => {
                try {
                    return (message.member.roles.has(message.settings.nationalRole));
                } catch (e) {
                    return false;
                }
            }
        },
        {
            "level": 6,
            "name": "Server Owner",
            "check": (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
        },
        {
            "level": 8,
            "name": "Bot Support",
            "check": (message) => config.support.includes(message.author.id)
        },
        {
            "level": 9,
            "name": "Bot Admin",
            "check": (message) => config.admins.includes(message.author.id)
        },
        {
            "level": 10,
            "name": "Bot Owner",
            "check": (message) => message.client.config.ownerID === message.author.id
        }
    ]
};

module.exports = config;
