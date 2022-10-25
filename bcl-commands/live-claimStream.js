const repsSchema = require("./repsSchema/repsSchema");
const scheduleSchema = require("./war&schedule&standings/scheduleSchema");

module.exports = {
    name: 'claim',
    aliases: ['claim'],
    description: 'Allows you to claim a war for streaming',
    args: true,
    length: 1,
    category: 'representative',
    missing: ['`warID`, ', '`streamLink[optional]`'],
    usage: 'warID',
    explanation: `Ex : bcl claim 1001 https://twitch.tv/..\n\nwhere 1001 is your warID!\nOptional - Stream link`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        if (!notForUseChannels.includes(message.channel.id)) {
            try {
                const schedule = await scheduleSchema.findOne({ warID: parseInt(args[0].toUpperCase(), 10) });
                if (schedule) {
                    if (schedule.streamer != 'NONE') {
                        const getArr = schedule.streamer;
                        if (getArr.find(function (streams) {
                            return streams.id === message.author.id;
                        }))
                            return message.reply(`You've already claimed this war!`);

                        getArr.push({
                            id: message.author.id,
                            username: message.author.username,
                            link: args.length > 0 ? args[1] : null
                        })
                        schedule.streamer = getArr;
                    } else {
                        const getArr = [];
                        getArr.push({
                            id: message.author.id,
                            username: message.author.username,
                            link: args.length > 0 ? args[1] : null
                        })
                        schedule.streamer = getArr;
                    }
                    const clanRep = await repsSchema.findOne({ abb: schedule.clan.abb });
                    const opponentRep = await repsSchema.findOne({ abb: schedule.opponent.abb });
                    await schedule.save();
                    await message.react('✅');
                    return message.reply(`Successfully claimed\n**${clanRep.teamName === 'NONE' ? clanRep.clanName : clanRep.teamName}** vs **${opponentRep.teamName === 'NONE' ? opponentRep.clanName : opponentRep.teamName}**\n${schedule.dow.toISOString().split('T')[0]} | ${schedule.tow}`);
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