const repsSchema = require("./repsSchema/repsSchema");
const indvidualWarRecord = require("./war&schedule&standings/individualWarRecord");
const scheduleSchema = require("./war&schedule&standings/scheduleSchema");

module.exports = {
    name: 'deleteschedule',
    aliases: ['delsch'],
    description: 'Allows you to delete a scheduled war',
    args: true,
    length: 1,
    category: 'representative',
    missing: ['`warID`'],
    usage: 'warID',
    explanation: `Ex : wcl delschedule 1001\n\nwhere 1001 is a scheduled warID`,
    accessableby: ['Representative'],
    execute: async (message, args) => {
        var channelPermissions = [
            '1011618454735966268',
            '1011622480600903690',
            '1018472654233149460'
        ]

        // updating indWarRecord when schedule deleted
        async function updateIndWarRecord(abb, findSchedule) {
            const individualWarRecordData = await indvidualWarRecord.findOne({ abb: abb });
            if (individualWarRecordData) {
                for (const week in individualWarRecordData.opponent) {
                    if (week === findSchedule.week) {
                        individualWarRecordData.opponent[week].status = 'UNDECLARED';
                        individualWarRecordData.opponent[week].starFor = 0;
                        individualWarRecordData.opponent[week].starAgainst = 0;
                        individualWarRecordData.opponent[week].perDest = 0;
                        individualWarRecordData.opponent[week].warID = null;
                        individualWarRecordData.opponent[week].deleteHistory = findSchedule;
                    }
                }
                await individualWarRecordData.markModified("opponent");
                await individualWarRecordData.save()
                    .then((record) => console.log(record));
            }
        }

        // begins
        if (channelPermissions.includes(message.channel.id) || message.member.hasPermission('MANAGE_GUILD')) {
            const findSchedule = await scheduleSchema.findOne({ warID: parseInt(args[0].toUpperCase(), 10) })
            if (findSchedule) {
                const findReps = await repsSchema.find({ abb: { $in: [findSchedule.clan.abb, findSchedule.opponent.abb] } });
                var repArray = [];
                findReps.forEach(rep => {
                    repArray.push(rep.rep1_dc, rep.rep2_dc);
                })

                if (!repArray.includes(message.author.id) && !message.member.hasPermission('MANAGE_GUILD'))
                    return message.reply(`You're not authorized rep to delete the schedule of this war!`);
                else {
                    await scheduleSchema.findOneAndDelete({ warID: parseInt(args[0].toUpperCase(), 10) })
                    await updateIndWarRecord(findSchedule.clan.abb, findSchedule);
                    await updateIndWarRecord(findSchedule.opponent.abb, findSchedule);
                    message.reply(`Successfully deleted schedule!` + "```" + `${findSchedule.week} | ${findSchedule.div}\n\n${findSchedule.clan.abb} | ${findSchedule.clan.tag}\nvs\n${findSchedule.opponent.abb} | ${findSchedule.opponent.tag}` + "```")
                }
            } else {
                return message.reply(`No schedule exists with warID **${args[0].toUpperCase()}**!`)
            }
        } else {
            message.reply(`You can't use this command here!`);
        }
    }
}