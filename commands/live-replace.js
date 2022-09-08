//to change abb and clan tag
//updating clan abb changes take place in reps collection(matching through division), division-wise collection(matching through division), abbs collection(matching through division)
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {
    name: 'replace',
    aliases: ['replace'],
    description: 'Replace a clan_abb/clan_tag/sec_clan_tag/team_name/swap clans',
    args: true,
    length: 3,
    category: 'Admins',
    usage: 'type clanAbb detail',
    missing: ['`type`, ', '`clanAbb`, ', '`detail`'],
    explanation: 'Ex : wcl replace abb abc xyz\n\nWhile using type- abb\n@param2 and 3 are old and new clanAbb\nWhile using type- ct\n@param2 and 3 are clanAbb and new clanTag\nWhile using type- sct\n@param2 and 3 are clanAbb and new secondaryclanTag\nWhile using type- tname\n@param2 and 3 are clanAbb and new teamName\nWhile using type- swap\n@param2 and 3 are clanAbb and current secondary clan tag',
    execute: async (message, args) => {

        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]

        var ABBSobject = fs.readFileSync('./commands/abbs.json');
        var abbs = JSON.parse(ABBSobject);

        async function abbCheck(abb) {
            let division = '';
            abbs.values.forEach(data => {
                if (data[2] === abb) {
                    division = data[3];
                }
            });
            return division;
        }

        async function updateAbbsCollection(division) {
            try {
                const abbSchema = require(`./abbSchema/registeredAbbs`);
                if (args[0].toUpperCase() === 'ABB') {
                    // const abbDataAdd = await abbSchema.findOneAndUpdate(
                    //     { div: division },
                    //     {
                    //         $addToSet: {
                    //             'values.$[element]': args[2].toUpperCase()
                    //         }
                    //     },
                    //     { arrayFilters: [{ element: args[1].toUpperCase() }] }
                    // );
                    // const abbDataRemove = await abbSchema.findOneAndUpdate(
                    //     { div: division },
                    //     {
                    //         $pull: {
                    //             'values.$[element]': args[1].toUpperCase()
                    //         },
                    //     },
                    //     { arrayFilters: [{ element: args[1].toUpperCase() }] }
                    // );
                    await abbSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        { abb: args[2].toUpperCase() }
                    ).then((data) => console.log(data));
                }
                else if (args[0].toUpperCase() === 'CT') {
                    const options = {
                        'json': true,
                        'Accept': 'application/json',
                        'method': 'get',
                        'muteHttpExceptions': true
                    };

                    const fetchClan = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[2].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);

                    if (fetchClan.status === 404) {
                        message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                        return;
                    }
                    else if (fetchClan.status === 503) {
                        message.reply(`Replacing paused due to maintenance break!`);
                        return;
                    }
                    const clanData = await fetchClan.json();

                    await abbSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            clanTag: args[2].toUpperCase(),
                            clanName: clanData.name
                        }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'SCT') {
                    const options = {
                        'json': true,
                        'Accept': 'application/json',
                        'method': 'get',
                        'muteHttpExceptions': true
                    };

                    const fetchClan = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[2].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);

                    if (fetchClan.status === 404) {
                        message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                        return;
                    }
                    else if (fetchClan.status === 503) {
                        message.reply(`Replacing paused due to maintenance break!`);
                        return;
                    }

                    await abbSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            secondaryClanTag: args[2].toUpperCase(),
                        }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'TNAME') {
                    await abbSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        { teamName: args.slice(2).join(' ').toUpperCase() }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'SWAP') {
                    const oldData = await abbSchema.findOne({ abb: args[1].toUpperCase() });
                    var primaryClan = oldData.clanTag;
                    var secClan = oldData.secondaryClanTag;
                    await abbSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            clanTag: secClan,
                            secondaryClanTag: primaryClan
                        }
                    ).then((data) => console.log(data));
                }
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function updateRepsCollection(division) {
            try {
                const repSchema = require('./repsSchema/repsSchema');
                if (args[0].toUpperCase() === 'ABB') {
                    await repSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        { abb: args[2].toUpperCase() }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'CT') {
                    const options = {
                        'json': true,
                        'Accept': 'application/json',
                        'method': 'get',
                        'muteHttpExceptions': true
                    };

                    const fetchClan = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[2].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);

                    if (fetchClan.status === 404) {
                        message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                        return;
                    }
                    else if (fetchClan.status === 503) {
                        message.reply(`Replacing paused due to maintenance break!`);
                        return;
                    }
                    const clanData = await fetchClan.json();
                    await repSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            clanTag: args[2].toUpperCase(),
                            clanName: clanData.name
                        }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'SCT') {
                    const options = {
                        'json': true,
                        'Accept': 'application/json',
                        'method': 'get',
                        'muteHttpExceptions': true
                    };

                    const fetchClan = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[2].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);

                    if (fetchClan.status === 404) {
                        message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                        return;
                    }
                    else if (fetchClan.status === 503) {
                        message.reply(`Replacing paused due to maintenance break!`);
                        return;
                    }

                    await repSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            secondaryClanTag: args[2].toUpperCase(),
                        }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'TNAME') {
                    await repSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        { teamName: args.slice(2).join(' ').toUpperCase() }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'SWAP') {
                    const oldData = await repSchema.findOne({ abb: args[1].toUpperCase() });
                    var primaryClan = oldData.clanTag;
                    var secClan = oldData.secondaryClanTag;
                    await repSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            clanTag: secClan,
                            secondaryClanTag: primaryClan
                        }
                    ).then((data) => console.log(data));
                }
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function divRosterCollection(division) {
            try {
                var collectionFromDivision = {
                    'HEAVY': 'Heavy',
                    'FLIGHT': 'Flight',
                    'ELITE': 'Elite',
                    'BLOCKAGE': 'Blockage',
                    'CHAMPIONS': 'Champions',
                    'CLASSIC': 'Classic',
                    'LIGHT': 'Light'
                };

                if (args[0].toUpperCase() === 'ABB') {
                    var rosterSchema = require(`./rosterSchemas/rosterSchema${collectionFromDivision[division]}`);

                    await rosterSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        { abb: args[2].toUpperCase() }
                    ).then((data) => console.log(data));
                }
                else if (args[0].toUpperCase() === 'CT') {
                    var rosterSchema = require(`./rosterSchemas/rosterSchema${collectionFromDivision[division]}`);

                    const options = {
                        'json': true,
                        'Accept': 'application/json',
                        'method': 'get',
                        'muteHttpExceptions': true
                    };

                    const fetchClan = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[2].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);

                    if (fetchClan.status === 404) {
                        message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                        return;
                    }
                    else if (fetchClan.status === 503) {
                        message.reply(`Replacing paused due to maintenance break!`);
                        return;
                    }

                    await rosterSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            clanTag: args[2].toUpperCase(),
                        }
                    ).then((data) => console.log(data));
                } else if (args[0].toUpperCase() === 'SWAP') {
                    var rosterSchema = require(`./rosterSchemas/rosterSchema${collectionFromDivision[division]}`);

                    const abbSchema = require(`./abbSchema/registeredAbbs`);

                    const oldData = await abbSchema.findOne({ abb: args[1].toUpperCase() });
                    // var primaryClan = oldData.clanTag;
                    var secClan = oldData.clanTag;
                    await rosterSchema.findOneAndUpdate(
                        { abb: args[1].toUpperCase() },
                        {
                            clanTag: secClan
                        }
                    ).then((data) => console.log(data));
                }
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function updateIndWarRecord(division) {
            const individualWarRecord = require('./war&schedule&standings/individualWarRecord');
            if (args[0].toUpperCase() === 'ABB') {
                await individualWarRecord.findOneAndUpdate(
                    { abb: args[1].toUpperCase() },
                    { abb: args[2].toUpperCase() }
                ).then((data) => console.log(data));
            } else if (args[0].toUpperCase() === 'CT') {

                const options = {
                    'json': true,
                    'Accept': 'application/json',
                    'method': 'get',
                    'muteHttpExceptions': true
                };

                const fetchClan = await fetch(`https://api.clashofstats.com/clans/${decodeURIComponent(args[2].toUpperCase().slice(1)).replace(/[^\x00-\x7F]/g, "")}`, options);

                if (fetchClan.status === 404) {
                    message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                    return;
                }
                else if (fetchClan.status === 503) {
                    message.reply(`Replacing paused due to maintenance break!`);
                    return;
                }

                await individualWarRecord.findOneAndUpdate(
                    { abb: args[1].toUpperCase() },
                    {
                        clanTag: args[2].toUpperCase(),
                    }
                ).then((data) => console.log(data));

                const findDivClans = await individualWarRecord.find({ div: division });
                for (var i = 0; i < findDivClans.length; i++) {
                    for (const week in findDivClans[i].opponent) {
                        if (findDivClans[i].opponent[week].abb === args[1].toUpperCase()) {
                            findDivClans[i].opponent[week].clanTag = args[2].toUpperCase();
                        }
                    }
                    await findDivClans[i].markModified("opponent");
                    await findDivClans[i].save()
                        .then((record) => console.log(record));
                }
            } else if (args[0].toUpperCase() === 'SWAP') {

                const abbSchema = require(`./abbSchema/registeredAbbs`);

                const oldData = await abbSchema.findOne({ abb: args[1].toUpperCase() });
                // var primaryClan = oldData.clanTag;
                var secClan = oldData.clanTag;
                await individualWarRecord.findOneAndUpdate(
                    { abb: args[1].toUpperCase() },
                    {
                        clanTag: secClan
                    }
                ).then((data) => console.log(data));

                const findDivClans = await individualWarRecord.find({ div: division });
                for (var i = 0; i < findDivClans.length; i++) {
                    for (const week in findDivClans[i].opponent) {
                        if (findDivClans[i].opponent[week].abb === args[1].toUpperCase()) {
                            findDivClans[i].opponent[week].clanTag = secClan;
                        }
                    }
                    await findDivClans[i].markModified("opponent");
                    await findDivClans[i].save()
                        .then((record) => console.log(record));
                }
            }
        }

        async function updateSubsRecord(division) {
            const subRecord = require('./subTracking/substitutionSchema');
            if (args[0].toUpperCase() === 'ABB') {
                await subRecord.findOneAndUpdate(
                    { abb: args[1].toUpperCase() },
                    { abb: args[2].toUpperCase() }
                ).then((data) => console.log(data));
            }
        }

        if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {
            if (args[0].toUpperCase() === 'ABB') { //abb change
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }
                let newDivision = await abbCheck(args[2].toUpperCase());
                if (newDivision != '') {
                    message.reply(`Abb : **${args[2].toUpperCase()}** already exists!\nPlease choose another new clanAbb!`);
                    return;
                }

                if (args[2].toUpperCase().length > 4) {
                    message.reply(`Abb : **${args[2].toUpperCase()}** max character length exceeds 4!`);
                    return;
                }

                //Updating abbs collection
                await updateAbbsCollection(division);
                //Updating abbs collection ended

                //Updating reps collection
                await updateRepsCollection(division);
                //Updating reps collection ended

                //Updating division-wise roster collection
                await divRosterCollection(division);
                //Updating division-wise roster collection ended

                //Updating individual war record
                await updateIndWarRecord(division);
                //Updating individual war record collection ended

                //Updating substitutions record
                await updateSubsRecord(division);
                //Updating substitutions record ended

                await message.react('✅');
                message.reply(`Updated abb change from **${args[1].toUpperCase()}** to **${args[2].toUpperCase()}**\nPlease use ` + '`wcl updatedb` to successfully load database!').then((msg) => msg.react('✅'));
                return;
            }
            else if (args[0].toUpperCase() === 'CT') { //clan tag change
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }

                //Updating abbs collection
                await updateAbbsCollection(division);
                //Updating abbs collection ended

                //Updating reps collection
                await updateRepsCollection(division);
                //Updating reps collection ended

                //Updating division-wise roster collection
                await divRosterCollection(division);
                //Updating division-wise roster collection ended

                //Updating individual war record
                await updateIndWarRecord(division);
                //Updating individual war record collection ended

                await message.react('✅');
                message.reply(`Updated clanTag for **${args[1].toUpperCase()}** to **${args[2].toUpperCase()}**\nPlease use ` + '`wcl updatedb` to successfully load database!').then((msg) => msg.react('✅'));
                return;
            } else if (args[0].toUpperCase() === 'SCT') { //secondary clan tag change
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }

                //Updating abbs collection
                await updateAbbsCollection(division);
                //Updating abbs collection ended

                //Updating reps collection
                await updateRepsCollection(division);
                //Updating reps collection ended

                await message.react('✅');
                message.reply(`Updated secondaryClanTag for **${args[1].toUpperCase()}** to **${args[2].toUpperCase()}**!`).then((msg) => msg.react('✅'));
                return;
            } else if (args[0].toUpperCase() === 'TNAME') { //team name change
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }

                //Updating abbs collection
                await updateAbbsCollection(division);
                //Updating abbs collection ended

                //Updating reps collection
                await updateRepsCollection(division);
                //Updating reps collection ended

                await message.react('✅');
                message.reply(`Updated team name for **${args[1].toUpperCase()}** to **${args.slice(2).join(' ').toUpperCase()}**!`).then((msg) => msg.react('✅'));
                return;
            } else if (args[0].toUpperCase() === 'SWAP') { //swap primary with secondary clan tag
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }

                //Updating abbs collection
                await updateAbbsCollection(division);
                //Updating abbs collection ended

                //Updating reps collection
                await updateRepsCollection(division);
                //Updating reps collection ended

                //Updating division-wise roster collection
                await divRosterCollection(division);
                //Updating division-wise roster collection ended

                //Updating individual war record
                await updateIndWarRecord(division);
                //Updating individual war record collection ended

                await message.react('✅');
                message.reply(`Swaped primaryClanTag for **${args[1].toUpperCase()}** to **${args[2].toUpperCase()}**\nPlease use ` + '`wcl updatedb` to successfully load database!').then((msg) => msg.react('✅'));
                return;
            }
        }
        else {
            message.reply(`You can't use this command here!`);
        }
    }
}