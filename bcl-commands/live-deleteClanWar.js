const fs = require('fs');
const indWarSchema = require('./war&schedule&standings/individualWarRecord');
const Discord = require('discord.js');
const backUpIndWarRecordSchema = require('./war&schedule&standings/backUp');

module.exports = {
    name: 'deletewars',
    aliases: ['dwars'],
    description: 'Delete official wars',
    args: true,
    length: 1,
    category: "admins",
    usage: 'clan_abb',
    missing: ['`clan_abb`'],
    explanation: `Ex: bcl dwars clan_abb`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        function divCheck(ABB) {
            var ABBSobject = fs.readFileSync('./bcl-commands/abbs.json');
            var abbs = JSON.parse(ABBSobject);

            var div = [];
            abbs.values.forEach(abb => {
                if (abb[2] == ABB)
                    div.push(abb[0], abb[1], abb[2], abb[3]);
            })
            return div;
        }

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {
                var div = divCheck(args[0].toUpperCase());
                if (div.length === 0) {
                    message.reply(`Invalid clan abb **${args[0].toUpperCase()}**!`);
                    return;
                }
                const indWarRecord = await indWarSchema.findOne({ abb: args[0].toUpperCase() });
                if (indWarRecord) {
                    // confirmation
                    const confirmEmbed = new Discord.MessageEmbed()
                        .setColor('#f2961e')
                        .setAuthor('By BCL Technical')
                        .setTitle('Confirmation!!')
                        .setDescription(`Do you want to delete **${args[0].toUpperCase()}** and all wars corresponding to it?\n✅ - Yes\n❎ - No\n\nConfirm within 60 secs!!`)
                        .setFooter(`React within 60s`)
                        .setTimestamp()
                    var collect = await message.channel.send(confirmEmbed);
                    await collect.react('✅');
                    await collect.react('❎');
                    const filter = (reaction, user) => {
                        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    var collector = await collect.createReactionCollector(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    });
                    if (!(collector))
                        await collect.delete();
                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name === '✅') { // if confirmed
                            await collect.delete();

                            // storing indWar Record as backup
                            const backUpIndWarRecordSchemaData = new backUpIndWarRecordSchema({
                                type: 'INDWAR',
                                abb: args[0].toUpperCase(),
                                history: indWarRecord
                            })

                            await backUpIndWarRecordSchemaData.save()
                                .then((data) => console.log(data));

                            await indWarSchema.findOneAndDelete({ abb: args[0].toUpperCase() });

                            message.reply(`Successfully deleted abb **${args[0].toUpperCase()}** and its all records!`);

                        } else { // if rejected
                            await collect.delete();
                            message.reply(`Cancelled operation`);
                        }
                    })
                } else {
                    return message.reply(`No record exists for ${args[0].toUpperCase()}!`)
                }
            } else {
                return message.reply(`You can't use this command here!`);
            }
        } catch (err) {
            console.log(err.message);
            message.reply(err.message);
        }
    }
}