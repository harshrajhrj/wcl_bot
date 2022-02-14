const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');

module.exports = {
    name: 'replace',
    aliases: ['replace'],
    description: 'Replace a clan_abb',
    args: true,
    length: 2,
    category: 'Admins',
    usage: 'old_clan_abb new_clan_abb',
    missing: ['`old_clan_abb`, ', '`new_clan_abb`'],
    explanation: 'Ex : wcl replace cns lon',
    execute: (message, args) => {
        // if(message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403' || message.member.hasPermission('MANAGE_ROLES')) {
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

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                let find_old = await search(args[0].toUpperCase());
                let find_new = await search(args[1].toUpperCase());
                if (find_old === 0) {
                    message.reply(`Clan **${args[0].toUpperCase()}** not found!`)
                }

                const rep = {
                    spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                    range: 'ALL DETAILS!A2:A'
                };

                const rep1 = {
                    spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                    range: 'CLANS!F4:F'
                };
                let rep1_data = await gsapi.spreadsheets.values.get(rep1);
                let rep1_array = rep1_data.data.values;
                let control1 = 0;
                let m2 = 0;
                let rep_data = await gsapi.spreadsheets.values.get(rep);
                let rep_array = rep_data.data.values;
                let control = 0;
                let m1 = 0;
                if (find_new === 0) {
                    rep_array.forEach(async data => {
                        m1 += 1;
                        if (data[0] === args[0].toUpperCase() && control === 0) {
                            const put = {
                                spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                range: 'ALL DETAILS!A' + (m1 + 1),//+':A',
                                valueInputOption: 'USER_ENTERED',
                                resource: { values: [[args[1].toUpperCase()]] }
                            };
                            try {
                                gsapi.spreadsheets.values.update(put);
                                control++;
                                (await message).react('✅');
                                //(await message.reply(`Successfully replaced **${data[0]}** with **${args[1].toUpperCase()}**!`)).react('✅');//to be removed after clan announcement
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    });

                    rep1_array.forEach(async data => {
                        m2 += 1;
                        if (data[0] === args[0].toUpperCase() && control1 === 0) {
                            const put = {
                                spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                                range: 'CLANS!F' + (m2 + 3) + ':F',
                                valueInputOption: 'USER_ENTERED',
                                resource: { values: [[args[1].toUpperCase()]] }
                            };
                            try {
                                gsapi.spreadsheets.values.update(put);
                                (await message.reply(`Successfully replaced **${args[0].toUpperCase()}** with **${args[1].toUpperCase()}**! Ref - ${m2 + 3}`)).react('✅');
                                control1++;
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    });
                }
                else {
                    message.reply(`${args[1].toUpperCase()} already present, try another!`)
                }

                async function search(abb) {
                    const find = {
                        spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                        range: 'ALL DETAILS!A2:A'
                    };
                    let find_data = await gsapi.spreadsheets.values.get(find);
                    let find_array = find_data.data.values;
                    let confirm = 0;
                    find_array.forEach(data => {
                        if (data[0] === abb) {
                            confirm += 1;
                        }
                    });
                    return confirm;
                }
            }
        }
        else {
            message.reply(`Can't use in **${message.guild.name}**!\nOR\nNOT AUTHORIZED!`);
        }
    }
}