const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'claninfo',
    aliases: ['cinfo', 'clan', 'reps'],
    description: 'Shows you the clan representatives for a bcl Clan',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'bcl reps clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: bcl reps INQ\nwhere INQ - clanAbb\n\nOptional\nUsing tr after putting clanAbb would help you to get the rep pinged!',
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        const resources = require('../bclutility/resourcesUtils');
        const logo = resources.DIVISION_LOGO_URL;
        const color = resources.DIVISION_COLOR;
        const match = {
            'CHAMPIONS' : 'CS'
        }

        if (!notForUseChannels.includes(message.channel.id)) {
            var repSchema = require('./repsSchema/repsSchema');
            var ABBSobject = fs.readFileSync('./bcl-commands/abbs.json');
            var abbObject = JSON.parse(ABBSobject);

            let division = '';
            var clanAbb = '';
            abbObject.values.forEach(data => {
                if (args[0].toUpperCase() === data[2]) {
                    division = data[3];
                    clanAbb = data[2];
                }
            });

            if (division === '') {
                return message.reply(`Invalid clan abb ${args[0].toUpperCase()}!`);
            }

            var findRepList = await repSchema.findOne({ abb: clanAbb });
            if (args.length === 1) {
                if (findRepList) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(color[match[division]])
                        .setThumbnail(logo[match[division]])
                        .setAuthor('BCL TECHNICAL', 'https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612')
                        .setTitle(`*Clan Info of ${findRepList.teamName === 'NONE' ? findRepList.clanName : findRepList.teamName}*`)
                        .addField(`Team name:male_sign:`, findRepList.teamName === 'NONE' ? findRepList.clanName : findRepList.teamName)
                        .addField('Clan name<:cc:944312115643166720>', findRepList.clanName)
                        .addField('Clan tag:hash:', `[${findRepList.clanTag}](https://link.clashofclans.com/?action=OpenClanProfile&tag=%23${findRepList.clanTag.slice(1)})`)
                        .addField('Secondary clan tag:hash:', `[${findRepList.secondaryClanTag}](https://link.clashofclans.com/?action=OpenClanProfile&tag=%23${findRepList.secondaryClanTag.slice(1)})`)
                        .addFields(
                            {
                                name: 'Representative:one:',
                                value: findRepList.rep1,
                            },
                            {
                                name: 'Discord🆔',
                                value: findRepList.rep1_dc,
                            },
                            {
                                name: 'Representative:two:',
                                value: findRepList.rep2,
                            },
                            {
                                name: 'Discord🆔',
                                value: findRepList.rep2_dc,
                            }
                        )
                        .setTimestamp()
                    await message.channel.send(embed);
                }
            }
            else if (args[1].toLowerCase() === 'tagreps' || args[1].toLowerCase() === 'tr') {
                const embed = new Discord.MessageEmbed()
                    .setColor(color[match[division]])
                    .setTitle(findRepList.abb)
                    .setDescription(`Rep1 - ${findRepList.rep1}\nRep2 - ${findRepList.rep2}`)
                message.channel.send(embed).then((msg) => {
                    setTimeout(function () {
                        msg.edit(`${findRepList.abb}\nRep1 - <@${findRepList.rep1_dc}>\nRep2 - <@${findRepList.rep2_dc}>`)
                    }, 100)
                });
            }
        } else {
            message.reply(`You can't use this command here!`);
        }
    }
}