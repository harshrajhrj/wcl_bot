const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');

module.exports = {
    name: 'seasonreps',
    aliases: ["sreps"],
    description: 'Stores the information of clan representative!',
    args: true,
    length: 2,
    category: "moderator",
    usage: 'rep_prefix clan_abb rep_mention/clear',
    missing: ['`rep_prefix`, ', '`clan_abb`, ', '`rep_mention/clear`'],
    explanation: `Ex: wcl sreps r1 INQ @RAJ\nwhere Rep1 - RAJ\nOR\nwcl sreps all INQ @RAJ @Candy\nwhere Rep1 - RAJ and Rep2 - Candy\n\nwcl sreps all clan.abb clear\nThis command clears the data of both representatives. Individuals can be cleared by r1/r2/rr accordingly.\n\n
Rep Prefix\nr1 - Representative 1\nr2 - Representative 2\nrr - Roster Rep\nall - Both representatives`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        // if(message.member.hasPermission("MANAGE_ROLES")){
        if (message.author.id === '531548281793150987') {
            const client = new google.auth.JWT(
                keys.client_email,
                null,
                keys.private_key,
                ['https://www.googleapis.com/auth/spreadsheets']
            );

            client.authorize(function (err, tokens) {

                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log('Connected!');
                    gsrun(client);
                }
            });

            const search = {
                'R1': 'H',
                'R2': 'J',
                'RR': 'L',
                'ALL': 'H',
            };
            const search2 = {
                'R1': ':I',
                'R2': ':K',
                'RR': ':M',
                'ALL': ':K',
            };
            const identifier = {
                'R1': 'Representative 1',
                'R2': 'Representative 2',
                'RR': 'Roster Rep'
            };
            const clear_range1 = {
                'ALL': 'H',
                'R1': 'H',
                'R2': 'J',
                'RR': 'L'
            };
            const clear_range2 = {
                'ALL': ':M',
                'R1': ':I',
                'R2': ':K',
                'RR': ':M'
            };

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });
                const opt1 = {
                    spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                    range: 'ALL DETAILS!A2:M'
                };
                let opt1_array = await gsapi.spreadsheets.values.get(opt1);
                let opt1_data_array = opt1_array.data.values;

                let rep_name = '';
                let rep_id = '';
                let rep_tag = '';
                let number = 1;

                for (var i = 0; i < opt1_data_array.length; i++) {
                    if (args[1].toUpperCase() === opt1_data_array[i][0]) {
                        if (!(search[args[0].toUpperCase()] === undefined) && args[2].toUpperCase() === 'CLEAR') {
                            const erase = {
                                spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                range: 'ALL DETAILS!' + clear_range1[args[0].toUpperCase()] + (i + 2) + clear_range2[args[0].toUpperCase()] + (i + 2)
                            };
                            try {
                                gsapi.spreadsheets.values.clear(erase);
                            } catch (err) {
                                console.log(err);
                            }
                            (await message.reply(`**Updated**!`)).react('✅');
                            (await message).react('✅');
                            number++;
                        }
                        else {
                            if (!(search[args[0].toUpperCase()] === undefined) && !(args[0].toUpperCase() === 'ALL')) {
                                rep_name = message.mentions.users.map(user => {
                                    return user.username;
                                });
                                rep_id = message.mentions.users.map(user => {
                                    return user.id;
                                });
                                rep_tag = message.mentions.users.map(user => {
                                    return user.discriminator;
                                });
                                const opt2 = {
                                    spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                    range: 'ALL DETAILS!' + search[args[0].toUpperCase()] + (i + 2) + search2[args[0].toUpperCase()] + (i + 2),
                                    valueInputOption: 'USER_ENTERED',
                                    resource: { values: [[rep_name[0] + "#" + rep_tag[0], rep_id[0]]] }
                                };
                                try {
                                    gsapi.spreadsheets.values.update(opt2);
                                    const embed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setAuthor('WCL Bot')
                                        .setTitle(`Preview for ${args[1].toUpperCase()}`)
                                        .setDescription(`Details for ${identifier[args[0].toUpperCase()]}!`)
                                        .addField('Discord Name', rep_name[0] + "#" + rep_tag[0], false)
                                        .addField('Discord ID', rep_id[0], false)
                                        .setFooter('Updated')
                                    message.channel.send(embed);
                                    number++;
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            if (!(search[args[0].toUpperCase()] === undefined) && (args[0].toUpperCase() === 'ALL')) {
                                rep_name = message.mentions.users.map(user => {
                                    return user.username;
                                });
                                rep_id = message.mentions.users.map(user => {
                                    return user.id;
                                });
                                rep_tag = message.mentions.users.map(user => {
                                    return user.discriminator;
                                });
                                const opt2 = {
                                    spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                    range: 'ALL DETAILS!' + search[args[0].toUpperCase()] + (i + 2) + search2[args[0].toUpperCase()] + (i + 2),
                                    valueInputOption: 'USER_ENTERED',
                                    resource: { values: [[rep_name[0] + "#" + rep_tag[0], rep_id[0], rep_name[1] + "#" + rep_tag[1], rep_id[1]]] }
                                };
                                try {
                                    gsapi.spreadsheets.values.update(opt2);
                                    const embed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setAuthor('WCL Bot')
                                        .setTitle(`Preview for ${args[1].toUpperCase()}`)
                                        .setDescription(`Details for all representative!`)
                                        .addField('Representative 1', rep_name[0] + "#" + rep_tag[0], false)
                                        .addField('Discord ID', rep_id[0], false)
                                        .addField('Representative 2', rep_name[1] + "#" + rep_tag[1], false)
                                        .addField('Discord ID', rep_id[1], false)
                                        .addField('Required Roster Rep', 'Type ' + "`" + 'wcl sreps rr ' + args[1].toUpperCase() + ' mention_roster_rep' + "`")
                                        .setTimestamp()
                                        .setFooter('Updated')
                                    message.channel.send(embed);
                                    number++;
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                }
                if (number === 1) {
                    let c = [];
                    opt1_data_array.forEach(data => {
                        if (!(data[0] === args[1].toUpperCase())) {
                            c.push('N/A');
                        }
                    });
                    if (c.length > 0) {
                        message.channel.send(`Not found abb ${args[1].toUpperCase()}!`);
                    }
                }
            }
        }
        else {
            message.reply(`You don't have permission to use this command!`);
        }
    }
}