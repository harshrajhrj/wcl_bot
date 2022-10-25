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
    explanation: 'Ex : bcl ffwars F\nwhere\nF - division code\n\nEx : bcl ffwars F wk1\nwhere\nwk1 is to filter all wars to get wk1 forfeit wars',
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
                var filterWeeks = Object.keys(week);
                if (args.length > 1)
                    filterWeeks = filterWeeks.filter(function (wk) {
                        return args.length > 1 && wk === args[1].toUpperCase();
                    })

                const forfeits = await scheduleSchema.find({ div: divPrefix[args[0].toUpperCase()], week: { $in: filterWeeks }, status: 'COMPLETED', 'clan.star': 0, 'opponent.star': 0 });

                if (forfeits.length === 0) { // if no week filter found
                    preShowEmbed(message, args, [{
                        color: '#f2961e',
                        thumbnail: 'https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612',
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
            } else {
                return message.reply(`You can't use this command here!`);
            }
        } catch (err) {
            console.log(err.message);
            return message.reply(`An error occured : ${err.message}`);
        }
    }
}