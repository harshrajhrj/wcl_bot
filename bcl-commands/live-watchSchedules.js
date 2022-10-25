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
    usage: 'divPrefix weekPrefix streamLink',
    missing: ['`divPrefix`, ', '`weekPrefix`'],
    explanation: 'bcl listwars CS WK1\n\nwhere CS - Champions division\nWK1 - Week 1',
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        const resources = require('../bclutility/resourcesUtils');
        const divPrefix = resources.DIVISION_ABBS;
        const week = resources.WEEK_ABBS;
        const logo = resources.DIVISION_LOGO_URL;
        const color = resources.DIVISION_COLOR;

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
                        if (sch.streamer != 'NONE' && sch.streamer.length > 0) {
                            let stringLiteral = '';
                            sch.streamer.forEach(stmr => {
                                stringLiteral += `<:Twitch:796955949276987412><:YouTube:796955826089885726>${((stmr.link === null || stmr.link === undefined) ? stmr.username : `[${stmr.username}](${stmr.link.includes('https') ? stmr.link : 'https://' + stmr.link})`)} -> <@${stmr.id}>\n`
                            })
                            newSch['streams'] = stringLiteral;
                        } else {
                            newSch['streams'] = 'NONE';
                        }
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
                                    warID: 'NONE',
                                    clan: {
                                        abb: 'NONE',
                                        name: 'NO WARS',
                                    },
                                    opponent: {
                                        abb: 'NONE',
                                        name: 'NO WARS',
                                    },
                                    dow: 'NONE',
                                    tow: 'NONE',
                                    status: 'NONE',
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