const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
    name: 'addroster',
    aliases: ['ars'],
    args: true,
    length: 3,
    category: 'league admins',
    description: 'Helps adding roster',
    missing: ['`clanAbb`, ', '`clanTag`, ', '`rosterLink`'],
    usage: 'clanAbb clanTag rosterLink(gSheet link)',
    explanation: 'bcl ars XYZ clanTag https://docs.google.com/spreadsheets/d/..../',
    execute: async (message, args) => {
        const options = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };

        const notForUseChannels = require('./live-notForUseChannels');

        // console.log(message.member.permissions.bitfield === 2147483647);
        //message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403'
        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_GUILD')) {
                await changeRoster();
                return;
            } else {
                message.reply(`You can't use this command!`);
            }
        } catch (err) {
            console.log(err.message);
            message.reply(err.message);
        }

        async function changeRoster() {
            const roster = {
                'CHAMPIONS': ['Champions', 2, 7]
            };
            try {
                if (args[0].toUpperCase().length > 4) {
                    message.reply("Make sure clan abb length shouldn't exceed 4 letters");
                    return;
                }
                const clanData = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[1].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);
                if (clanData.status === 200) {
                    var rosterSchema;
                    const new_data = args[2].split('/');
                    const clanNameId = await clanData.json();
                    let data;
                    let fresh = [];
                    var division;
                    if (new_data.length === 1) {
                        data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[0]}/values/ROSTER!C7:C?majorDimension=ROWS&key=API_KEY`, options);
                        // var div = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[0]}/values/ROSTER!C2:E2?majorDimension=ROWS&key=API_KEY`, options);
                        // if (div.status === 200) {
                        //     div = await div.json();
                        //     div = div.values[0];
                        //     div = div.find(function (eachVal) { return eachVal != "" ? eachVal : null });
                        //     div = div.replace(/[\t\n\r]/gm, '');
                        var div = "CHAMPIONS";
                        var DivisionChecking = Object.keys(roster);
                        DivisionChecking.forEach(key => {
                            if (key.indexOf(div.toUpperCase()) != -1) {
                                division = roster[key];
                                return;
                            }
                        })
                        if (!division)
                            return message.reply(`Incorrect division ${division} found in roster!`);
                        rosterSchema = require(`./rosterSchemas/rosterSchema${division[0]}`);
                        // }
                    }
                    else if (new_data.length > 1) {
                        data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[5]}/values/ROSTER!C7:C?majorDimension=ROWS&key=API_KEY`, options);
                        // var div = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[5]}/values/ROSTER!C2:E2?majorDimension=ROWS&key=API_KEY`, options);
                        // if (div.status === 200) {
                        //     div = await div.json();
                        //     console.log(div);
                        //     div = div.values[0];
                        //     div = div.find(function (eachVal) { return eachVal != "" ? eachVal : null });
                        //     div = div.replace(/[\t\n\r]/gm, '');
                        var div = "CHAMPIONS";
                        var DivisionChecking = Object.keys(roster);
                        DivisionChecking.forEach(key => {
                            if (key.indexOf(div.toUpperCase()) != -1) {
                                division = roster[key];
                                return;
                            }
                        })
                        if (!division)
                            return message.reply(`Incorrect division ${division} found in roster!`);
                        rosterSchema = require(`./rosterSchemas/rosterSchema${division[0]}`);
                        // }
                    }
                    else {
                        message.reply(`Improper format of sheet link!`);
                    }
                    if (data.status === 400) {
                        message.reply(`Invalid range or tab!`);
                    }
                    else if (data.status === 403) {
                        message.reply(`Sheet link or ID(<${args[1]}>) is private!`);
                    }
                    else if (data.status === 404) {
                        message.reply(`Sheet not found or it's in owner's trash!`);
                    }
                    else if (data.status === 200) {
                        const convert = await data.json();
                        if (!Object.keys(convert).includes('values'))
                            return message.reply('No roster data!');
                        if (convert.values.find(function (row) { return row.length === 1; })) {
                            convert.values.forEach(data => {
                                if (!(data[0] === undefined || data[0] === ' '))/*condition to eliminate blank values*/ {
                                    const u1 = data[0].replace(/[\t\n\r]/gm, '')
                                    const u2 = u1.replace(/\s/g, '');
                                    const u3 = decodeURIComponent(u2).replace(/[^\x00-\x7F]/g, "")
                                    fresh.push([u3.toUpperCase(), '']);
                                }
                            });
                            if (fresh.length <= division[2]) {
                                const abbCollection = require('./abbSchema/registeredAbbs');
                                const repCollection = require('./repsSchema/repsSchema');
                                const backUpRosterSchema = require('./war&schedule&standings/backUp');
                                var rosterData = await rosterSchema.findOne({ abb: args[0].toUpperCase() });
                                if (rosterData) {
                                    // var values = rosterData.players;
                                    if (fresh.length < division[2]) {
                                        rosterData.additionSpot = 'Yes';
                                    }
                                    else {
                                        rosterData.additionSpot = 'No';
                                    }

                                    // storing roster as backup
                                    const backUpRosterSchemaData = new backUpRosterSchema({
                                        type: 'ROSTER',
                                        abb: args[0].toUpperCase(),
                                        history: rosterData
                                    })

                                    await backUpRosterSchemaData.save()
                                        .then((data) => console.log(data));

                                    rosterData.div = division[0];
                                    rosterData.clanTag = args[1].toUpperCase();
                                    rosterData.rosterSize = fresh.length;
                                    rosterData.players = fresh;
                                    rosterData.additionStatusLimit = division[1];
                                    rosterData.additionStatus = 'Yes';
                                    rosterData.additionRecord = [['N/A', 'N/A', 'N/A', 'N/A']];
                                    rosterData.removalRecord = [['N/A', 'N/A', 'N/A', 'N/A']];
                                    const abbUpdate = await abbCollection.findOne({ abb: args[0].toUpperCase() })
                                    abbUpdate.clanTag = args[1].toUpperCase();
                                    abbUpdate.clanName = clanNameId.name;
                                    const repUpdate = await repCollection.findOne({ abb: args[0].toUpperCase() })
                                    repUpdate.clanTag = args[1].toUpperCase();
                                    repUpdate.clanName = clanNameId.name;
                                    await repUpdate.save();
                                    await abbUpdate.save();
                                    await rosterData.save().then((data) => console.log(data)).catch((err) => console.log(err.message));
                                    await message.reply(`Succesfully changed roster!`).then((msg) => msg.react('✅'))
                                } else {
                                    // var values = rosterData.players;
                                    const abbCollection = require('./abbSchema/registeredAbbs');
                                    const abbCheck = await abbCollection.findOne({ abb: args[0].toUpperCase() })
                                    if (abbCheck) {
                                        message.reply(`**${args[0].toUpperCase()}** already exists for ${args[1].toUpperCase()} : ${clanNameId.name} | Division : ${abbCheck.div}`);
                                        return;
                                    } else {
                                        const repCollection = require('./repsSchema/repsSchema');
                                        const substitutionSchema = require('./subTracking/substitutionSchema');
                                        var additionSpot;
                                        if (fresh.length < division[2]) {
                                            additionSpot = 'Yes';
                                        }
                                        else {
                                            additionSpot = 'No';
                                        }
                                        const rosterData = new rosterSchema({
                                            abb: args[0].toUpperCase(),
                                            div: division[0],
                                            clanTag: args[1].toUpperCase(),
                                            rosterSize: fresh.length,
                                            players: fresh,
                                            additionStatusLimit: division[1],
                                            additionStatus: 'Yes',
                                            additionSpot: additionSpot
                                        })
                                        const newAbb = new abbCollection({
                                            div: division[0],
                                            abb: args[0].toUpperCase(),
                                            clanTag: args[1].toUpperCase(),
                                            clanName: clanNameId.name
                                        })
                                        const newReps = new repCollection({
                                            div: division[0],
                                            abb: args[0].toUpperCase(),
                                            clanTag: args[1].toUpperCase(),
                                            clanName: clanNameId.name
                                        })
                                        await newReps.save().then(async (data) => {
                                            var substitutionSchemaIS = new substitutionSchema({
                                                refer: data._id,
                                                abb: args[0].toUpperCase()
                                            })
                                            await substitutionSchemaIS.save();
                                        });
                                        await newAbb.save();
                                        await rosterData.save().then((data) => console.log(data)).catch((err) => console.log(err.message));
                                        await message.reply(`Succesfully added roster!`).then((msg) => msg.react('✅'))
                                    }
                                }
                            }
                            else {
                                message.reply(`Roster has extra player(s) than that of required as per division!!`);
                            }
                        } else {
                            message.reply("The import_range must have two column containing only #players_tags and DC_ID.");
                        }
                    }
                } else {
                    message.reply("Bad tag " + args[1].toUpperCase());
                }
            } catch (err) {
                console.log(err);
                message.reply(err.message);
            }
        }
    }
}