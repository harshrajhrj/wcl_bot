const scheduleSchema = require("./war&schedule&standings/scheduleSchema")
const repsSchema = require('./repsSchema/repsSchema');
const fs = require('fs');
const Discord = require('discord.js');
const showEmbed = require('./pre-showEmbed');

module.exports = {
    name: 'schedule-lock',
    aliases: ['schl'],
    description: 'Allows you to log a scheduled war',
    args: true,
    length: 7,
    category: 'representative',
    missing: ['`week_no`, ', '`div_prefix`, ', '`clan_abb`, ', '`opponent_abb`, ', '`duration`, ', '`date`, ', '`time`'],
    usage: 'week_no div_prefix clan_abb opponent_abb duration date time',
    explanation: `Ex : wcl sch wk1 CS INQ VI 16/24 12.01.2021 13:30\n\nDivision Prefix\n\nH - Heavy Weight\nF - Flight\nCL - Classic\nL - Light Weight\nE - Elite\nB - Blockage\nCS - Champions(Esports)\n\nDate formats\ndd/mm/yyyy\ndd-mm-yyyy\ndd.mm.yyyy\n\nTime Format\n(HH:MM)\n\nProcedure
    Step 1 : WeekNo like wk1, wk2
    Step 2 : Division_prefix
    Step 3 : Clan Abb
    Step 4 : Opponent Abb
    Step 5 : Duration (prep/battle)
    Step 6 : Date
    Step 7 : Time
Note - The steps must be in above order in single line, no line break!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const week = {
            'WK1': 'WK1',
            'WK2': 'WK2',
            'WK3': 'WK3',
            'WK4': 'WK4',
            'WK5': 'WK5',
            'WK6': 'WK6',
            'WK7': 'WK7',
            'WK8': 'WK8',
            'WK9': 'WK9',
            'WK10': 'WK10',
            'WK11': 'WK11',
            'R128': 'R128',
            'R64': 'R64',
            'R32': 'R32',
            'WC': 'WC',
            'QF': 'QF',
            'SF': 'SF',
            'F': 'F',
        };
        const logo = {
            'H': 'https://cdn.discordapp.com/attachments/995764484218028112/995764719791112252/WCL_Heavy.png?width=539&height=612',
            'F': 'https://cdn.discordapp.com/attachments/995764484218028112/995764818525044746/WCL_Flight.png?width=530&height=612',
            'E': 'https://cdn.discordapp.com/attachments/995764484218028112/995765404565782609/WCL_ELITE.png?width=514&height=612',
            'B': 'https://cdn.discordapp.com/attachments/995764484218028112/995765525001011310/WCL_Blockage-.png?width=435&height=613',
            'CS': 'https://cdn.discordapp.com/attachments/995764484218028112/995764652418023444/WCL_Champions.png?width=548&height=612',
            'L': 'https://cdn.discordapp.com/attachments/995764484218028112/995764946975596564/WCl_Light_Division-.png?width=548&height=612',
            'CL': 'https://cdn.discordapp.com/attachments/995764484218028112/995765980972195850/WCL_Classic-.png?width=548&height=612'
        };
        const color = {
            'H': '#008dff',
            'F': '#3f1f8b',
            'E': '#a40ae7',
            'B': '#fc3902',
            'CS': '#ffb014',
            'CL': '#276cc1',
            'L': '#52d600'
        }
        const divPrefix = {
            'H': 'HEAVY',
            'F': 'FLIGHT',
            'E': 'ELITE',
            'B': 'BLOCKAGE',
            'CS': 'CHAMPIONS',
            'CL': 'CLASSIC',
            'L': 'LIGHT'
        }
        const stringDiv = {
            'HEAVY': 'HEAVY',
            'FLIGHT': 'FLIGHT',
            'ELITE': 'ELITE',
            'BLOCKAGE': 'BLOCKAGE',
            'CHAMPIONS': 'CHAMPIONS',
            'CLASSIC': 'CLASSIC',
            'LIGHT': 'LIGHT'
        }
        function checkClan(abb) {
            const abbs = fs.readFileSync('./commands/abbs.json');
            var JSobject = JSON.parse(abbs);
            var abbData = [];
            JSobject.values.forEach(clan => {
                if (clan[2] === abb)
                    abbData = clan;
            });
            return abbData;
        }
        async function checkExisting(week, div, clan, opponent) {
            const checkExistingSch1 = await scheduleSchema.findOne({ week: week, div: div, "clan.abb": clan, "opponent.abb": opponent });
            const checkExistingSch2 = await scheduleSchema.findOne({ week: week, div: div, "clan.abb": opponent, "opponent.abb": clan });
            if (checkExistingSch1 || checkExistingSch2)
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
            var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
            return formatedDate;
        }

        var channelPermissions = [
            '1011618454735966268',
            '1011622480600903690'
        ]
        if (channelPermissions.includes(message.channel.id) || message.member.hasPermission('MANAGE_GUILD')) {
            if (!week[args[0].toUpperCase()])
                return message.reply(`Invalid week prefix **${args[0].toUpperCase()}**!`);
            if (!divPrefix[args[1].toUpperCase()])
                return message.reply(`Invalid division prefix **${args[1].toUpperCase()}**!`);
            const clan = checkClan(args[2].toUpperCase())
            const opponent = checkClan(args[3].toUpperCase());
            if (clan.length === 0)
                return message.reply(`Invalid clan abb **${args[2].toUpperCase()}**!`);
            if (opponent.length === 0)
                return message.reply(`Invalid opponent abb **${args[3].toUpperCase()}**!`);

            // checking existing scheduled war which couldn't be overriden
            if (await checkExisting(week[args[0].toUpperCase()], divPrefix[args[1].toUpperCase()], clan[2], opponent[2]))
                return message.reply(`War between **${clan[1]}** and **${opponent[1]}** is already scheduled for **${week[args[0].toUpperCase()]}** | **${divPrefix[args[1].toUpperCase()]}**`);

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
            let dateOfWar = refer(args[5]); // conversion of date to Day and date format

            //confirmation of given information
            const confirmEmbed = new Discord.MessageEmbed()
                .setColor('#99a9d1')
                .setAuthor('By WCL Technical')
                .setTitle('Please confirm the following information!!')
                .setDescription("```" + `Division - ${divPrefix[args[1].toUpperCase()]}\nWeek - ${week[args[0].toUpperCase()]}\nClan - ${clan[2]} | ${clan[0]} | ${clan[1]}\nOpponent - ${opponent[2]} | ${opponent[0]} | ${opponent[1]}\nTime(EST) - ${args[6].toUpperCase()}\n\nDo you want to schedule this war?\n✅ - Yes\n❎ - No\n\nConfirm within 60 secs!!` + "```")
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
                        div: divPrefix[args[1].toUpperCase()],
                        duration: args[4].toUpperCase(),
                        dow: dateOfWar,
                        tow: args[6].toUpperCase(),
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
                    dateOfWar = dateOfWar.toISOString().split('T')[0];
                    showEmbed(message, args,
                        {
                            color: color[args[1].toUpperCase()],
                            warID: warID[0].warID + 1,
                            thumbnail: logo[args[1].toUpperCase()],
                            week: week[args[0].toUpperCase()],
                            div: divPrefix[args[1].toUpperCase()],
                            clan: `${clan[2]} | ${clan[0]} | ${clan[1]}`,
                            opponent: `${opponent[2]} | ${opponent[0]} | ${opponent[1]}`,
                            dow: `${dateOfWar}T${args[6].toUpperCase()}:00`,
                            tow: args[6].toUpperCase(),
                            duration: args[4].toUpperCase(),
                            scheduledBy: message.author.id,
                            approvedBy: approvedBy
                        },
                        'schedule'
                    );
                } else { // if rejected
                    await collect.delete();
                    message.reply(`Schedule rejected!` + "```" + `${week[args[0].toUpperCase()]} | ${divPrefix[args[1].toUpperCase()]}\n\n${clan[2]} | ${clan[0]} | ${clan[1]}\nvs\n${opponent[2]} | ${opponent[0]} | ${opponent[1]}` + "```");
                }
            })
        }
    }
}