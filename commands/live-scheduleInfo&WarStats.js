const popUpEmbed = require('./pre-showEmbed');
const scheduleSchema = require('./war&schedule&standings/scheduleSchema');

module.exports = {
    name: 'schstats',
    aliases: ['stats'],
    description: `Helps to check scheduled war and war stats`,
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

        if (!notForUseChannels.includes(message.channel.id)) {
            const warID = await scheduleSchema.findOne({ warID: args[0].toUpperCase() });
            if (warID) {
                popUpEmbed(message, args,
                    {
                        color: color[warID.div],
                        warID: warID.warID,
                        thumbnail: logo[warID.div],
                        week: warID.week,
                        div: warID.div,
                        clan: `${warID.clan.abb} | ${warID.clan.tag}`,
                        opponent: `${warID.opponent.abb} | ${warID.opponent.tag}`,
                        dow: `${warID.dow}`,
                        tow: warID.tow,
                        duration: warID.duration,
                        scheduledBy: warID.scheduledBy[0],
                        approvedBy: warID.approvedBy[0],
                        clanStats: warID.clan,
                        opponentStats: warID.opponent
                    },
                    'stats'
                );
            } else {
                message.reply(`WarID : ${args[0].toUpperCase()} doesn't exists!`);
            }
        } else {
            console.log(err.message);
            message.reply(err.message);
        }
    }
}