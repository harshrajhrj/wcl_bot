const Discord = require('discord.js');

module.exports = {
    name: 'attack_frame',
    aliases: ['af', 'tf'],
    description: 'Lists the attack frames of eSports wars',
    args: false,
    execute: async (message) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780'))
        if (message.author.id === '531548281793150987') {
            const description = `Order     Attack       Time     \n
Attack_1 Away team  40 mins left
Attack_1 Home team  36 mins left
Attack_2 Away team  32 mins left
Attack_2 Home team  28 mins left
Attack_3 Away team  24 mins left
Attack_3 Home team  20 mins left
Attack_4 Away team  16 mins left
Attack_4 Home team  12 mins left
Attack_5 Away team  08 mins left
Attack_5 Home team  04 mins left`
            const embed = new Discord.MessageEmbed()
                .setAuthor('By WCL')
                .setColor('#93ad22')
                .setTitle('Attack and time frames of WCL eSports wars')
                .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324525954138192/Pirates_Division.png')
                .setDescription('```' + description + '```')
                .setFooter(`Attack starts exactly at the time left as per shown above.\n+/- 30 secs difference can occur with no penalty.`)
                .setTimestamp()

            message.channel.send(embed);
        }
        else {
            message.reply(`Not an appropriate channel to use the command!`);
        }
    }
}