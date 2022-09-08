const Discord = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    name: 'substitute',
    aliases: ["subs"],
    description: 'Allows you to take a subtitute!',
    args: true,
    length: 4,
    category: "representative",
    usage: 'clan_abb player_tag warID mention/tag/ping-opponent_rep',
    missing: ['`clan_abb`, ', '`player_tag`, ', '`warID`, ', '`mention/tag/ping-opponent_rep`'],
    explanation: 'Ex : wcl subs INQ 1001 #PCV8JQR0V @RAJ\n\nwhere\nINQ - Clan Abb\n1001 - warID of the war in which the clan will be clashing\n@RAJ - Opponent Rep Mention',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {

        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]

        const options = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };

        const dateString = new Date().toLocaleString('en-US',
            {
                timeZone: 'America/New_York'
            }
        );

        // checking per week limit of TH(extending message if rep agree)
        // ban check
        // roster check
        // twice checking
        // applying cooldown of 2d
        // check for valid warID

        message.channel.send(`Processing....Please wait, this may take a while ${message.author.username}.`)

        if (message.channel.id === '1011620257275838485' || message.member.hasPermission('MANAGE_ROLES')) {

            // firstly check valid abb or not
            let abbArr = checkAbb(args[0].toUpperCase());
            if (abbArr.length === 0)
                return message.reply(`Invalid clan abb **${args[0].toUpperCase()}**!`);

            // checking for champ division
            if (abbArr[0][3] === 'CHAMPIONS')
                return message.reply(`Not allowed for Champions division!`);
            
            // ban check of the tag
            let ban = await banCheck(args[1].toUpperCase());
            if (ban.length > 0)
                return message.reply(`Banned account **${args[1].toUpperCase()}**!`);

            // checking for existing account
            let dupper = await checkForRoster(args[1].toUpperCase(), abbArr);
            if (dupper.length > 0)
                return message.reply(`Account : **${args[1].toUpperCase()}** is already present in **${args[0].toUpperCase()}**`)

            // twice checking of account
            let twiceCheck = await checkForTwice(args[1].toUpperCase(), abbArr);
            if (twiceCheck[1].length >= 2)
                return message.reply(`Account : ${args[1].toUpperCase()} has been used twice, so couldn't process substitution.\nPlease add it in your roster.`);

            // checking for clan validity with warID
            let checkValidWarID = await checkValidwarID(parseInt(args[2].toUpperCase(), 10), abbArr);
            if (checkValidWarID.length === 0)
                return message.reply(`Clan : **${args[0].toUpperCase()}** doesn't scheduled in warID : **${args[2].toUpperCase()}**!`);

            // work begins
            let mentions = '';

            const playerData = await fetch(`https://api.clashofstats.com/players/${decodeURIComponent(args[1].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);
            let final = '';
            if (playerData.status === 503) {
                final += 'Substitution paused due to Maintenance Break!'
                return message.reply(final);
            }
            if (playerData.status === 500 || playerData.status === 404) {
                final += 'Invalid Tag'
                return message.reply(`${args[1].toUpperCase()} is ${final}!`);
            }
            if (playerData.status === 200) {
                const data = await playerData.json();
                let th = data.townHallLevel;
                let pname = data.name;
                if (twiceCheck[0].includes(message.author.id) || message.member.hasPermission('MANAGE_ROLES')) {
                    if (message.mentions.users.first()) {
                        mentions = message.mentions.users.first();
                        replace(dateString, args[1].toUpperCase(), pname, th, message.author.username, mentions.username, mentions.id, args[2].toUpperCase());
                    }
                    else {
                        return message.reply(`You didn't mentioned opponent rep for subs approval!`);
                    }
                }
                else {
                    return message.reply(`You're not the representative of **${args[0].toUpperCase()}**!`)
                }
            }

            function checkAbb(abb) {
                var getAbbRefer = fs.readFileSync('./commands/abbs.json');
                var getAbbData = JSON.parse(getAbbRefer);

                let found = [];
                getAbbData.values.forEach(Abb => {
                    if (Abb[2] === abb) {
                        found.push(Abb);
                    }
                });
                return found;
            }

            async function banCheck(tag) {
                var banRecords = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1qckELKFEYecbyGeDqRqItjSKm02ADpKfhkK1FiRbQ-c/values/Banned Players!C6:C?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                let found = [];
                if (banRecords.status === 200) {
                    let data_array = await banRecords.json();
                    data_array.values.forEach(data => {
                        if (data[0] === tag) {
                            found.push('Found!');
                        }
                    });
                }
                return found;
            }

            async function checkForRoster(tag, divArr) {
                var divs = {
                    'HEAVY': 'Heavy',
                    'FLIGHT': 'Flight',
                    'ELITE': 'Elite',
                    'BLOCKAGE': 'Blockage',
                    'CHAMPIONS': 'Champions',
                    'CLASSIC': 'Classic',
                    'LIGHT': 'Light'
                };
                var rosterSchema = require(`./rosterSchemas/rosterSchema${divs[divArr[0][3]]}`);
                const getRoster = await rosterSchema.findOne({ abb: divArr[0][2] });
                const collectFound = [];
                getRoster.players.forEach(player => {
                    if (player[0] === tag) {
                        collectFound.push(player[0]);
                    }
                })
                return collectFound;
            }

            async function checkForTwice(tag, divArr) {
                const substitutionSchemaIS = require('./subTracking/substitutionSchema');
                const findSubAbb = await substitutionSchemaIS.findOne({ abb: divArr[0][2] }).populate('refer');
                const checkTwice = [[findSubAbb.refer.rep1_dc, findSubAbb.refer.rep2_dc], []];
                if (findSubAbb.playersCount[1].tag != null)
                    for (const countPlayer in findSubAbb.playersCount) {
                        if (findSubAbb.playersCount[countPlayer].tag === tag)
                            checkTwice[1].push(findSubAbb.playersCount[countPlayer].tag)
                    }
                return checkTwice;
            }

            async function checkValidwarID(warID, divArr) {
                const scheduleIS = require('./war&schedule&standings/scheduleSchema');
                const findSchedule = await scheduleIS.findOne({ warID: warID });
                const checkForWarID = [];
                if (findSchedule) {
                    if (findSchedule.clan.abb === divArr[0][2] || findSchedule.opponent.abb === divArr[0][2])
                        checkForWarID.push('Exists'); // pushing opponent's abb
                }
                return checkForWarID;
            }

            async function replace(date, tag, name, th, usern, opp, oppid, warID) { //opp - opponent username, oppid - opponent dc id
                const embed = new Discord.MessageEmbed()
                    .setColor('#99a9d1')
                    .setAuthor('By WCL Technical')
                    .setTitle(`Substitution Preview of ${args[0].toUpperCase()} | WAR ID : ${warID}`)
                    .setDescription(`Please wait ${message.author} for sometime until <@${oppid}> doesn't approve your request!`)
                    .setThumbnail(`https://coc.guide/static/imgs/other/town-hall-${th}.png`)
                    .addField('Player Tag', tag, true)
                    .addField('Player Name', name, true)
                    .addField('Time Interval', '1 Hour left to react', false)
                    .setTimestamp()
                    .setFooter(`Opponent is requested to react within an hour!`)
                let collect = await message.channel.send(embed);
                await collect.react('✅');
                await collect.react('❎');
                const filter = (reaction, user) => {
                    return ['✅', '❎'].includes(reaction.emoji.name) && user.id === oppid;
                };
                let collector = await collect.createReactionCollector(filter, {
                    max: 1,
                    time: 3600000,
                    errors: ['time']
                });
                if (!(collector))
                    await collect.delete();
                collector.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name === '✅') {
                        await collect.delete();
                        put(date, tag, name, oppid, warID);
                    }
                    else {
                        await collect.delete();
                        return message.reply(`Substitution : ${tag} : ${name} is rejected by <@${oppid}>!❎`);
                    }
                });
            }

            async function put(date, tag, name, oppID, warID) {
                const substitutionSchemaIS = require('./subTracking/substitutionSchema');
                const substitute = await substitutionSchemaIS.findOne({ abb: args[0].toUpperCase() });
                substitute.playersCount[1] = {
                    tag: '#tag',
                    warID: null,
                    date: null,
                    userID: null,
                    opponentID: null,
                }
                substitute.playersCount[Object.keys(substitute.playersCount).length + 1] = {
                    tag: tag,
                    warID: warID,
                    date: date,
                    userID: message.author.id,
                    oppID: oppID,
                }
                await substitute.markModified('playersCount');
                await substitute.save()
                    .then((data) => console.log(data));
                return message.reply(`Substitution : ${tag} : ${name} is approved by <@${oppID}>!❎`);
            }
        }
        else {
            message.reply(`Disabled command in this channel!`);
        }
    }
}