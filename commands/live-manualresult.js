const individualWarRecord = require("./war&schedule&standings/individualWarRecord");
const scheduleSchema = require("./war&schedule&standings/scheduleSchema");

module.exports = {
    name: 'setresult',
    aliases: ['res'],
    description: 'Results a war manually!',
    args: true,
    length: 3,
    category: "admins",
    usage: 'warID clanAbb stars percent',
    missing: ['`warID`, ', '`clanAbb`, ', '`stars`, ', '`percent`'],
    explanation: `Ex: wcl res 1001 ABC 90 100\n\nForfeit a result\n    wcl res 1001 ABC -f\nwhere '-f' flag indicates that ABC forfeits and gets a lose!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]

        if (!notForUseChannels.includes(message.channel.id) && (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES'))) {
            try {
                const schedule = await scheduleSchema.findOne({ warID: args[0].toUpperCase() });
                if (schedule) {
                    if (schedule.clan.abb === args[1].toUpperCase()) {
                        if (args[2].toUpperCase() === '-F') { // if forfeit then change war result to both collection schedule and indwar
                            schedule.clan.star = 0;
                            schedule.clan.dest = 0;
                            schedule.opponent.star = 0;
                            schedule.opponent.dest = 0;
                            const indWarClan = await individualWarRecord.findOne({ abb: args[1].toUpperCase() });
                            for (const week in indWarClan.opponent) {
                                if (week === schedule.week) {
                                    indWarClan.opponent[week].status = 'L';
                                    indWarClan.opponent[week].starFor = 0;
                                    indWarClan.opponent[week].starAgainst = 0;
                                    indWarClan.opponent[week].perDest = 0;
                                }
                            }
                            await indWarClan.markModified('opponent');
                            const indWarOpponent = await individualWarRecord.findOne({ abb: schedule.opponent.abb });
                            for (const week in indWarOpponent.opponent) {
                                if (week === schedule.week) {
                                    indWarOpponent.opponent[week].status = 'W';
                                    indWarOpponent.opponent[week].starFor = 0;
                                    indWarOpponent.opponent[week].starAgainst = 0;
                                    indWarOpponent.opponent[week].perDest = 0;
                                }
                            }
                            await indWarOpponent.markModified('opponent');
                            await indWarClan.save()
                                .then((data) => console.log(data));
                            await indWarOpponent.save()
                                .then((data) => console.log(data));
                        } else {
                            schedule.clan.star = parseInt(args[2].toUpperCase(), 10);
                            schedule.clan.dest = parseInt(args[3].toUpperCase(), 10);
                        }
                        await schedule.save()
                            .then((data) => console.log(data));
                        await message.react('✅');
                        return message.reply(`Successfully resulted **${args[1].toUpperCase()}**\nStars - ${args[2].toUpperCase() === '-F' ? schedule.clan.star : schedule.clan.star}⭐\nDestruction - ${args[2].toUpperCase() === '-F' ? schedule.clan.dest : schedule.clan.dest}%\nResult - ${args[2].toUpperCase() === '-F' ? args[1].toUpperCase() + ' forfeits(lose)' : 'WILL BE UPDATED!'}`);
                    } else if (schedule.opponent.abb === args[1].toUpperCase()) {
                        if (args[2].toUpperCase() === '-F') { // if forfeit then change war result to both collection schedule and indwar
                            schedule.opponent.star = 0;
                            schedule.opponent.dest = 0;
                            schedule.clan.star = 0;
                            schedule.clan.dest = 0;
                            const indWarClan = await individualWarRecord.findOne({ abb: args[1].toUpperCase() });
                            for (const week in indWarClan.opponent) {
                                if (week === schedule.week) {
                                    indWarClan.opponent[week].status = 'L';
                                    indWarClan.opponent[week].starFor = 0;
                                    indWarClan.opponent[week].starAgainst = 0;
                                    indWarClan.opponent[week].perDest = 0;
                                }
                            }
                            await indWarClan.markModified('opponent');
                            const indWarOpponent = await individualWarRecord.findOne({ abb: schedule.clan.abb });
                            for (const week in indWarOpponent.opponent) {
                                if (week === schedule.week) {
                                    indWarOpponent.opponent[week].status = 'W';
                                    indWarOpponent.opponent[week].starFor = 0;
                                    indWarOpponent.opponent[week].starAgainst = 0;
                                    indWarOpponent.opponent[week].perDest = 0;
                                }
                            }
                            await indWarOpponent.markModified('opponent');
                            await indWarClan.save()
                                .then((data) => console.log(data));
                            await indWarOpponent.save()
                                .then((data) => console.log(data));
                        } else {
                            schedule.opponent.star = parseInt(args[2].toUpperCase(), 10);
                            schedule.opponent.dest = parseInt(args[3].toUpperCase(), 10);
                        }
                        await schedule.save()
                            .then((data) => console.log(data));
                        await message.react('✅');
                        return message.reply(`Successfully resulted **${args[1].toUpperCase()}**\nStars - ${args[2].toUpperCase() === '-F' ? schedule.opponent.star : schedule.opponent.star}⭐\nDestruction - ${args[2].toUpperCase() === '-F' ? schedule.opponent.dest : schedule.opponent.dest}%\nResult - ${args[2].toUpperCase() === '-F' ? args[1].toUpperCase() + ' forfeits(lose)' : 'WILL BE UPDATED!'}`);
                    } else {
                        return message.reply(`Abb : **${args[1].toUpperCase()}** doesn't exists in warID : **${args[0].toUpperCase()}**!`);
                    }
                } else {
                    return message.reply(`WarID : **${args[0].toUpperCase()}** doesn't exists!`);
                }
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        } else {
            message.reply(`You aren't allowed to use this command!`);
        }
    }
}