const popUpEmbed = require('./pre-showEmbed');
const fetch = require('node-fetch');

module.exports = {
    name: 'viewdual',
    aliases: ['vdual'],
    description: 'Searches a player in all available rosters',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'div',
    missing: ['`division`'],
    explanation: 'bcl vdual CS\n\nwhere CS - Champions\n\nPrefix\nCS - Champions(Esports)',
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        const foptions = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };
        const options = {
            'CS': 'Champions',
        }

        if (options[args[0].toUpperCase()]) {
            try {
                if (!notForUseChannels.includes(message.channel.id)) {
                    message.channel.send(`Processing....Please wait, this may take a while ${message.author.username}.`)
                    const auxiliaryTable = [];
                    var duals = [];
                    const roster = require('./rosterSchemas/' + 'rosterSchema' + options[args[0].toUpperCase()]);
                    const allrosters = await roster.find();
                    allrosters.forEach(roster => {
                        roster.players.forEach(pl => {
                            auxiliaryTable.push([pl[0], roster.abb, roster.div, 1]);
                        })
                    })
                    auxiliaryTable.forEach(player => {
                        var count = 0;
                        auxiliaryTable.forEach(pl => {
                            if (player[0] === pl[0] && typeof val != 'object') {
                                duals.push([pl[0], pl[1], pl[2]]);
                                count++;
                            }
                        })
                        if (count === 1)
                            duals = duals.filter(val => !val.includes(player[0]));
                    })

                    // removing duplicate values
                    duals = duals.map(JSON.stringify);
                    duals = new Set(duals);
                    duals = Array.from(duals, JSON.parse);

                    // fetching player data
                    for (var i = 0; i < duals.length; i++) {
                        const pData = await fetch(`https://api.clashofstats.com/players/${duals[i][0].slice(1)}`, foptions);
                        if (pData.status === 200) {
                            const rawPData = await pData.json();
                            duals[i].push(rawPData.name);
                        } else {
                            duals[i].push('N/A');
                        }
                    }

                    // mapping clan names
                    const abbCollection = require('./abbSchema/registeredAbbs');
                    const allAbbs = await abbCollection.find({ div: options[args[0].toUpperCase()].toUpperCase() })
                    duals.forEach(dual => {
                        var abbData = allAbbs.find(function (abb) { return abb.abb === dual[1] });
                        dual.push(abbData.clanName);
                    })
                    let embedData = '';
                    duals.forEach(dual => {
                        embedData += dual[1].padEnd(4, ' ') + " " + dual[0].padEnd(12, ' ') + " " + dual[3].padEnd(15, ' ') + " \n" + dual[4].padEnd(15, ' ') + '\n\n';
                    })

                    if (embedData === '') {
                        popUpEmbed(message, args,
                            {
                                embeddata: "No dual found",
                                div: options[args[0].toUpperCase()]
                            },
                            "viewdual"
                        );
                    } else {
                        popUpEmbed(message, args,
                            {
                                embeddata: embedData,
                                div: options[args[0].toUpperCase()]
                            },
                            "viewdual"
                        );
                    }
                } else {
                    return message.reply(`You can't use this command here!`);
                }
            } catch (err) {
                message.reply("An error occured!\n```js\n" + err.message + "```");
            }
        } else {
            message.reply(`No such division exists for prefix ${args[0].toUpperCase()}!`);
        }
    }
}