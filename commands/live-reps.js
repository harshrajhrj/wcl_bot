const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'claninfo',
    aliases: ['cinfo', 'clan', 'reps'],
    description: 'Shows you the clan representatives for a WCL Clan',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'wcl reps clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl reps INQ\nwhere INQ - clanAbb\n\nOptional\nUsing tr after putting clanAbb would help you to get the rep pinged!',
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]
        const color = {
            'HEAVY': '#008dff',
            'FLIGHT': '#3f1f8b',
            'ELITE': '#a40ae7',
            'BLOCKAGE': '#fc3902',
            'CHAMPIONS': '#ffb014',
            'CLASSIC': '#276cc1',
            'LIGHT': '#52d600'
        }
        const logo = {
            'HEAVY': 'https://cdn.discordapp.com/attachments/995764484218028112/995764719791112252/WCL_Heavy.png?width=539&height=612',
            'FLIGHT': 'https://cdn.discordapp.com/attachments/995764484218028112/995764818525044746/WCL_Flight.png?width=530&height=612',
            'ELITE': 'https://cdn.discordapp.com/attachments/995764484218028112/995765404565782609/WCL_ELITE.png?width=514&height=612',
            'BLOCKAGE': 'https://cdn.discordapp.com/attachments/995764484218028112/995765525001011310/WCL_Blockage-.png?width=435&height=613',
            'CHAMPIONS': 'https://cdn.discordapp.com/attachments/995764484218028112/995764652418023444/WCL_Champions.png?width=548&height=612',
            'LIGHT': 'https://cdn.discordapp.com/attachments/995764484218028112/995764946975596564/WCl_Light_Division-.png?width=548&height=612',
            'CLASSIC': 'https://cdn.discordapp.com/attachments/995764484218028112/995765980972195850/WCL_Classic-.png?width=548&height=612'
        };
        if (!notForUseChannels.includes(message.channel.id)) {
            var repSchema = require('./repsSchema/repsSchema');
            var ABBSobject = fs.readFileSync('./commands/abbs.json');
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
                        .setColor(color[division])
                        .setThumbnail(logo[division])
                        .setAuthor('WCL TECHNICAL', 'https://media.discordapp.net/attachments/766306691994091520/804653857447477328/WCL_BOt.png')
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
                    .setColor(color[division])
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