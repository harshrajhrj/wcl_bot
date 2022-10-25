const popUpEmbed = require('./pre-showEmbed');
const scheduleSchema = require('./war&schedule&standings/scheduleSchema');
const abbsSchema = require('./abbSchema/registeredAbbs');

module.exports = {
    name: 'schstats',
    aliases: ['stats'],
    description: `Helps to check scheduled wars and war stats`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: bcl stats ABC\nwhereABC is a clan abb',
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        const logo = {
            'CHAMPIONS': 'https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612',
        };
        const color = {
            'CHAMPIONS': '#f2961e',
        }

        async function checkClan(abb) {
            const abbs = await abbsSchema.findOne({ abb: abb });
            if (abbs.teamName === 'NONE')
                return [abbs.abb, abbs.clanTag, abbs.clanName];
            else
                return [abbs.abb, abbs.clanTag, abbs.teamName];
        }

        if (!notForUseChannels.includes(message.channel.id)) {
            try {
                var warIDs1 = await scheduleSchema.find({ 'clan.abb': args[0].toUpperCase() });
                var warIDs2 = await scheduleSchema.find({ 'opponent.abb': args[0].toUpperCase() });
                if (!warIDs1 || !warIDs2)
                    return message.reply(`Clan abb **${args[0].toUpperCase()}** doesn't exists!`);
                const schedules = [];
                if (warIDs1 && warIDs1.length > 0) {
                    for (var i = 0; i < warIDs1.length; i++) {
                        if (warIDs1[i]) {
                            const clan = await checkClan(warIDs1[i].clan.abb);
                            const opponent = await checkClan(warIDs1[i].opponent.abb);
                            schedules.push(
                                {
                                    color: color[warIDs1[i].div],
                                    warID: warIDs1[i].warID,
                                    thumbnail: logo[warIDs1[i].div],
                                    week: warIDs1[i].week,
                                    div: warIDs1[i].div,
                                    clan: `${clan[0]} | ${clan[1]} | ${clan[2]}`,
                                    opponent: `${opponent[0]} | ${opponent[1]} | ${opponent[2]}`,
                                    dow: `${warIDs1[i].dow.toISOString().split('T')[0]}`,
                                    tow: warIDs1[i].tow,
                                    duration: warIDs1[i].duration,
                                    scheduledBy: warIDs1[i].scheduledBy[0],
                                    approvedBy: warIDs1[i].approvedBy[0],
                                    clanStats: warIDs1[i].clan,
                                    opponentStats: warIDs1[i].opponent,
                                    status: warIDs1[i].status,
                                }
                            );
                        }
                    }
                }
                if (warIDs2 && warIDs2.length > 0) {
                    for (var i = 0; i < warIDs2.length; i++) {
                        if (warIDs2[i]) {
                            const clan = await checkClan(warIDs2[i].clan.abb);
                            const opponent = await checkClan(warIDs2[i].opponent.abb);
                            schedules.push(
                                {
                                    color: color[warIDs2[i].div],
                                    warID: warIDs2[i].warID,
                                    thumbnail: logo[warIDs2[i].div],
                                    week: warIDs2[i].week,
                                    div: warIDs2[i].div,
                                    clan: `${clan[0]} | ${clan[1]} | ${clan[2]}`,
                                    opponent: `${opponent[0]} | ${opponent[1]} | ${opponent[2]}`,
                                    dow: `${warIDs2[i].dow.toISOString().split('T')[0]}`,
                                    tow: warIDs2[i].tow,
                                    duration: warIDs2[i].duration,
                                    scheduledBy: warIDs2[i].scheduledBy[0],
                                    approvedBy: warIDs2[i].approvedBy[0],
                                    clanStats: warIDs2[i].clan,
                                    opponentStats: warIDs2[i].opponent,
                                    status: warIDs2[i].status,
                                }
                            );
                        }
                    }
                }
                if (schedules.length === 0)
                    return message.reply(`No wars scheduled for **${args[0].toUpperCase()}**!`)

                popUpEmbed(message, args,
                    {
                        embedArr: schedules
                    },
                    'stats'
                );
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}