const Discord = require('discord.js');

module.exports = {
    name: 'attackframe',
    aliases: ['af', 'tf'],
    description: 'Lists the attack frames of eSports wars',
    args: false,
    execute: async (message) => {
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
            const description = `🗡️#    Attack       Time ⏱️\n
🗡️1  Home team  ⏱️37 mins left
🗡️2  Away team  ⏱️33 mins left
🗡️3  Home team  ⏱️29 mins left
🗡️4  Away team  ⏱️25 mins left
🗡️5  Home team  ⏱️21 mins left
🗡️6  Away team  ⏱️17 mins left
🗡️7  Home team  ⏱️13 mins left
🗡️8  Away team  ⏱️09 mins left
🗡️9  Home team  ⏱️05 mins left
🗡️10 Away team  ⏱️01 mins left`
            const embed = new Discord.MessageEmbed()
                .setAuthor('By WCL TECHNICAL', 'https://media.discordapp.net/attachments/766306691994091520/804653857447477328/WCL_BOt.png')
                .setColor('#ffb014')
                .setTitle('Attack and time frames of WCL eSports wars')
                .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442651238039572/WCL_Champions.png?width=548&height=612')
                .setDescription('```' + description + '```')
                .addField('Additional Info', '```*Challenge is sent by home team\n*Attack is to started firstly from the home team\n*Teams must send / accept challenge not later than 20 minutes after scheduled match agreement```')
                .setFooter(`Attack starts exactly at the time left as per shown above.\n+/- 30 secs difference can occur with no penalty.`)
                .setTimestamp()

            message.channel.send(embed);
        }
        else {
            message.reply(`Not an appropriate channel to use the command!`);
        }
    }
}