//@params
//1 - clan abb
//2 - rep identifier
//3 - rep mention
const fs = require('fs');
module.exports = {
    name: 'changerep',
    aliases: ['creps', 'cr'],
    description: 'Stores the information of clan representative!',
    args: true,
    length: 2,
    category: "moderator",
    usage: 'clanAbb repPrefix repMention/clear',
    missing: ['`clanAbb`, ', '`repPrefix`, ', '`repMention/clear`'],
    explanation: `Ex: bcl creps INQ R1 @RAJ\nwhere Rep1 or R1 - RAJ\nOR\nbcl creps INQ all @RAJ @Candy\nwhere Rep1 - RAJ and Rep2 - Candy\n\nbcl creps clanAbb clear\nThis command clears the data of both representatives. Individuals can be cleared by r1/r2 accordingly.\n\n
Rep Prefix\nr1 - Representative 1\nr2 - Representative 2\nall - Both representatives`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const roster = {
            'CHAMPIONS': 'Champions',
        }
        
        const notForUseChannels = require('./live-notForUseChannels');

        function checkAbb(abb) {
            try {
                var abbDataObject = fs.readFileSync('./bcl-commands/abbs.json');
                var abbData = JSON.parse(abbDataObject);
                var division = '';
                var control = 0
                abbData.values.forEach(data => {
                    if (data[2] === abb && control === 0) {
                        division = data[3];
                        control++;
                    }
                });
                return division;
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        }
        if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {
            var abbCheck = checkAbb(args[0].toUpperCase());
            if (abbCheck === '') {
                message.reply(`Invalid clan abb ${args[0].toUpperCase()}`);
                return;
            }
            if (args[1].toUpperCase() === 'R1') {
                callChangeFirstRep(abbCheck);
                return;
            }
            else if (args[1].toUpperCase() === 'R2') {
                callChangeSecondRep(abbCheck);
                return;
            }
            else if (args[1].toUpperCase() === 'ALL') {
                callChangeAllRep(abbCheck);
                return;
            }
            else if (args[1].toUpperCase() === 'CLEAR') {
                callClearRep(abbCheck);
                return;
            }
            else {
                message.reply(`Invalid indentifier ${args[1].toUpperCase()}!`);
                return;
            }
        } else {
            message.reply(`You can't use this command!`);
            return;
        }

        async function getRepInfo() {
            var rep_name = message.mentions.users.map(user => {
                return user.username;
            });
            var rep_id = message.mentions.users.map(user => {
                return user.id;
            });
            var rep_tag = message.mentions.users.map(user => {
                return user.discriminator;
            });
            return [rep_name, rep_id, rep_tag];
        }

        async function callChangeFirstRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');
                var oldRep;

                var repData = await repSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep1: repInfo[0][0] + "#" + repInfo[2][0],
                        rep1_dc: repInfo[1][0]
                    }
                ).then((data) => oldRep = data.rep1);

                const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep1_dc: repInfo[1][0]
                    }
                );

                await message.react('✅');
                message.reply(`Updated rep change from **${oldRep}** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function callChangeSecondRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');
                var oldRep;

                var repData = await repSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep2: repInfo[0][0] + "#" + repInfo[2][0],
                        rep2_dc: repInfo[1][0]
                    }
                ).then((data) => oldRep = data.rep2);

                const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep2_dc: repInfo[1][0]
                    }
                );
                await message.react('✅');
                message.reply(`Updated rep change from **${oldRep}** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function callChangeAllRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');
                var oldRep;
                console.log(repInfo);
                var repData = await repSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep1: repInfo[0][0] + "#" + repInfo[2][0],
                        rep1_dc: repInfo[1][0],
                        rep2: repInfo[0][1] + "#" + repInfo[2][1],
                        rep2_dc: repInfo[1][1]
                    }
                ).then((data) => oldRep = [data.rep1, data.rep2]);

                const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep1_dc: repInfo[1][0],
                        rep2_dc: repInfo[1][1]
                    }
                );

                await message.react('✅');
                message.reply(`Updated rep change from **${oldRep[0]}** and **${oldRep[1]}** to **${repInfo[0][0] + "#" + repInfo[2][0]}** and **${repInfo[0][1] + "#" + repInfo[2][1]}**!`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function callClearRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');
                var oldRep;

                var repData = await repSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep1: 'No entry',
                        rep1_dc: "0",
                        rep2: 'No entry',
                        rep2_dc: "0"
                    }
                ).then((data) => oldRep = [data.rep1, data.rep2]);

                const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        rep1_dc: "0",
                        rep2_dc: "0"
                    }
                );

                await message.react('✅');
                message.reply(`Removed reps **${oldRep[0]}** and **${oldRep[1]}**!`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }
    }
}