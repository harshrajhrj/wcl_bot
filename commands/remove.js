const fetch = require('node-fetch');
const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');
const moment = require('moment-timezone');
const PaginationEmbed = require('discord-paginationembed');

module.exports = {
    name: 'rosterremove',
    aliases: ['remove'],
    description: 'Allows you to remove a player to the WCL Roster',
    args: true,
    length: 2,
    cooldown: 100, //50 previous
    category: 'representative',
    missing: ['`clan_abb`, ', '`player_tag`'],
    usage: 'clan_abb player_tag',
    explanation: 'Ex: wcl remove INQ #XYZ\n\nwhere\nINQ is clan abb\n#XYZ is ClashOfClans PlayerTag',
    execute: async (message, args) => {
        if (message.channel.id === '941944848771080192' || message.channel.id === '941943402482782218' || message.channel.id === '847483626400907325' || message.channel.id === '766307563393515551') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
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
            const few = new Date();
            let msg = moment(few, 'EST').format();
            let m = msg.split('T');
            let n = m[1].split('+');
            let ct = n[0].split(':');
            let cte = n[1].split(':');
            let ct1 = parseInt(ct[0], 10); //22
            let ct2 = parseInt(ct[1], 10); //55
            let ct3 = parseInt(ct[2], 10); //60
            let tz1 = parseInt(cte[0], 10);
            let tz2 = parseInt(cte[1], 10);
            var comb1 = 0;
            var comb2 = 0;
            if ((ct1 + tz1) > 24) {
                ct1 = 24 - ct1; //2
                tz1 = tz1 - ct1; //3
                comb1 += tz1;
            }
            else {
                comb1 = ct1 + tz1;
            }
            if ((ct2 + tz2) > 60) {
                ct2 = 60 - ct2;
                tz2 = tz2 - ct2;
                comb2 += tz2;
            }
            else {
                comb2 = ct2 + tz2;
            }
            let ds = m[0] + " | " + comb1 + ":" + comb2 + ":" + ct3;
            let dcid = ''
            if (args[2] === undefined) {
                dcid += '';
            }
            else {
                dcid += args[2].toUpperCase();
            }
            message.channel.send(`Processing....Please wait, this may take a while ${message.author.username}.`)
            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const checkabb = {
                    spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                    range: 'CLANS!F4:F380'
                };
                let check_data = await gsapi.spreadsheets.values.get(checkabb);
                let check_array = check_data.data.values;
                let blank = 0;
                check_array.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        blank = 1;
                    }
                });
                if (blank === 0) {
                    message.reply(`${args[0].toUpperCase()} is invalid clan abb!`);
                }
                const checks = {
                    spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                    range: args[0].toUpperCase() + '!D5:D7'
                };
                let id = await gsapi.spreadsheets.values.get(checks);
                let id_data = id.data.values;

                let perm = id_data[0][0];
                let t = id_data[1][0];
                let r = id_data[2][0];

                const p = await fetch('https://api.clashofstats.com/players/' + args[1].toUpperCase().slice(1), options); //http://wclapi.tk/player/
                let final = '';
                if (p.status === 503) {
                    final += 'Removal paused due to Maintenance Break!'
                    message.reply(final);
                }
                let getbans = await ban_check(args[1].toUpperCase());
                let dupecheck = await dupe(args[1].toUpperCase());
                if (getbans === '') {
                    if (!(dupecheck === '')) {
                        if (p.status === 500 || p.status === 404) {
                            final += 'Invalid Tag'
                            message.channel.send(`${args[1].toUpperCase()} is ${final}!`);
                        }
                        const data = await p.json();
                        let th = '';
                        if (p.status === 200) {
                            final += data.name;
                            // th += data.TH;
                            th += data.townHallLevel;
                            if (perm === message.author.id || message.author.id === '531548281793150987' || message.author.id === '602935588018061453') {
                                update(ds, args[1].toUpperCase(), final, message.author.id, th, dcid);
                            }
                            else {
                                message.reply(`You're not authorized roster rep for ${args[0].toUpperCase()}!`);
                            }
                        }
                    }
                    else {
                        message.reply(`${args[1].toUpperCase()} doesn't exist in ${args[0].toUpperCase()}!`);
                    }
                }
                else {
                    message.reply(`${args[1].toUpperCase()} is banned!`);
                }

                async function ban_check(tag) {
                    const ban = {
                        spreadsheetId: '1qckELKFEYecbyGeDqRqItjSKm02ADpKfhkK1FiRbQ-c',
                        range: 'Banned Players!C6:C'
                    };
                    let data = await gsapi.spreadsheets.values.get(ban);
                    let data_array = data.data.values;
                    let found = '';
                    data_array.forEach(data => {
                        if (data[0] === tag) {
                            found += 'Found a ban!';
                        }
                    });
                    return found;
                }

                async function dupe(tag) {
                    const find = {
                        spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                        range: args[0].toUpperCase() + '!E10:E89'
                    };
                    let data = await gsapi.spreadsheets.values.get(find);
                    let data_array = data.data.values;
                    let found = '';
                    data_array.forEach(data => {
                        if (data[0] === tag.toUpperCase()) {
                            found += 'Found a dupe!';
                        }
                    });
                    return found;
                }
                async function update(date, tag, name, auth_id, th, dc_id) {
                    const embed = [];
                    const embedremove = new Discord.MessageEmbed()
                        .setColor('#128682')
                        .setAuthor('By WCL Technical')
                        .setTitle(`Removal Preview of ${args[0].toUpperCase()}`)
                        .setDescription(`React with ✅ or ❎ to approve/disapprove the removal!\n✅ - Removal Accepted\n❎ - Removal Rejected`)
                        .addField('Player Name', name, true)
                        .addField('Player Tag', tag, true)
                        .setThumbnail(`https://coc.guide/static/imgs/other/town-hall-${th}.png`)
                        .setFooter(`Requested by ${auth_id} | React within 60s`)
                        .setTimestamp()
                    embed.push(embedremove);

                    const Embeds = new PaginationEmbed.Embeds()
                        .setArray(embed)
                        .setAuthorizedUsers([message.author.id])
                        .setChannel(message.channel)
                        .setTimeout(60000)
                        .setDisabledNavigationEmojis(['all'])
                        .setFunctionEmojis({
                            '✅': (_, instance) => {
                                put(date, tag, name, auth_id, dc_id);
                                instance.addField(`Removed By`, `<@${message.author.id}>`);
                                instance.setColor('#630000');
                                instance.resetEmojis();
                            },
                            '❎': (_, instance) => {
                                instance.addField(`Rejected By`, `<@${message.author.id}>`);
                                instance.setColor('#ff0000');
                                instance.resetEmojis();
                            }
                        });
                    await Embeds.build();
                    /*let collect = await message.channel.send(embed);
                    await collect.react('✅');
                    await collect.react('❎');
                    const filter = (reaction, user) => {
                       return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                   };
                   collector = await collect.createReactionCollector(filter, {
                       max : 1,
                       time : 60000,
                       errors : ['time']
                   });
                   if(!(collector))
                   await collect.delete();
                   collector.on('collect', async (reaction, user) => {
                       if(reaction.emoji.name === '✅') {
                           put(date,tag,name,auth_id,dc_id);
                       }
                       else {
                           message.channel.send(`Rejected by ${message.author}!`);
                       }
                   });*/
                }

                async function put(date, tag, name, auth_id, dc_id) {
                    const pull = {
                        spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                        range: args[0].toUpperCase() + '!R51:R89'
                    };
                    let pull_data = await gsapi.spreadsheets.values.get(pull);
                    let array = pull_data.data.values;
                    const pull2 = {
                        spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                        range: args[0].toUpperCase() + '!X10:X89'
                    };
                    const gets = {
                        spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                        range: args[0].toUpperCase() + '!D10:E89',
                    };
                    let gets_data = await gsapi.spreadsheets.values.get(gets);
                    let gets_array = gets_data.data.values;
                    let m1 = 0;
                    let m2 = 0;
                    let add = 0;
                    let remove = 0;
                    array.forEach(data => {
                        m1 += 1;
                        if (data[0] === 'Yes' && add === 0) {
                            const write = {
                                spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                                range: args[0].toUpperCase() + "!T" + (50 + m1) + ":W" + (50 + m1),
                                valueInputOption: 'USER_ENTERED',
                                resource: { values: [[date, tag, name, auth_id]] }
                            };
                            gsapi.spreadsheets.values.update(write);
                            gets_array.forEach(data => {
                                m2 += 1;
                                if (data[1] === tag && remove === 0) {
                                    const write2 = {
                                        spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                                        range: args[0].toUpperCase() + '!D' + (9 + m2) + ':E' + (9 + m2)
                                    };
                                    gsapi.spreadsheets.values.clear(write2);
                                    //message.channel.send(`Removed **${tag}** from **${args[0].toUpperCase()}**!`)
                                    remove++;
                                }
                            });
                            add++;
                        }
                    });
                }
            }
        }
        else {
            message.reply(`Not authorised for the command to be used in this channel!`);
        }
    }
}