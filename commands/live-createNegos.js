const repsSchema = require("./repsSchema/repsSchema");
const individualWarRecord = require("./war&schedule&standings/individualWarRecord");
const channelSchema = require("./negotiationSchema/channelSchema");

module.exports = {
    name: 'createnego',
    aliases: ['cn'],
    description: 'Create all negotiation rooms for a particular week inside a week category',
    args: true,
    length: 2,
    category: "admins",
    usage: 'divPrefix weekPrefix',
    missing: ['`divPrefix`, ', '`weekPrefix`'],
    explanation: `Ex: wcl createnego CS WK1\n\nwhere\nCS - Champions division and\nWK1 - Week 1`,
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

        const week = {
            'WK1': 'WK1',
            'WK2': 'WK2',
            'WK3': 'WK3',
            'WK4': 'WK4',
            'WK5': 'WK5',
            'WK6': 'WK6',
            'WK7': 'WK7',
            'WK8': 'WK8',
            'WK9': 'WK9',
            'WK10': 'WK10',
            'WK11': 'WK11',
            'R128': 'R128',
            'R64': 'R64',
            'R32': 'R32',
            'WC': 'WC',
            'WC2' : 'WC2',
            'QF': 'QF',
            'SF': 'SF',
            'F': 'F',
        };

        const divPrefix = {
            'H': 'HEAVY',
            'F': 'FLIGHT',
            'E': 'ELITE',
            'B': 'BLOCKAGE',
            'CS': 'CHAMPIONS',
            'CL': 'CLASSIC',
            'L': 'LIGHT',
            'ME': 'RAJ',
        }

        if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_GUILD') && (message.guild.id === '998948665383190659' || message.guild.id === '765523244332875776')) {
            try {
                if (week[args[1].toUpperCase()] && divPrefix[args[0].toUpperCase()] && divPrefix[args[0].toUpperCase()] === 'CHAMPIONS') {
                    const checkExistingCategory = await channelSchema.findOne({ div: divPrefix[args[0].toUpperCase()], week: week[args[1].toUpperCase()] })
                    if (checkExistingCategory)
                        return message.reply(`Negotiation channels are already created for ${divPrefix[args[0].toUpperCase()]} | ${week[args[1].toUpperCase()]}!`);
                    else {
                        let collectMatches = [];
                        const allmatches = await individualWarRecord.find({ div: divPrefix[args[0].toUpperCase()] });

                        for (const each of allmatches) {
                            if (Object.keys(each.opponent).includes(args[1].toUpperCase())) {
                                var checkForAlreadyMatch = collectMatches.find(match => (match.clan === each.abb && match.opponent === each.opponent[args[1].toUpperCase()].abb) || (match.clan === each.opponent[args[1].toUpperCase()].abb && match.opponent === each.abb))
                                if (!checkForAlreadyMatch) {
                                    collectMatches.push({ clan: each.abb, opponent: each.opponent[args[1].toUpperCase()].abb })
                                }
                            }
                        }

                        // test examples
                        // let id1 = '355820732489531395';
                        // let id2 = '602935588018061453';

                        // category permissions
                        let repesports = '1017903330128834631'; // perm to be denied in category channel
                        let wclstaff = '999581636331057212'; // perm to be allow in category channel [read, send, attach, embed]

                        var categoryID1;
                        var categoryID1Channels = [];
                        var categoryID2 = null;
                        var categoryID2Channels = [];

                        // category1 creation
                        let firstCreation = await message.guild.channels.create(`${week[args[1].toUpperCase()]} ${divPrefix[args[0].toUpperCase()]} NEGO(1)`, {
                            type: 'category',
                            position: 5,
                            permissionOverwrites: [
                                // {
                                //     id: '797059086511767573',
                                //     allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                                // },
                                {
                                    id: wclstaff,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                                },
                                {
                                    id: repesports,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: message.guild.id,
                                    deny: ['VIEW_CHANNEL'],
                                }]
                        })

                        // channel creation under category1
                        var i;

                        for (i = 0; i < ((collectMatches.length > 50) ? 50 : collectMatches.length); i++) {
                            var reps1 = await repsSchema.findOne({ abb: collectMatches[i].clan });
                            var reps2 = await repsSchema.findOne({ abb: collectMatches[i].opponent });
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
                                    id: wclstaff,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                                },
                                {
                                    id: repesports,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: message.guild.id,
                                    deny: ['VIEW_CHANNEL'],
                                })
                            let newChannel = await message.guild.channels.create(`${week[args[1].toUpperCase()]}_${collectMatches[i].clan}_vs_${collectMatches[i].opponent}`, {
                                type: 'text',
                                parent: firstCreation.id,
                                topic: `${args[1].toUpperCase()} | ${reps1.teamName === 'NONE' ? reps1.clanName : reps1.teamName} vs ${reps2.teamName === 'NONE' ? reps2.clanName : reps2.teamName}`,
                                permissionOverwrites: permissionOverwrites
                            });
                            message.guild.channels.cache.get(newChannel.id).send(`**Welcome to negotiation room!**\nWeek - ${args[1].toUpperCase()} | ${divPrefix[args[0].toUpperCase()]}\n${reps1.abb} vs ${reps2.abb}\n\n*Reps for this war*\n<@${reps1.rep1_dc}>\n<@${reps1.rep2_dc}>\n<@${reps2.rep1_dc}>\n<@${reps2.rep2_dc}>\n\nPlease tag an admin/mediation team if you need any help!`)
                            categoryID1Channels.push({ name: newChannel.name, id: newChannel.id });
                        }
                        categoryID1 = firstCreation.id;

                        // checking if category1 has got 50 channels or not
                        if (i === 50) {
                            // category2 creation
                            let secondCreation = await message.guild.channels.create(`${week[args[1].toUpperCase()]} ${divPrefix[args[0].toUpperCase()]} NEGO(2)`, {
                                type: 'category',
                                position: 5,
                                permissionOverwrites: [
                                    // {
                                    //     id: '797059086511767573',
                                    //     allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                                    // },
                                    {
                                        id: wclstaff,
                                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                                    },
                                    {
                                        id: repesports,
                                        deny: ['VIEW_CHANNEL'],
                                    },
                                    {
                                        id: message.guild.id,
                                        deny: ['VIEW_CHANNEL'],
                                    }]
                            })

                            // channel creation under category2
                            for (i = 50; i < collectMatches.length; i++) {
                                var reps1 = await repsSchema.findOne({ abb: collectMatches[i].clan });
                                var reps2 = await repsSchema.findOne({ abb: collectMatches[i].opponent });
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
                                        id: wclstaff,
                                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'],
                                    },
                                    {
                                        id: repesports,
                                        deny: ['VIEW_CHANNEL'],
                                    },
                                    {
                                        id: message.guild.id,
                                        deny: ['VIEW_CHANNEL'],
                                    })
                                let newChannel = await message.guild.channels.create(`${week[args[1].toUpperCase()]}_${collectMatches[i].clan}_vs_${collectMatches[i].opponent}`, {
                                    type: 'text',
                                    parent: secondCreation.id,
                                    topic: `${args[1].toUpperCase()} | ${reps1.teamName === 'NONE' ? reps1.clanName : reps1.teamName} vs ${reps2.teamName === 'NONE' ? reps2.clanName : reps2.teamName}`,
                                    permissionOverwrites: permissionOverwrites
                                });
                                message.guild.channels.cache.get(newChannel.id).send(`**Welcome to negotiation room!**\nWeek - ${args[1].toUpperCase()} | ${divPrefix[args[0].toUpperCase()]}\n${reps1.abb} vs ${reps2.abb}\n\n*Reps for this war*\n<@${reps1.rep1_dc}>\n<@${reps1.rep2_dc}>\n<@${reps2.rep1_dc}>\n<@${reps2.rep2_dc}>\n\nPlease tag an admin/mediation team if you need any help!`);
                                categoryID2Channels.push({ name: newChannel.name, id: newChannel.id });
                            }
                            categoryID2 = secondCreation.id;
                        }

                        if (categoryID2 != null) {
                            const newChannelObject = new channelSchema({
                                div: divPrefix[args[0].toUpperCase()],
                                week: week[args[1].toUpperCase()],
                                categoryID1: {
                                    id: categoryID1,
                                    channels: categoryID1Channels
                                },
                                categoryID2: {
                                    id: categoryID2,
                                    channels: categoryID2Channels
                                }
                            });

                            await newChannelObject.save();
                        } else {
                            const newChannelObject = new channelSchema({
                                div: divPrefix[args[0].toUpperCase()],
                                week: week[args[1].toUpperCase()],
                                categoryID1: {
                                    id: categoryID1,
                                    channels: categoryID1Channels
                                }
                            });

                            await newChannelObject.save();
                        }
                        await message.react('✅');
                        return message.reply(`Created **${collectMatches.length}** negotiation rooms for ${args[1].toUpperCase()} | ${divPrefix[args[0].toUpperCase()]}!`);
                    }
                } else {
                    return message.reply(`Invalid week/division prefix or maybe other division than Champions!\nPlease check again and try.`);
                }
            } catch (err) {
                console.log(err);
                message.reply(err.message);
            }
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}