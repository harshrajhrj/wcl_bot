const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const PaginationEmbed = require('discord-paginationembed');

module.exports = {
    name: 'clanabbs',
    aliases: ["abbs"],
    description: 'List all clan abbreviations',
    args: true,
    length: 1,
    category: "moderator",
    usage: 'division_prefix',
    missing: ['`division_prefix`'],
    explanation: 'Ex: wcl abbs H\nwhere B - Heavyweight division\n\nPrefix\nH - Heavy Weight\nf - Flight\nE - Elite\nB - Blockage\nC - Champions(Esports)',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {
            const options = {
                //'json' : true,
                'Accept': 'application/json',
                'method': 'get',
                //'headers' : {accept : 'application/json', authorization : 'Bearer token'},
                'muteHttpExceptions': true
            };
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

            //S9 representative sheet
            const abbs = {
                'H': 'Heavy',
                'F': 'Flight',
                'E': 'Elite',
                'B': 'Blockage',
                'C': 'Champion (esports)',
                // 'B' : 'Blizzard',
                // 'P' : 'Pirates'
            };
            const findd = {
                'H': 'B4:D',
                'F': 'B4:D',
                'E': 'B4:D',
                'B': 'B4:D',
                'C': 'B4:E',
                // 'B' : 'B4:D',
                // 'P' : 'B4:D',
            }
            const color = {
                'H': '#008dff',
                'F': '#3f1f8b',
                'E': '#a40ae7',
                'B': '#fc3902',
                'C': '#ffb014',
                // 'B' : '#ffcd0b',
                // 'P' : '#93ad22'
            }
            const logo = {
                'H': 'https://media.discordapp.net/attachments/914077029912170577/914443975107153920/WCL_Heavy.png?width=539&height=612',
                'F': 'https://media.discordapp.net/attachments/914077029912170577/914442651992989736/WCL_Flight.png?width=530&height=612',
                'E': 'https://media.discordapp.net/attachments/914077029912170577/914442651690991616/WCL_ELITE.png?width=514&height=612',
                'B': 'https://media.discordapp.net/attachments/914077029912170577/914442652315963402/WCL_Blockage_.png?width=435&height=613',
                'C': 'https://media.discordapp.net/attachments/914077029912170577/914442651238039572/WCL_Champions.png?width=548&height=612',
            };
            if (abbs[args[0].toUpperCase()] === undefined) {
                message.channel.send(`Not found any division with abb **${args[0].toUpperCase()}**!\nTry using ` + "`" + `wcl abbs` + "`" + ' to understand the command!')
            }

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const find = {
                    spreadsheetId: '1S5mMA77plR7dF7ZS8awEeamcoe2ZYImLtztfuvfoTvA',
                    range: abbs[args[0].toUpperCase()] + '!' + findd[args[0].toUpperCase()]
                };
                let find_data = await gsapi.spreadsheets.values.get(find);
                let details = find_data.data.values;
                let col = '';

                details.sort(function(a,b){
                    var nameA = a[1].toUpperCase();
                    var nameB = b[1].toUpperCase();
                    if(nameA < nameB) {
                        return -1;
                    }
                    else if(nameA > nameB) {
                        return 1;
                    }

                    return 0;
                });
                
                details.forEach(data => {
                    if (args[0].toUpperCase() === 'C') {
                        if (!(data[0] === undefined)) {
                            col += `${data[3].padEnd(4, ' ')} ${data[0].padEnd(12, ' ')} ${data[1].padEnd(15, ' ')}\n`;
                        }
                    }
                    else {
                        if (!(data[0] === undefined)) {
                            col += `${data[2].padEnd(4, ' ')} ${data[0].padEnd(12, ' ')} ${data[1].padEnd(15, ' ')}\n`;
                        }
                    }
                });

                const embeds = [];
                const embed = new Discord.MessageEmbed()
                    .setColor(color[args[0].toUpperCase()])
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo[args[0].toUpperCase()])
                    .setTitle(`Clan Abbreviations for ${abbs[args[0].toUpperCase()]}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(0, 1972) + "```")
                    .setTimestamp()
                embeds.push(embed);
                if (col.length > 1972) {
                    const embed1 = new Discord.MessageEmbed()
                        .setColor(color[args[0].toUpperCase()])
                        .setAuthor('By WCL Technical')
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setTitle(`Clan Abbreviations for ${abbs[args[0].toUpperCase()]}!`)
                        .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(1972, 3944) + "```")
                        .setTimestamp()
                    embeds.push(embed1);
                }
                if (col.length > 3944) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor(color[args[0].toUpperCase()])
                        .setAuthor('By WCL Technical')
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setTitle(`Clan Abbreviations for ${abbs[args[0].toUpperCase()]}!`)
                        .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(3944, 5916) + "```")
                        .setTimestamp()
                    embeds.push(embed2);
                }
                if (col.length > 5916) {
                    const embed3 = new Discord.MessageEmbed()
                        .setColor(color[args[0].toUpperCase()])
                        .setAuthor('By WCL Technical')
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setTitle(`Clan Abbreviations for ${abbs[args[0].toUpperCase()]}!`)
                        .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(5916, col.length) + "```")
                        .setTimestamp()
                    embeds.push(embed3);
                }

                if (embeds.length === 1) {
                    message.channel.send(embeds[0].setFooter(`Page 1/1`));
                }
                else {
                    let m1 = 0;
                    embeds.map(function (r) { m1++; return r.setFooter(`Page ${m1}/${embeds.length}`) })
                    const Embeds = new PaginationEmbed.Embeds()
                        .setArray(embeds)
                        .setTimeout(600000)
                        .setChannel(message.channel)
                        /* Sets the client's assets to utilise. Available options:
                         *  - message: the client's Message object (edits the message instead of sending new one for this instance)
                         *  - prompt: custom content for the message sent when prompted to jump to a page
                         *      {{user}} is the placeholder for the user mention
                         *.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                         */
                        .setDeleteOnTimeout(false)
                        .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                        .setFunctionEmojis({
                            /*'⏮️': (_,instance) => { //to be enabled during season 9
                                instance.setPage(1);
                            },*/
                            '◀️': (_, instance) => {
                                instance.setPage('back');
                            },
                            '▶️': (_, instance) => {
                                instance.setPage('forward');
                            },
                            /*'⏭️': (_,instance) => { //to be enabled during season 9
                                instance.setPage(4);
                            },*/
                            '🔄': (_, instance) => {
                                instance.resetEmojis();
                            }
                        })

                    await Embeds.build();
                }
            }
        }
        else {
            message.reply(`Not an appropriate channel to use the command!`);
        }
    }
}