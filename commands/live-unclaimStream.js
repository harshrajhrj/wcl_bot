const repsSchema = require("./repsSchema/repsSchema");
const scheduleSchema = require("./war&schedule&standings/scheduleSchema");

module.exports = {
    name: 'unclaim',
    aliases: ['unclaim'],
    description: 'Allows you to unclaim a war for streaming',
    args: true,
    length: 1,
    category: 'representative',
    missing: ['`warID`'],
    usage: 'warID',
    explanation: `Ex : wcl unclaim 1001\n\nwhere 1001 is your warID!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294',
            '1018472654233149460',
            '1018472232403607604'
        ]
        if (!notForUseChannels.includes(message.channel.id)) {
            try {
                const schedule = await scheduleSchema.findOne({ warID: parseInt(args[0].toUpperCase(), 10) });
                if (schedule) {
                    if (schedule.streamer != 'NONE') {
                        var getArr = schedule.streamer;
                        if (getArr.find(function (streams) {
                            return streams.id === message.author.id;
                        })) {
                            getArr = getArr.filter(function (streams) {
                                return streams.id != message.author.id
                            })
                        } else
                            return message.reply(`You've not claimed this war!`);
                        if (getArr.length === 0)
                            schedule.streamer = 'NONE';
                        else
                            schedule.streamer = getArr;
                    } else {
                        return message.reply(`No streams claimed for this war!`);
                    }
                    const clanRep = await repsSchema.findOne({ abb: schedule.clan.abb });
                    const opponentRep = await repsSchema.findOne({ abb: schedule.opponent.abb });
                    await schedule.save();
                    await message.react('✅');
                    return message.reply(`Successfully unclaimed\n**${clanRep.teamName === 'NONE' ? clanRep.clanName : clanRep.teamName}** vs **${opponentRep.teamName === 'NONE' ? opponentRep.clanName : opponentRep.teamName}**\n${schedule.dow.toISOString().split('T')[0]} | ${schedule.tow}`);
                } else {
                    return message.reply(`Invalid warID : ${args[0].toUpperCase()}!`);
                }
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        } else {
            message.reply(`You can't use this command here!`);
        }
    }
}