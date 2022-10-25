const scheduleSchema = require("./war&schedule&standings/scheduleSchema")
const repsSchema = require('./repsSchema/repsSchema');
const fs = require('fs');
const Discord = require('discord.js');
const showEmbed = require('./pre-showEmbed');
const individualWarRecord = require("./war&schedule&standings/individualWarRecord");

module.exports = {
    name: 'schedule',
    aliases: ['sch'],
    description: 'Allows you to log a scheduled war',
    args: true,
    length: 6,
    category: 'representative',
    missing: ['`week_no`, ', '`clan_abb`, ', '`opponent_abb`, ', '`duration`, ', '`date`, ', '`time`'],
    usage: 'week_no clan_abb opponent_abb duration date time',
    explanation: `Ex : bcl sch wk1 INQ VI 16/24 12.01.2021 13:30\n\nDate formats\ndd/mm/yyyy\ndd-mm-yyyy\ndd.mm.yyyy\n\nTime Format\n(HH:MM)\n\nProcedure
    Step 1 : WeekNo like wk1, wk2
    Step 2 : Clan Abb
    Step 3 : Opponent Abb
    Step 4 : Duration (prep/battle)
    Step 5 : Date
    Step 6 : Time
Note - The steps must be in above order in single line, no line break!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const resources = require('../bclutility/resourcesUtils');
        const week = resources.WEEK_ABBS;
        const logo = {
            'CHAMPIONS': 'https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612',
        };
        const color = {
            'CHAMPIONS': '#f2961e',
        }
        
        async function checkClan(abb) {
            const abbs = fs.readFileSync('./bcl-commands/abbs.json');
            var JSobject = JSON.parse(abbs);
            JSobject = JSobject.values;
            var abbData = [];
            for (var i = 0; i < JSobject.length; i++) {
                if (JSobject[i][2] === abb) {
                    const findTeam = await repsSchema.findOne({ abb: abb });
                    if (findTeam.teamName === "NONE") {
                        abbData = JSobject[i];
                    } else {
                        abbData.push(JSobject[i][0], findTeam.teamName, JSobject[i][2], JSobject[i][3])
                    }
                }
            }
            return abbData;
        }
        async function checkExisting(week, div, clan, opponent) {
            // const checkExistingSch1 = await scheduleSchema.findOne({ week: week, div: div, "clan.abb": clan, "opponent.abb": opponent });
            // const checkExistingSch2 = await scheduleSchema.findOne({ week: week, div: div, "clan.abb": opponent, "opponent.abb": clan });
            const checkIndividualExisting1 = await scheduleSchema.findOne({ week: week, div: div, "clan.abb": { $in: [opponent, clan] } });
            const checkIndividualExisting2 = await scheduleSchema.findOne({ week: week, div: div, "opponent.abb": { $in: [opponent, clan] } });
            if (checkIndividualExisting1 || checkIndividualExisting2)
                return true;
            else
                return false;
        }

        function refer(date) {
            if (!(date.indexOf("/") < 0)) {
                let string = stringToDate(date, "dd/MM/yyyy", "/");
                return string;
            }
            if (!(date.indexOf("-") < 0)) {
                let string = stringToDate(date, "dd-MM-yyyy", "-");
                return string;
            }
            if (!(date.indexOf(".") < 0)) {
                let string = stringToDate(date, "dd.MM.yyyy", ".");
                return string;
            }
        }
        function stringToDate(_date, _format, _delimiter) {

            var formatLowerCase = _format.toLowerCase();
            var formatItems = formatLowerCase.split(_delimiter);
            var dateItems = _date.split(_delimiter);
            var monthIndex = formatItems.indexOf("mm");
            var dayIndex = formatItems.indexOf("dd");
            var yearIndex = formatItems.indexOf("yyyy");
            var month = parseInt(dateItems[monthIndex]);
            month -= 1;
            var formatedDate = new Date(dateItems[yearIndex], month, `${parseInt(dateItems[dayIndex], 10) + 1}`);
            return formatedDate;
        }

        async function updateIndWarRecordWarID(abb, warID) {
            const individualWarRecordData = await individualWarRecord.findOne({ abb: abb });
            if (individualWarRecordData) {
                for (const wk in individualWarRecordData.opponent) {
                    if (wk === week[args[0].toUpperCase()])
                        individualWarRecordData.opponent[wk].warID = warID
                }
                await individualWarRecordData.markModified("opponent");
                await individualWarRecordData.save()
                    .then((indWar) => console.log(indWar));
            }
        }

        var channelPermissions = require('./live-ForUseChannels').scheduleChannel;

        if (channelPermissions.includes(message.channel.id) || message.member.hasPermission('MANAGE_GUILD')) {
            if (!week[args[0].toUpperCase()])
                return message.reply(`Invalid week prefix **${args[0].toUpperCase()}**!`);

            const clan = await checkClan(args[1].toUpperCase())
            const opponent = await checkClan(args[2].toUpperCase());
            if (clan.length === 0)
                return message.reply(`Invalid clan abb **${args[1].toUpperCase()}**!`);
            if (opponent.length === 0)
                return message.reply(`Invalid opponent abb **${args[2].toUpperCase()}**!`);

            // check both team belong to same division (pending)
            if (clan[3] != opponent[3])
                return message.reply(`Division is not same for both team.\nPlease check again and try!`);

            // checking existing scheduled war which couldn't be overriden
            if (await checkExisting(week[args[0].toUpperCase()], clan[3], clan[2], opponent[2]))
                return message.reply(`War between **${clan[1]}** and **${opponent[1]}** is already scheduled for **${week[args[0].toUpperCase()]}** | **${clan[3]}**\nOR\nTeam is in other war!(Trying deleting your warID)`);

            // after all checking let's schedule a war
            // generate a new warID
            const warID = await scheduleSchema.find().sort({ _id: -1 }).limit(1)

            // find reps and authorize
            const reps = await repsSchema.find({ abb: { $in: [clan[2], opponent[2]] } });
            var authRep = false;
            reps.forEach(rep => {
                if (rep.rep1_dc === message.author.id || rep.rep2_dc === message.author.id)
                    authRep = true;
            })
            if (!authRep && !message.member.hasPermission('MANAGE_GUILD')) // to be checked later
                return message.reply(`You aren't authorized rep for any of **${clan[2]}** or **${opponent[2]}** to schedule the war!`);
            var approvedBy;
            reps.forEach(rep => {
                if (rep.rep1_dc != message.author.id && rep.rep2_dc != message.author.id) {
                    approvedBy = rep.rep1_dc;
                }
            })
            let dateOfWar = refer(args[4]); // conversion of date to Day and date format

            //confirmation of given information
            const confirmEmbed = new Discord.MessageEmbed()
                .setColor('#99a9d1')
                .setAuthor('By BCL Technical')
                .setTitle('Please confirm the following information!!')
                .setDescription("```" + `Division - ${clan[3]}\nWeek - ${week[args[0].toUpperCase()]}\nClan - ${clan[2]} | ${clan[0]} | ${clan[1]}\nOpponent - ${opponent[2]} | ${opponent[0]} | ${opponent[1]}\nTime(EST) - ${args[5].toUpperCase()}\n\nDo you want to schedule this war?\n✅ - Yes\n❎ - No\n\nConfirm within 60 secs!!` + "```")
                .setFooter(`React within 60s`)
                .setTimestamp()
            var collect = await message.channel.send(confirmEmbed);
            await collect.react('✅');
            await collect.react('❎');
            const filter = (reaction, user) => {
                return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            var collector = await collect.createReactionCollector(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            });
            if (!(collector))
                await collect.delete();
            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.name === '✅') { // if confirmed
                    await collect.delete();
                    const newWar = new scheduleSchema({
                        warID: warID[0].warID + 1,
                        week: week[args[0].toUpperCase()],
                        div: clan[3],
                        duration: args[3].toUpperCase(),
                        dow: dateOfWar,
                        tow: args[5].toUpperCase(),
                        status: 'ACTIVE',
                        scheduledBy: message.author.id,
                        approvedBy: approvedBy,
                        clan: {
                            abb: clan[2],
                            tag: clan[0],
                        },
                        opponent: {
                            abb: opponent[2],
                            tag: opponent[0],
                        }
                    })

                    await newWar.save()
                        .then((war) => console.log(war));
                    await updateIndWarRecordWarID(clan[2], warID[0].warID + 1);
                    await updateIndWarRecordWarID(opponent[2], warID[0].warID + 1);

                    dateOfWar = dateOfWar.toISOString().split('T')[0];
                    showEmbed(message, args,
                        {
                            color: color[clan[3]],
                            warID: warID[0].warID + 1,
                            thumbnail: logo[clan[3]],
                            week: week[args[0].toUpperCase()],
                            div: clan[3],
                            clan: `${clan[2]} | ${clan[0]} | ${clan[1]}`,
                            opponent: `${opponent[2]} | ${opponent[0]} | ${opponent[1]}`,
                            dow: `${dateOfWar}`,
                            tow: args[5].toUpperCase(),
                            duration: args[3].toUpperCase(),
                            scheduledBy: message.author.id,
                            approvedBy: approvedBy
                        },
                        'schedule'
                    );
                } else { // if rejected
                    await collect.delete();
                    message.reply(`Schedule rejected!` + "```" + `${week[args[0].toUpperCase()]} | ${clan[3]}\n\n${clan[2]} | ${clan[0]} | ${clan[1]}\nvs\n${opponent[2]} | ${opponent[0]} | ${opponent[1]}` + "```");
                }
            })
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}