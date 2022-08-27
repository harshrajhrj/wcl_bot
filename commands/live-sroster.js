const fetch = require('node-fetch');
const popUpEmbed = require('./pre-showEmbed');
module.exports = {
    name: 'searchroster',
    aliases: ['search'],
    description: 'Searches a player in all available rosters',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'player_tag',
    missing: ['`player_tag`'],
    explanation: 'wcl search #PCV8JQR0V\n\nwhere #PCV8JQR0V - Player Tag',
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]
        const options = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };
        try {
            if (!notForUseChannels.includes(message.channel.id)) {
                var allRosters = [
                    "rosterSchemaChampions",
                    "rosterSchemaElite",
                    "rosterSchemaLight",
                    "rosterSchemaFlight",
                    "rosterSchemaClassic",
                    "rosterSchemaBlockage",
                    "rosterSchemaHeavy",
                ];
                var pTag = null;
                if (args[0].toUpperCase().charAt(0) === "#") {
                    const tags = await fetch(`https://api.clashofstats.com/players/${args[0].toUpperCase().slice(1)}`, options);
                    if (tags.status === 200) {
                        pTag = await tags.json();
                    }
                }
                if (pTag) {
                    var playerData = '';
                    for (var i = 0; i < allRosters.length; i++) {
                        var roster = require("./rosterSchemas/" + allRosters[i]);
                        var allrosters = await roster.find();
                        for (var j = 0; j < allrosters.length; j++) {
                            allrosters[j].players.forEach(player => {
                                if (player[0] === args[0].toUpperCase()) {
                                    playerData += (allrosters[j].abb).padEnd(4, ' ') + " " + (args[0].toUpperCase()).padEnd(12, ' ') + " " + (allrosters[j].div).padEnd(9, ' ') + " " + (pTag.name).padEnd(15, ' ') + '\n';
                                }
                            })
                        }
                    }
                    if (playerData === '') {
                        popUpEmbed(message, args,
                            "No clan found",
                            "searchRoster"
                        );
                    } else {
                        popUpEmbed(message, args,
                            playerData,
                            "searchRoster"
                        );
                    }
                } else {
                    message.reply(`No such player found ${args[0].toUpperCase()}!`);
                    return;
                }
            } else {
                message.reply(`You can't use this command here!`);
            }
        } catch (err) {
            message.reply("An error occured!\n```js\n" + err.message + "```");
        }
    }
}