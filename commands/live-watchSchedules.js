const preShowEmbed = require('./pre-showEmbed');
const repsSchema = require('./repsSchema/repsSchema');
const scheduleSch = require('./war&schedule&standings/scheduleSchema');

module.exports = {
    name: 'listwars',
    aliases: ['lw'],
    description: 'list all the scheduled wars in a particular division for a week',
    args: true,
    length: 2,
    category: 'representative',
    usage: 'divPrefix weekPrefix',
    missing: ['`divPrefix`, ', '`weekPrefix`'],
    explanation: 'wcl listwars CS WK1\n\nwhere CS - Champions division\nWK1 - Week 1',
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

        const week = {
            'WK1': 'WK1',
            'WK2': 'WK2',
            'WK3': 'WK3',
            'WK4': 'WK4',
            'WK5': 'WK5',
            'WK6': 'WK6',
            'WK7': 'WK7',
            'WK8': 'WK8',
            'WK9': 'WK9',
            'WK10': 'WK10',
            'WK11': 'WK11',
            'R128': 'R128',
            'R64': 'R64',
            'R32': 'R32',
            'WC': 'WC',
            'QF': 'QF',
            'SF': 'SF',
            'F': 'F',
        };

        const logo = {
            'HEAVY': 'https://cdn.discordapp.com/attachments/995764484218028112/995764719791112252/WCL_Heavy.png?width=539&height=612',
            'FLIGHT': 'https://cdn.discordapp.com/attachments/995764484218028112/995764818525044746/WCL_Flight.png?width=530&height=612',
            'ELITE': 'https://cdn.discordapp.com/attachments/995764484218028112/995765404565782609/WCL_ELITE.png?width=514&height=612',
            'BLOCKAGE': 'https://cdn.discordapp.com/attachments/995764484218028112/995765525001011310/WCL_Blockage-.png?width=435&height=613',
            'CHAMPIONS': 'https://cdn.discordapp.com/attachments/995764484218028112/995764652418023444/WCL_Champions.png?width=548&height=612',
            'LIGHT': 'https://cdn.discordapp.com/attachments/995764484218028112/995764946975596564/WCl_Light_Division-.png?width=548&height=612',
            'CLASSIC': 'https://cdn.discordapp.com/attachments/995764484218028112/995765980972195850/WCL_Classic-.png?width=548&height=612'
        };
        const color = {
            'HEAVY': '#008dff',
            'FLIGHT': '#3f1f8b',
            'ELITE': '#a40ae7',
            'BLOCKAGE': '#fc3902',
            'CHAMPIONS': '#ffb014',
            'CLASSIC': '#276cc1',
            'LIGHT': '#52d600'
        }

        const divPrefix = {
            'H': 'HEAVY',
            'F': 'FLIGHT',
            'E': 'ELITE',
            'B': 'BLOCKAGE',
            'CS': 'CHAMPIONS',
            'CL': 'CLASSIC',
            'L': 'LIGHT',
            'ME': 'RAJ',
        }

        if (!notForUseChannels.includes(message.channel.id)) {
            try {
                if (!divPrefix[args[0].toUpperCase()])
                    return message.reply(`Invalid division prefix **${args[0].toUpperCase()}**`);
                if (!week[args[1].toUpperCase()])
                    return message.reply(`Invalid week prefix **${args[1].toUpperCase()}**`);
                const findSchedules = await scheduleSch.find({ div: divPrefix[args[0].toUpperCase()], week: week[args[1].toUpperCase()] });
                const findReps = await repsSchema.find({ div: divPrefix[args[0].toUpperCase()] });
                if (findSchedules.length > 0) {
                    findSchedules.sort(function (a, b) {
                        return a.dow - b.dow;
                    });
                    const newSchedules = findSchedules.map(function (sch) {
                        const findTnameClan = findReps.find(function (rep) {
                            return rep.abb === sch.clan.abb
                        })
                        const findTnameOpponent = findReps.find(function (rep) {
                            return rep.abb === sch.opponent.abb
                        })
                        var newSch = {};
                        var clanName = ((findTnameClan.teamName === 'NONE') ? findTnameClan.clanName : findTnameClan.teamName)
                        var opponentName = ((findTnameOpponent.teamName === 'NONE') ? findTnameOpponent.clanName : findTnameOpponent.teamName)
                        newSch['warID'] = sch.warID;
                        newSch['clan'] = {
                            abb: sch.clan.abb,
                            name: clanName
                        }
                        newSch['opponent'] = {
                            abb: sch.opponent.abb,
                            name: opponentName
                        }
                        newSch['dow'] = `${sch.dow.toISOString().split('T')[0]}`;
                        newSch['tow'] = sch.tow;
                        newSch['status'] = sch.status;
                        return newSch;
                    })

                    preShowEmbed(message, args,
                        {
                            color: color[divPrefix[args[0].toUpperCase()]],
                            thumbnail: logo[divPrefix[args[0].toUpperCase()]],
                            wars: newSchedules
                        },
                        'listwars'
                    );
                } else {
                    preShowEmbed(message, args,
                        {
                            color: color[divPrefix[args[0].toUpperCase()]],
                            thumbnail: logo[divPrefix[args[0].toUpperCase()]],
                            wars: [
                                {
                                    warID: null,
                                    clan: {
                                        abb: null,
                                        name: 'NO WARS',
                                    },
                                    opponent: {
                                        abb: null,
                                        name: 'NO WARS',
                                    },
                                    dow: null,
                                    tow: null,
                                    status: null,
                                }
                            ]
                        },
                        'listwars'
                    );
                }
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        }
    }
}