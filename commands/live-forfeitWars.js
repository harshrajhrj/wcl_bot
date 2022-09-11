const preShowEmbed = require("./pre-showEmbed");
const scheduleSchema = require("./war&schedule&standings/scheduleSchema");

module.exports = {
    name: 'forfeitwars',
    aliases: ['forfeitwars', 'ffwars'],
    description: 'List all the forfeit wars in a particular division',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'div_code week_no[optional]',
    missing: ['`div_code`, ', '`week_no[optional]`'],
    explanation: 'Ex : wcl ffwars F\nwhere\nF - division code\n\nEx : wcl ffwars F wk1\nwhere\nwk1 is to filter all wars to get wk1 forfeit wars',
    execute: async (message, args) => {

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
            'H': 'https://cdn.discordapp.com/attachments/995764484218028112/995764719791112252/WCL_Heavy.png?width=539&height=612',
            'F': 'https://cdn.discordapp.com/attachments/995764484218028112/995764818525044746/WCL_Flight.png?width=530&height=612',
            'E': 'https://cdn.discordapp.com/attachments/995764484218028112/995765404565782609/WCL_ELITE.png?width=514&height=612',
            'B': 'https://cdn.discordapp.com/attachments/995764484218028112/995765525001011310/WCL_Blockage-.png?width=435&height=613',
            'CS': 'https://cdn.discordapp.com/attachments/995764484218028112/995764652418023444/WCL_Champions.png?width=548&height=612',
            'L': 'https://cdn.discordapp.com/attachments/995764484218028112/995764946975596564/WCl_Light_Division-.png?width=548&height=612',
            'CL': 'https://cdn.discordapp.com/attachments/995764484218028112/995765980972195850/WCL_Classic-.png?width=548&height=612'
        };

        const divPrefix = {
            'H': 'HEAVY',
            'F': 'FLIGHT',
            'E': 'ELITE',
            'B': 'BLOCKAGE',
            'CS': 'CHAMPIONS',
            'CL': 'CLASSIC',
            'L': 'LIGHT'
        }

        const color = {
            'H': '#008dff',
            'F': '#3f1f8b',
            'E': '#a40ae7',
            'B': '#fc3902',
            'CS': '#ffb014',
            'CL': '#276cc1',
            'L': '#52d600'
        }

        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294',
            '1018472654233149460',
            '1018472232403607604'
        ]

        try {
            if (!notForUseChannels.includes(message.channel.id)) {
                if (!divPrefix[args[0].toUpperCase()])
                    return message.reply(`Invalid division prefix **${args[0].toUpperCase()}**!`);

                var embeds = [];
                // selecting the wars
                var filterWeeks = Object.keys(week);
                if (args.length > 1)
                    filterWeeks = filterWeeks.filter(function (wk) {
                        return args.length > 1 && wk === args[1].toUpperCase();
                    })

                const forfeits = await scheduleSchema.find({ div: divPrefix[args[0].toUpperCase()], week: { $in: filterWeeks }, status: 'COMPLETED', 'clan.star': 0, 'opponent.star': 0 });

                if (forfeits.length === 0) { // if no week filter found
                    preShowEmbed(message, args, [{
                        color: '#128682',
                        thumbnail: 'https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612',
                        warID: 'NONE',
                        week: 'NONE',
                        clan: 'NONE',
                        opponent: 'NONE',
                        status: 'NO MATCH FOUND'
                    }], 'forfeitwars');
                    return;
                }

                forfeits.forEach(schedule => {
                    embeds.push({
                        week: schedule.week,
                        warID: schedule.warID,
                        clan: schedule.clan.abb,
                        opponent: schedule.opponent.abb,
                        status: 'COMPLETED/FORFEIT',
                        thumbnail: logo[args[0].toUpperCase()],
                        color: color[args[0].toUpperCase()]
                    });
                })
                preShowEmbed(message, args, embeds, 'forfeitwars');
            }
        } catch (err) {
            console.log(err.message);
            return message.reply(`An error occured : ${err.message}`);
        }
    }
}