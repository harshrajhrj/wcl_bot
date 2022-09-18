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
    explanation: `Ex : wcl claim 1001 https://twitch.tv/..\n\nwhere 1001 is your warID!\nOptional - Stream link`,
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