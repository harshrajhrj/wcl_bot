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
    explanation: 'wcl ars XYZ clanTag https://docs.google.com/spreadsheets/d/..../',
    execute: async (message, args) => {
        const options = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };
        //message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403'
        try {
            if (message.member.hasPermission('MANAGE_GUILD')) {
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
                'HEAVY WEIGHT': ['Heavy', 25, 100],
                'FLIGHT': ['Flight', 20, 70],
                'ELITE': ['Elite', 20, 50],
                'BLOCKAGE': ['Blockage', 20, 40],
                'LIGHT WEIGHT': ['Light', 20, 50],
                'CLASSIC': ['Classic', 20, 50],
                'CHAMPIONS': ['Champions', 3, 10]
            };
            try {
                if (args[0].toUpperCase().length > 4) {
                    message.reply("Make sure clan abb length shouldn't exceed 4 letters");
                    return;
                }
                const clanData = await fetch(`https://api.clashofstats.com/clans/${args[1].toUpperCase().slice(1)}`, options);
                if (clanData.status === 200) {
                    var rosterSchema;
                    const new_data = args[2].split('/');
                    const clanNameId = await clanData.json();
                    let data;
                    let fresh = [];
                    var division;
                    if (new_data.length === 1) {
                        data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[0]}/values/ROSTER!B6:C?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                        var div = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[0]}/values/ROSTER!C2:E2?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                        if (div.status === 200) {
                            div = await div.json();
                            div = div.values[0];
                            div = div.find(function (eachVal) { return eachVal != "" ? eachVal : null });
                            div = div.replace(/[\t\n\r]/gm, '');
                            var DivisionChecking = Object.keys(roster);
                            DivisionChecking.forEach(key => {
                                if (key.indexOf(div.toUpperCase()) != -1) {
                                    division = roster[key];
                                    return;
                                }
                            })
                            rosterSchema = require(`./rosterSchemas/rosterSchema${division[0]}`);
                        }
                    }
                    else if (new_data.length > 1) {
                        data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[5]}/values/ROSTER!B6:C?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                        var div = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[5]}/values/ROSTER!C2:E2?majorDimension=ROWS&key=AIzaSyDUq4w3z35sS28BKWLdXSh32hlwUDDaD1Y`, options);
                        if (div.status === 200) {
                            div = await div.json();
                            div = div.values[0];
                            div = div.find(function (eachVal) { return eachVal != "" ? eachVal : null });
                            div = div.replace(/[\t\n\r]/gm, '');
                            var DivisionChecking = Object.keys(roster);
                            DivisionChecking.forEach(key => {
                                if (key.indexOf(div.toUpperCase()) != -1) {
                                    division = roster[key];
                                    return;
                                }
                            })
                            rosterSchema = require(`./rosterSchemas/rosterSchema${division[0]}`);
                        }
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
                        if (convert.values.find(function (row) { return row.length > 1; })) {
                            convert.values.forEach(data => {
                                if (!(data[1] === undefined || data[1] === ' '))/*condition to eliminate blank values*/ {
                                    fresh.push([(data[1].trim()).toUpperCase(), data[0]]);
                                }
                            });
                            if (fresh.length <= division[2]) {
                                const abbCollection = require('./abbSchema/registeredAbbs');
                                const repCollection = require('./repsSchema/repsSchema');
                                var rosterData = await rosterSchema.findOne({ abb: args[0].toUpperCase() });
                                if (rosterData) {
                                    // var values = rosterData.players;
                                    if (fresh.length < division[2]) {
                                        rosterData.additionSpot = 'Yes';
                                    }
                                    else {
                                        rosterData.additionSpot = 'No';
                                    }
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
                                        await newReps.save();
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
                console.log(err.message);
                message.reply(err.message);
            }
        }
    }
}