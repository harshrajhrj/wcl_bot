const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'reps',
    aliases: ['reps'],
    description: 'Shows you the clan representatives for a WCL Clan',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'wcl reps clan_abb',
    missing: ['`clan_abb`'],
    explanation: 'Ex: wcl reps INQ\nwhere INQ - clan_abb',
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780')) {
        if (message.author.id === '531548281793150987') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };

            const div_identifier = {
                'BLIZZARD (6/4/10/5) No Dip': '#ffcd0b',
                'PIRATES (5/0/0/0) TH14 Only': '#93ad22'
            };
            const logo = {
                'BLIZZARD (6/4/10/5) No Dip': 'https://media.discordapp.net/attachments/766306826542514178/841324500024688660/Blizzard_Division.png?width=495&height=612',
                'PIRATES (5/0/0/0) TH14 Only': 'https://media.discordapp.net/attachments/766306826542514178/841324525954138192/Pirates_Division.png'
            };

            const clan_data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM/values/ALL DETAILS!A2:O?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
            if (clan_data.status === 200) {
                const reps_data = await clan_data.json();
                let blank = 0;
                reps_data.values.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        blank = 1;
                    }
                });
                if (blank === 0) {
                    message.reply(`${args[0].toUpperCase()} is invalid clan abb!`);
                }
                else {
                    let r1 = '';
                    let d1 = '';
                    let r2 = '';
                    let d2 = '';
                    let rr = '';
                    let dr = '';

                    reps_data.values.forEach(data => {
                        if (data[0] === args[0].toUpperCase()) {
                            if (data[7] === '') {
                                r1 += 'Empty';
                                d1 += 'Empty';
                            }
                            else {
                                r1 += data[7];
                                d1 += data[8];
                            }
                            if (data[9] === '') {
                                r2 += 'Empty';
                                d2 += 'Empty';
                            }
                            else {
                                r2 += data[9];
                                d2 += data[10];
                            }
                            if (data[11] === '') {
                                rr += 'Empty';
                                dr += 'Empty';
                            }
                            else {
                                rr += data[11];
                                dr += data[12];
                            }
                            const embed = new Discord.MessageEmbed()
                                .setColor(div_identifier[data[14]])
                                .setAuthor('By WCL Technical')
                                .setThumbnail(logo[data[14]])
                                .setTitle(`Clan Representative Info for ${data[1]}`)
                                .addField('Representative 1', r1, false)
                                .addField('Discord ID', d1, false)
                                .addField('Representative 2', r2, false)
                                .addField('Discord ID', d2, false)
                                .addField('Roster Rep', rr, false)
                                .addField('Discord ID', dr, false)
                                .setTimestamp()
                            message.channel.send(embed);
                        }
                    });
                }
            }
            else {
                message.reply(`Internal error occured\nReport sent to the developer!`);
                message.channel('847370251430526986').send('Error occured while using command : wcl reps' + args[0].toUpperCase());
            }
        }
        else {
            message.reply(`Not an appropriate channel to use the command!`);
        }
    }
}