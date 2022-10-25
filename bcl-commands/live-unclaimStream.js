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
    explanation: `Ex : bcl unclaim 1001\n\nwhere 1001 is your warID!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        
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