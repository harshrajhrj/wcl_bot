module.exports = {
    name: 'changesize',
    aliases: ['csz'],
    description: 'Updates additionstatuslimit',
    args: true,
    length: 3,
    category: 'admins',
    missing: ['`divPrefix`, ', '`n_Adds`, ', '`type`'],
    usage: 'divIdentifier n_Adds type',
    explanation: `Ex: bcl csz B 5 all\n\nwhere 'all' means the addition limit is increased by 5 for all teams\n
OR\n
bcl csz B 5 abb1 abb2 abb3\n\nwhere the addition limit is increased by 5 for given clan abbs`,
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        const resources = require('../bclutility/resourcesUtils');
        const divPrefix = resources.DIVISION_ABBS;

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {
                var options = {
                    'CHAMPIONS': ['champions', 'rosterSchemaChampions'],
                };
                if (!divPrefix[args[0].toUpperCase()])
                    return message.reply(`Invalid div prefix **${args[0].toUpperCase()}**!`);

                if (!parseInt(args[1]))
                    return message.reply(`No of adds must be a number!`);

                var rosterSchema = require('./rosterSchemas/' + options[divPrefix[args[0].toUpperCase()]][1]);

                if (args.length === 3 && args[2].toUpperCase() === 'ALL') {
                    var getData = await rosterSchema.find();
                    getData.forEach(async data => {
                        let num = parseInt(args[1], 10)
                        data.additionStatusLimit = data.additionStatusLimit + num;
                        if (data.additionStatusLimit > 0)
                            data.additionStatus = 'Yes';
                        else
                            data.additionStatus = 'No';
                        await data.save().then((data) => { console.log(data) }).catch((err) => console.log(err.message));
                    });
                    message.reply(`Completed updating ${args[1].toUpperCase()} adds ✅! `);
                } else {
                    let arrArgs = args.splice(0, 2);
                    var getData = await rosterSchema.find({ abb: { $in: args } });
                    getData.forEach(async data => {
                        data.additionStatusLimit = data.additionStatusLimit + parseInt(arrArgs[1], 10);
                        if (data.additionStatusLimit > 0)
                            data.additionStatus = 'Yes';
                        else
                            data.additionStatus = 'No';
                        await data.save().then((data) => { console.log(data) }).catch((err) => console.log(err.message));
                    });
                    message.reply(`Completed updating ${parseInt(arrArgs[1], 10)} adds ✅! `);
                }
            } else {
                message.reply(`You can't use this command!`);
            }
        } catch (err) {
            console.log(err);
        }
    }
}