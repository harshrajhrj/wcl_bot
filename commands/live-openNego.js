const repsSchema = require("./repsSchema/repsSchema");

module.exports = {
    name: 'opennego',
    aliases: ['opnego'],
    description: 'Allows you to open a negotiation room in general',
    args: true,
    length: 2,
    category: 'representative',
    missing: ['`clanAbb`, ', '`opponentAbb`'],
    usage: 'warID',
    explanation: `Ex : wcl opennego ABC XYZ\n\nresults in #abc_vs_xyz`,
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
        const parent = '440206084024696832';

        if (!notForUseChannels.includes(message.channel.id) && message.guild.id === '389162246627917826') {
            try {
                const reps1 = await repsSchema.findOne({ abb: args[0].toUpperCase() });
                const reps2 = await repsSchema.findOne({ abb: args[1].toUpperCase() });
                if (reps1 && reps2) {
                    let permissionOverwrites = [];
                    if (message.guild.members.cache.find(user => user.id === reps1.rep1_dc))
                        permissionOverwrites.push({
                            id: reps1.rep1_dc,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                        })
                    if (message.guild.members.cache.find(user => user.id === reps1.rep2_dc))
                        permissionOverwrites.push({
                            id: reps1.rep2_dc,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                        })
                    if (message.guild.members.cache.find(user => user.id === reps2.rep1_dc))
                        permissionOverwrites.push({
                            id: reps2.rep1_dc,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                        })
                    if (message.guild.members.cache.find(user => user.id === reps2.rep2_dc))
                        permissionOverwrites.push({
                            id: reps2.rep2_dc,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                        })

                    permissionOverwrites.push(
                        {
                            id: '662545174609788938',
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                        },
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL'],
                        })
                    let createdChannel = await message.guild.channels.create(`#${args[0].toUpperCase()}_vs_${args[1].toUpperCase()}`, {
                        type: 'text',
                        parent: parent,
                        topic: `Mediation room`,
                        permissionOverwrites: permissionOverwrites
                    })
                    await message.react('✅');
                    return message.reply(`Created <#${createdChannel.id}>!`);
                } else {
                    return message.reply(`Invalid! Check the clan/opponent abb again.`);
                }
            } catch (err) {
                console.log(err.message);
                return message.reply(err.message);
            }
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}