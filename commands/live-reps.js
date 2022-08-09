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
        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {
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
                        .setTitle(`*Clan Info of ${findRepList.clanName}*`)
                        .addField('Clan name<:cc:944312115643166720>', findRepList.clanName)
                        .addField('Clan tag:hash:', `[${findRepList.clanTag}](https://link.clashofclans.com/?action=OpenClanProfile&tag=%23${findRepList.clanTag.slice(1)})`)
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
        }
    }
}