const individualWarRecord = require("./war&schedule&standings/individualWarRecord");

module.exports = {
    name: 'forceresult',
    aliases: ['forceres'],
    description: 'Results a war with force W/L/T!',
    args: true,
    length: 3,
    category: "admins",
    usage: 'week_no clanAbb opponentAbb',
    missing: ['`week_no`, ', '`clanAbb`, ', '`opponentAbb`'],
    explanation: `Ex: bcl forceres wk1 ABC DEF\n\nDecides a W/L/T for one of the team`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        const resources = require('../bclutility/resourcesUtils');
        const week = resources.WEEK_ABBS;

        if (!notForUseChannels.includes(message.channel.id) && (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES'))) {
            try {
                const individualWarRecordIS = await individualWarRecord.find({ abb: { $in: [args[1].toUpperCase(), args[2].toUpperCase()] } });
                if (individualWarRecordIS.length === 2) {
                    if (week[args[0].toUpperCase()]) {
                        if (individualWarRecordIS[0].opponent[args[0].toUpperCase()].starFor > individualWarRecordIS[1].opponent[args[0].toUpperCase()].starFor) {
                            individualWarRecordIS[0].opponent[args[0].toUpperCase()].status = 'W';
                            individualWarRecordIS[1].opponent[args[0].toUpperCase()].status = 'L';
                        } else if (individualWarRecordIS[0].opponent[args[0].toUpperCase()].starFor < individualWarRecordIS[1].opponent[args[0].toUpperCase()].starFor) {
                            individualWarRecordIS[0].opponent[args[0].toUpperCase()].status = 'L';
                            individualWarRecordIS[1].opponent[args[0].toUpperCase()].status = 'W';
                        } else {
                            if (individualWarRecordIS[0].opponent[args[0].toUpperCase()].perDest > individualWarRecordIS[1].opponent[args[0].toUpperCase()].perDest) {
                                individualWarRecordIS[0].opponent[args[0].toUpperCase()].status = 'W';
                                individualWarRecordIS[1].opponent[args[0].toUpperCase()].status = 'L';
                            } else if (individualWarRecordIS[0].opponent[args[0].toUpperCase()].perDest < individualWarRecordIS[1].opponent[args[0].toUpperCase()].perDest) {
                                individualWarRecordIS[0].opponent[args[0].toUpperCase()].status = 'L';
                                individualWarRecordIS[1].opponent[args[0].toUpperCase()].status = 'W';
                            } else {
                                individualWarRecordIS[0].opponent[args[0].toUpperCase()].status = 'T';
                                individualWarRecordIS[1].opponent[args[0].toUpperCase()].status = 'T';
                            }
                        }
                        await individualWarRecordIS[0].markModified('opponent');
                        await individualWarRecordIS[1].markModified('opponent');
                        await individualWarRecordIS[0].save();
                        await individualWarRecordIS[1].save();
                        await message.react('✅');
                        return message.reply(`Successfully resulted\n` + "```" + individualWarRecordIS[0].abb + " -> " + individualWarRecordIS[0].opponent[args[0].toUpperCase()].status + "\n" + individualWarRecordIS[1].abb + " -> " + individualWarRecordIS[1].opponent[args[0].toUpperCase()].status + "```");
                    } else {
                        return message.reply(`WarID/Week : **${args[0].toUpperCase()}** doesn't exists!`);
                    }
                } else {
                    return message.reply(`One of the mentioned abb doesn't exist or both!`);
                }
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}