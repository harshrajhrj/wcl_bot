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
    explanation: 'Ex : bcl pwars F wk1\nwhere\nF - division_code\nwk1 is to filter all wars to get wk1 pending wars',
    execute: async (message, args) => {
        const resources = require('../bclutility/resourcesUtils');
        const divPrefix = resources.DIVISION_ABBS;
        const week = resources.WEEK_ABBS;
        const logo = resources.DIVISION_LOGO_URL;
        const color = resources.DIVISION_COLOR;
        const notForUseChannels = require('./live-notForUseChannels');

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
                    return message.reply(`No wars found for **${divPrefix[args[0].toUpperCase()]}** Division!\nMake sure you've inserted all the wars!\n` + "`bcl iwars` (cmd to insert wars)");
                }

                if (embeds.length === 0) { // if no week filter found
                    preShowEmbed(message, args, [{
                        color: '#f2961e',
                        thumbnail: 'https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612',
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