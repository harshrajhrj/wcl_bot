const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');
const PaginationEmbed = require('discord-paginationembed');
const fetch = require('node-fetch');

module.exports = {
    name: 'roster',
    aliases: ['rs'],
    description: `Helps to see you a clan's roster`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'clan_abb',
    missing: ['`clan_abb`'],
    explanation: 'Ex: wcl rs INQ',
    execute: async (message, args) => {
        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {
            const options = {
                'contentType': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true,
                // 'headers': { 'Accept': 'application/json', 'authorization': `Bearer ${token}`}
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

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                // function sort_function(list) {
                //     let sort = [];
                //     let cd = [['14'], ['13'], ['12'], ['11'], ['NOT SCANNED'], ['INVALID TAG']];
                //     var finish = new Promise((resolve, reject) => {
                //         cd.forEach(con => {
                //             list.forEach(data => {
                //                 if (!(data[0] === undefined)) {
                //                     if (con[0] === data[2]) {
                //                         sort.push([data[0], data[1], data[2]]);
                //                     }
                //                 }
                //             });
                //             if (sort.length === list.length) {
                //                 resolve(sort);
                //             }
                //         });
                //     });
                //     finish.then(async (sort) => {
                //         return sort;
                //     });
                // }

                async function getInfo(tag) {
                    const response = await fetch('https://api.clashofstats.com/players/' + decodeURIComponent(tag.slice(1)).replace(/[^\x00-\x7F]/g, ""), options);
                    const data = await response.json()
                    return data;
                }

                // const checkabb = {
                //     spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                //     range: 'CLANS!F4:F380'
                // };
                // let check_data = await gsapi.spreadsheets.values.get(checkabb);
                // let check_array = check_data.data.values;
                const checkabbfetch = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/CLANS!F4:F380?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y', options);
                const checkabb_data = await checkabbfetch.json();
                let blank = 0;
                checkabb_data.values.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        blank = 1;
                    }
                });

                if (blank === 0) {
                    message.reply(`${args[0].toUpperCase()} is invalid clan abb!`);
                }

                // const roster = {
                //     spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                //     range: args[0].toUpperCase() + '!E10:G89'
                // };
                // let roster_data = await gsapi.spreadsheets.values.get(roster);
                // let roster_array = roster_data.data.values;
                const checkroster = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/${args[0].toUpperCase()}!E10:G89?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                const checkroster_data = await checkroster.json();

                var finish = new Promise((resolve, reject) => {
                    let raw_sort = [];
                    let int = 0;
                    checkroster_data.values.forEach(data => {
                        if (data.length > 0) {
                            int++;
                        }
                    })
                    checkroster_data.values.forEach(async (data) => {
                        if (!(data[0] === undefined && data.length === 0)) {
                            let info = await getInfo(data[0]);
                            raw_sort.push([data[0], info.name, info.townHallLevel]);
                            if (raw_sort.length === int) {
                                resolve(raw_sort);
                            }
                        }
                    });
                });

                finish.then(async (raw_sort) => {
                    // const rinfo = {
                    //     spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                    //     range: args[0].toUpperCase() + '!K2:K7'
                    // };
                    // let rinfo_data = await gsapi.spreadsheets.values.get(rinfo);
                    // let rinfo_array = rinfo_data.data.values;
                    const rinfo = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/${args[0].toUpperCase()}!K2:K7?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                    const rinfo_data = await rinfo.json();
                    let rinfo_array = rinfo_data.values;
                    let rs = '';
                    let th14 = 0;

                    // let sort = sort_function(raw_sort);
                    let sort = [];
                    let cd = [['14'], ['13'], ['12'], ['11'], ['10'], ['9'], ['8'], ['7'], ['6'], ['5'], ['4'], ['3'], ['2'], ['1'], ['NOT SCANNED'], ['INVALID TAG']];
                    var ending = new Promise((resolve, reject) => {
                        cd.forEach(con => {
                            raw_sort.forEach(data => {
                                if (!(data[0] === undefined)) {
                                    if (con[0] === (data[2]).toString()) {
                                        sort.push([data[0], data[1], data[2]]);
                                    }
                                }
                            });
                            if (sort.length === raw_sort.length) {
                                resolve(sort);
                            }
                        });
                    });
                    ending.then(async (sort) => {
                        console.log(sort);
                        sort.forEach(data => {
                            if (!(data[0] === undefined)) {
                                rs += `${data[0].padEnd(12, ' ')} ${(data[2].toString()).padEnd(2, ' ')} ${data[1].padEnd(15, ' ')}\n`;
                                if (data[2] === '14') {
                                    th14 += 1;
                                }
                            }
                        });

                        const embeds = [];
                        const embed = new Discord.MessageEmbed()
                            .setColor('#1980de')
                            .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                            .setAuthor('By WCL Technical')
                            .setTitle(`Roster for ${args[0].toUpperCase()}!`)
                            .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + rs.slice(0, 1984) + "```")
                            .setTimestamp()
                        embeds.push(embed);
                        if (rs.length > 1984) {
                            const embedagain = new Discord.MessageEmbed()
                                .setColor('#1980de')
                                .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                                .setAuthor('By WCL Technical')
                                .setTitle(`Roster for ${args[0].toUpperCase()}!`)
                                .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + rs.slice(1984, rs.length) + "```")
                                .setTimestamp()
                            embeds.push(embedagain);
                        }

                        if (embeds.length === 1) {
                            message.channel.send(embeds[0].addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${th14}**\n<:townhall13:766289069486506004> | **${rinfo_array[0][0]}**\n<:townhall12:766289153766850562> | **${rinfo_array[1][0]}**\n<:townhall11:766289216661356564> | **${rinfo_array[2][0]}**\n**Less than** <:townhall11:766289216661356564> | **${rinfo_array[3][0]}**\n**Total Accounts** | **${rinfo_array[4][0]}**\n**Addition Left** | **${rinfo_array[5][0]}**`).setFooter(`Page 1/1`));
                        }
                        else {
                            let m1 = 0;
                            embeds.map(function (r) { m1++; return r.addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${th14}**\n<:townhall13:766289069486506004> | **${rinfo_array[0][0]}**\n<:townhall12:766289153766850562> | **${rinfo_array[1][0]}**\n<:townhall11:766289216661356564> | **${rinfo_array[2][0]}**\n**Less than** <:townhall11:766289216661356564> | **${rinfo_array[3][0]}**\n**Total Accounts** | **${rinfo_array[4][0]}**\n**Addition Left** | **${rinfo_array[5][0]}**`).setFooter(`Page ${m1}/2`) })
                            const Embeds = new PaginationEmbed.Embeds()
                                .setArray(embeds)
                                .setTimeout(300000)
                                .setChannel(message.channel)
                                // Sets the client's assets to utilise. Available options:
                                //  - message: the client's Message object (edits the message instead of sending new one for this instance)
                                //  - prompt: custom content for the message sent when prompted to jump to a page
                                //      {{user}} is the placeholder for the user mention
                                //.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                                .setDeleteOnTimeout(false)
                                .setDisabledNavigationEmojis(['all'])
                                .setDisabledNavigationEmojis(['back', 'forward', 'jump'])
                                .setFunctionEmojis({
                                    '◀️': (_, instance) => {
                                        instance.setPage('back');
                                    },
                                    '▶️': (_, instance) => {
                                        instance.setPage('forward');
                                    },
                                })

                            await Embeds.build();
                        }
                    });
                });
                // for (var i = 0; i < roster_array.length; i++) {
                //     if (!roster_array[i][0] === undefined) {
                //         // let info = await getInfo(roster_array[i][0]);
                //         let response = await fetch('https://api.clashofstats.com/players/' + decodeURIComponent(roster_array[i][0].slice(1)).replace(/[^\x00-\x7F]/g, ""), options);
                //         let data = await response.json();
                //         raw_sort.push([data[0], data.name, data.townHallLevel])
                //         // console.log(data);
                //     }
                // }

                // const rinfo = {
                //     spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                //     range: args[0].toUpperCase() + '!K2:K7'
                // };
                // let rinfo_data = await gsapi.spreadsheets.values.get(rinfo);
                // let rinfo_array = rinfo_data.data.values;

                // let rs = '';
                // let th14 = 0;

                // let sort = sort_function(raw_sort);

                // sort.forEach(data => {
                //     if (!(data[0] === undefined)) {
                //         rs += `${data[0].padEnd(12, ' ')} ${data[2].padEnd(2, ' ')} ${data[1].padEnd(15, ' ')}\n`;
                //         if (data[2] === '14') {
                //             th14 += 1;
                //         }
                //     }
                // });

                // const embeds = [];
                // const embed = new Discord.MessageEmbed()
                //     .setColor('#f53704')
                //     .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                //     .setAuthor('By WCL Technical')
                //     .setTitle(`Roster for ${args[0].toUpperCase()}!`)
                //     .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + rs.slice(0, 1984) + "```")
                //     .setTimestamp()
                // embeds.push(embed);
                // if (rs.length > 1984) {
                //     const embedagain = new Discord.MessageEmbed()
                //         .setColor('#f53704')
                //         .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                //         .setAuthor('By WCL Technical')
                //         .setTitle(`Roster for ${args[0].toUpperCase()}!`)
                //         .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + rs.slice(1984, rs.length) + "```")
                //         .setTimestamp()
                //     embeds.push(embedagain);
                // }

                // if (embeds.length === 1) {
                //     message.channel.send(embeds[0].addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${th14}**\n<:townhall13:766289069486506004> | **${rinfo_array[0][0]}**\n<:townhall12:766289153766850562> | **${rinfo_array[1][0]}**\n<:townhall11:766289216661356564> | **${rinfo_array[2][0]}**\n**Less than** <:townhall11:766289216661356564> | **${rinfo_array[3][0]}**\n**Total Accounts** | **${rinfo_array[4][0]}**\n**Addition Left** | **${rinfo_array[5][0]}**`).setFooter(`Page 1/1`));
                // }
                // else {
                //     let m1 = 0;
                //     embeds.map(function (r) { m1++; return r.addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${th14}**\n<:townhall13:766289069486506004> | **${rinfo_array[0][0]}**\n<:townhall12:766289153766850562> | **${rinfo_array[1][0]}**\n<:townhall11:766289216661356564> | **${rinfo_array[2][0]}**\n**Less than** <:townhall11:766289216661356564> | **${rinfo_array[3][0]}**\n**Total Accounts** | **${rinfo_array[4][0]}**\n**Addition Left** | **${rinfo_array[5][0]}**`).setFooter(`Page ${m1}/2`) })
                //     const Embeds = new PaginationEmbed.Embeds()
                //         .setArray(embeds)
                //         .setTimeout(300000)
                //         .setChannel(message.channel)
                //         // Sets the client's assets to utilise. Available options:
                //         //  - message: the client's Message object (edits the message instead of sending new one for this instance)
                //         //  - prompt: custom content for the message sent when prompted to jump to a page
                //         //      {{user}} is the placeholder for the user mention
                //         //.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                //         .setDeleteOnTimeout(false)
                //         .setDisabledNavigationEmojis(['all'])
                //         .setDisabledNavigationEmojis(['back', 'forward', 'jump'])
                //         .setFunctionEmojis({
                //             '◀️': (_, instance) => {
                //                 instance.setPage('back');
                //             },
                //             '▶️': (_, instance) => {
                //                 instance.setPage('forward');
                //             },
                //         })

                //     await Embeds.build();
                // }
            }
        }
        else {
            message.reply(`Not an appropriate channel to use the command!`);
        }
    }
}