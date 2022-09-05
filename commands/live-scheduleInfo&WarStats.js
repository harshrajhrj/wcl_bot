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
    usage: 'warID',
    missing: ['`warID`'],
    explanation: 'Ex: wcl stats 1001',
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]

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

        async function checkClan(abb) {
            const abbs = await abbsSchema.findOne({ abb: abb });
            if (abbs.teamName === 'NONE')
                return [abbs.abb, abbs.clanTag, abbs.clanName];
            else
                return [abbs.abb, abbs.clanTag, abbs.teamName];
        }

        if (!notForUseChannels.includes(message.channel.id)) {
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
                                dow: `${warIDs1[i].dow}`,
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
                                dow: `${warIDs2[i].dow}`,
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
        } else {
            console.log(err.message);
            message.reply(err.message);
        }
    }
}