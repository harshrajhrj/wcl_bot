const fetch = require('node-fetch');
const popUpEmbed = require('./pre-showEmbed');

module.exports = {
    name: 'roster',
    aliases: ['rs'],
    description: `Helps to see you a clan's roster`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl rs INQ',
    execute: async (message, args) => {
        const options = {
            'contentType': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true,
            // 'headers': { 'Accept': 'application/json', 'authorization': `Bearer ${token}`}
        };

        async function getPlayerDetail(tag) {
            const getData = await fetch(`https://api.clashofstats.com/players/${tag.slice(1)}`, options)
            if (getData.status === 404) {
                return { tag: tag, name: 'N/A', townHallLevel: -1 };
            }
            else if (getData.status === 500) {
                return { tag: tag, name: 'U/C', townHallLevel: -1 };
            }
            else if (getData.status === 200) {
                const freshData = await getData.json();
                return freshData;
            }
        }

        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {
            var abbCollection = require('./abbSchema/registeredAbbs');
            const division = await abbCollection.findOne({ abb: args[0].toUpperCase() });

            if (division) {
                var model;
                if (division.div === 'HEAVY')
                    model = require('./rosterSchemas/rosterSchemaHeavy');
                else if (division.div === 'FLIGHT')
                    model = require('./rosterSchemas/rosterSchemaFlight');
                else if (division.div === 'ELITE')
                    model = require('./rosterSchemas/rosterSchemaElite');
                else if (division.div === 'BLOCKAGE')
                    model = require('./rosterSchemas/rosterSchemaBlockage');
                else if (division.div === 'CHAMPIONS')
                    model = require('./rosterSchemas/rosterSchemaChampions');
                else if (division.div === 'CLASSIC')
                    model = require('./rosterSchemas/rosterSchemaClassic');
                else if (division.div === 'LIGHT')
                    model = require('./rosterSchemas/rosterSchemaLight');

                const rosterData = await model.find({ abb: args[0].toUpperCase() });

                var playerDetail = [];
                var townHalls = {
                    'th14': 0,
                    'th13': 0,
                    'th12': 0,
                    'th11': 0,
                    'th10': 0,
                    'less than 10': 0,
                }
                
                var uptoEnd = new Promise((resolve, reject) => {
                    rosterData[0].players.forEach(async data => {
                        let fetechedData = await getPlayerDetail(data[0]);
                        playerDetail.push([fetechedData.tag, fetechedData.townHallLevel, fetechedData.name]);
                        if (fetechedData.townHallLevel === 14)
                            townHalls['th14']++;
                        else if (fetechedData.townHallLevel === 13)
                            townHalls['th13']++;
                        else if (fetechedData.townHallLevel === 12)
                            townHalls['th12']++;
                        else if (fetechedData.townHallLevel === 11)
                            townHalls['th11']++;
                        else if (fetechedData.townHallLevel === 10)
                            townHalls['th10']++;
                        else if (fetechedData.townHallLevel < 10)
                            townHalls['less than 10']++;
                        if (rosterData[0].rosterSize === playerDetail.length) {
                            resolve(playerDetail);
                        }
                    })
                });
                uptoEnd.then(async (newData) => {
                    newData.sort(function (a, b) {
                        return b[1] - a[1];
                    })
                    let rs = '';

                    newData.forEach(data => {
                        if (!(data[0] === undefined)) {
                            rs += `${data[0].toString().padEnd(12, ' ')} ${(data[1].toString()).padEnd(2, ' ')} ${data[2].padEnd(15, ' ')}\n`;
                        }
                    });
                    popUpEmbed(message, args,
                        {
                            thumbnail: "https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612",
                            roster: rs,
                            townHalls: townHalls,
                            rosterSize: rosterData[0].rosterSize,
                            additionStatusLimit: rosterData[0].additionStatusLimit,
                            clanName: division.clanName
                        },
                        "roster"
                    )
                });
            }
            else {
                message.reply(`Clan abb **${args[0].toUpperCase()}** is invalid`);
            }
        } else {
            message.reply(`You can't use this command here!`);
        }
    }
}