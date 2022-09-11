const preShowEmbed = require("./pre-showEmbed");
const individualWarRecord = require("./war&schedule&standings/individualWarRecord");

module.exports = {
    name: 'pendingwars',
    aliases: ['pendingwars', 'pwars'],
    description: 'List all the pending wars in a particular division',
    args: true,
    length: 2,
    category: 'representative',
    usage: 'div_code week_no',
    missing: ['`div_code`, ', '`week_no`'],
    explanation: 'Ex : wcl pwars F wk1\nwhere\nF - division_code\nwk1 is to filter all wars to get wk1 pending wars',
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
                if (!week[args[1].toUpperCase()])
                    return message.reply(`Invalid week prefix **${args[1].toUpperCase()}**!`);

                const pendingWars = await individualWarRecord.find({ div: divPrefix[args[0].toUpperCase()] });
                if (pendingWars.length > 0) {
                    pendingWars.forEach(war => {
                        for (const week in war.opponent) {
                            if (week === args[1].toUpperCase() && !['W', 'L', 'T'].includes(war.opponent[week].status) && war.opponent[week].starFor === 0 && war.opponent[week].abb != 'BYE') {
                                if (!embeds.find(function (val) { return val.clan === war.abb || val.clan === war.opponent[week].abb }))
                                    embeds.push({
                                        week: args[1].toUpperCase(),
                                        warID: war.opponent[week].warID,
                                        clan: war.abb,
                                        opponent: war.opponent[week].abb,
                                        status: 'PENDING',
                                        thumbnail: logo[args[0].toUpperCase()],
                                        color: color[args[0].toUpperCase()]
                                    })
                            }
                        }
                    })
                } else {
                    return message.reply(`No wars found for **${divPrefix[args[0].toUpperCase()]}** Division!\nMake sure you've inserted all the wars!\n` + "`wcl iwars` (cmd to insert wars)");
                }

                if (embeds.length === 0) { // if no week filter found
                    preShowEmbed(message, args, [{
                        color: '#128682',
                        thumbnail: 'https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612',
                        warID: 'NONE',
                        week: 'NONE',
                        clan: 'NONE',
                        opponent: 'NONE',
                        status: 'NO PENDING WARS FOUND'
                    }], 'pendingwars');
                    return;
                }
                preShowEmbed(message, args, embeds, 'pendingwars');
            } else {
                return message.reply(`You can't use this command here!`);
            }
        } catch (err) {
            console.log(err.message);
            return message.reply(`An error occured : ${err.message}`);
        }
    }
}