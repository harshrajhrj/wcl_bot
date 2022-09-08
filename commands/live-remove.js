const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment-timezone');
const PaginationEmbed = require('discord-paginationembed');
const fs = require('fs');

module.exports = {
    name: 'rosterremove',
    aliases: ['remove'],
    description: 'Allows you to remove a player to the WCL Roster',
    args: true,
    length: 2,
    cooldown: 20, //50 previous
    category: 'representative',
    missing: ['`clan_abb`, ', '`player_tag`, ', '`discord_id(optional)`'],
    usage: 'clan_abb player_tag discord_id(optional)',
    explanation: 'Ex: wcl add INQ #XYZ DISCORD_ID\n\nwhere\nINQ is clan abb\n#XYZ is ClashOfClans PlayerTag\nDISCORD_ID is long number ID of the player\n-F(forceRemove optional for league admins only)',
    execute: async (message, args) => {
        const channelPermmissions = [
            '1011618703814705262',
            '1011622635781771294'
        ];
        if (channelPermmissions.includes(message.channel.id) || message.member.hasPermission('MANAGE_GUILD')) {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };
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
            let dateNtime = m[0] + " | " + comb1 + ":" + comb2 + ":" + ct3;
            let dcid = ''
            if (args[2] === undefined) {
                dcid += '';
            }
            else {
                dcid += args[2].toUpperCase();
            }
            message.channel.send(`Processing....Please wait, this may take a while ${message.author.username}.`)

            //abb checking
            var rawABBS = fs.readFileSync('./commands/abbs.json')
            var check_array = JSON.parse(rawABBS);
            let division = '';
            check_array.values.forEach(data => {
                if (data[2] === args[0].toUpperCase()) {
                    division = data[3];
                }
            });
            if (division === '') {
                message.reply(`${args[0].toUpperCase()} is invalid clan abb!`);
                return;
            }
            //abb checking ended

            var rosterData = await sendBack(division, args[0].toUpperCase(), []);
            let available = await isAvailable(args[1].toUpperCase(), rosterData.players); // checking for existing rostered player

            //forceRemove
            if (available.length > 0 && message.member.hasPermission('MANAGE_GUILD') && args.length > 2) {
                if (args[2].toUpperCase() === '-F') {
                    const p = await fetch('https://api.clashofstats.com/players/' + decodeURIComponent(args[1].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, ""), options);
                    if (p.status === 404) {
                        update(dateNtime, args[1].toUpperCase(), 'None', message.author.id, 'None', 'None');
                        return;
                    } else {
                        const data = await p.json();
                        update(dateNtime, args[1].toUpperCase(), data.name, message.author.id, data.townHallLevel, 'None');
                        return;
                    }
                }
            }
            //forceRemove

            let perm = [];
            // if (rosterData.rosterReps[0].length === 1) {
            //     perm.push(rosterData.rosterReps[0][0])
            // }
            // else {
            //     perm.push(rosterData.rosterReps[0][0], rosterData.rosterReps[0][1])
            // }
            perm.push(rosterData.rep1_dc, rosterData.rep2_dc);

            const p = await fetch('https://api.clashofstats.com/players/' + decodeURIComponent(args[1].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, ""), options); //http://wclapi.tk/player/
            let final = '';
            if (p.status === 503) {
                final += 'Addition paused due to Maintenance Break!'
                message.reply(final);
                return;
            }
            else if (p.status === 404) {
                message.reply(`${args[1].toUpperCase()} is invalid tag!`);
                return;
            }

            if (available.length > 0) {
                const data = await p.json();
                let th = '';
                if (p.status === 200) {
                    final += data.name;
                    th += data.townHallLevel;
                    if (perm.includes(message.author.id) || message.member.hasPermission('MANAGE_GUILD')) {
                        update(dateNtime, args[1].toUpperCase(), final, message.author.id, th, dcid);
                    }
                    else {
                        message.reply(`You're not authorized roster rep for ${args[0].toUpperCase()}!`);
                        return;
                    }
                }
            }
            else {
                message.reply(`${args[1].toUpperCase()} don't exist in ${args[0].toUpperCase()}!`);
                return;
            }

            async function isAvailable(tag, values) {
                let found = [];
                values.forEach(data => {
                    if (data[0] === tag.toUpperCase()) {
                        found.push('Found');
                    }
                });
                return found;
            }

            async function update(date, tag, name, auth_id, th, dc_id) {
                const embed = [];
                const embedadd = new Discord.MessageEmbed()
                    .setColor('#128682')
                    .setAuthor('By WCL TECHNICAL')
                    .setTitle(`Removal Preview of ${args[0].toUpperCase()}`)
                    .setDescription(`React with ✅ or ❎ to approve/disapprove the removal!\n✅ - Removal Accepted\n❎ - Removal Rejected`)
                    .addField('Player Name', name, true)
                    .addField('Player Tag', tag, true)
                    .setThumbnail(`https://coc.guide/static/imgs/other/town-hall-${th}.png`) //townhall emoji fetch
                    .setFooter(`Requested by ${auth_id} | React within 60s`)
                    .setTimestamp()
                embed.push(embedadd);

                const Embeds = new PaginationEmbed.Embeds()
                    .setArray(embed)
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setTimeout(60000)
                    .setDisabledNavigationEmojis(['all'])
                    .setFunctionEmojis({
                        '✅': (_, instance) => {
                            sendBack(division, args[0].toUpperCase(), [date, tag, name, auth_id, dc_id]);
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
            }

        }
        else {
            message.reply(`Not authorised for the command to be used in this channel!`);
        }

        async function sendBack(div, abb, dataArray) {
            var options = {
                'HEAVY': ['heavy', 'rosterSchemaHeavy'],
                'FLIGHT': ['flight', 'rosterSchemaFlight'],
                'ELITE': ['elite', 'rosterSchemaElite'],
                'BLOCKAGE': ['blockage', 'rosterSchemaBlockage'],
                'CHAMPIONS': ['champions', 'rosterSchemaChampions'],
                'CLASSIC': ['classic', 'rosterSchemaClassic'],
                'LIGHT': ['light', 'rosterSchemaLight']
            };

            var rSize = {
                'HEAVY': [100, 25],
                'FLIGHT': [70, 20],
                'ELITE': [50, 20],
                'BLOCKAGE': [40, 20],
                'CHAMPIONS': [10, 3],
                'CLASSIC': [50, 20],
                'LIGHT': [50, 20]
            };

            var rosterSchema = require('./rosterSchemas/' + options[div][1])

            var getData = await rosterSchema.find({ abb: abb });

            if (dataArray.length === 0) {
                return getData[0];
            }
            else {
                var rosterSize = getData[0].rosterSize - 1;
                var additionSpot = getData[0].additionSpot;

                if (rosterSize < rSize[div][0]) {
                    additionSpot = 'Yes'
                }

                getData[0].rosterSize = rosterSize;
                getData[0].additionSpot = additionSpot;

                if (getData[0].removalRecord[0][0] === 'N/A') {
                    const deleteRecordNA = await rosterSchema.findOneAndUpdate(
                        { abb: abb },
                        {
                            $pull: {
                                'removalRecord': ['N/A', 'N/A', 'N/A', 'N/A']
                            }
                        }
                    );
                }
                getData[0].removalRecord.push([dataArray[0], dataArray[1], dataArray[2], dataArray[3]]);

                var removal;
                var flag = 0;
                getData[0].players.forEach(data => {
                    if (data[0] === dataArray[1] && flag == 0) {
                        removal = [data[0], data[1]];
                        flag = 1;
                    }
                })
                const updateTag = await rosterSchema.findOneAndUpdate(
                    { abb: abb },
                    {
                        $pull: {
                            'players': removal
                        }
                    }
                );

                await getData[0].save()
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err.message));

                if (rosterSize <= rSize[div][1]) {
                    message.reply(`You've total of ${rosterSize} accounts in your roster.\n> Suggestion - Keep some ideal amount of players for your backups!`);
                }
            }
        }
    }
}