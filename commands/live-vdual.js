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
    explanation: 'wcl vdual CS\n\nwhere CS - Champions\n\nPrefix\nH - Heavy Weight\nF - Flight\nCL - Classic\nL - Light Weight\nE - Elite\nB - Blockage\nCS - Champions(Esports)',
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294',
            '1018472654233149460',
            '1018472232403607604'
        ]
        
        const foptions = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };
        const options = {
            'H': 'Heavy',
            'F': 'Flight',
            'E': 'Elite',
            'B': 'Blockage',
            'CS': 'Champions',
            'CL': 'Classic',
            'L': 'Light'
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
                    message.reply(`You can't use this command here!`);
                }
            } catch (err) {
                message.reply("An error occured!\n```js\n" + err.message + "```");
            }
        } else {
            message.reply(`No such division exists for prefix ${args[0].toUpperCase()}!`);
        }
    }
}