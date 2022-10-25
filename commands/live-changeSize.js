module.exports = {
    name: 'changesize',
    aliases: ['csz'],
    description: 'Updates additionstatuslimit',
    args: true,
    length: 3,
    category: 'admins',
    missing: ['`divPrefix`, ', '`n_Adds`, ', '`type`'],
    usage: 'divIdentifier n_Adds type',
    explanation: `Ex: wcl csz B 5 all\n\nwhere 'all' means the addition limit is increased by 5 for all teams\n
OR\n
wcl csz B 5 abb1 abb2 abb3\n\nwhere the addition limit is increased by 5 for given clan abbs`,
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294',
            '1018472654233149460',
            '1018472232403607604'
        ]

        const divPrefix = {
            'H': 'HEAVY',
            'F': 'FLIGHT',
            'E': 'ELITE',
            'B': 'BLOCKAGE',
            'CS': 'CHAMPIONS',
            'CL': 'CLASSIC',
            'L': 'LIGHT'
        }

        const color = {
            'H': '#008dff',
            'F': '#3f1f8b',
            'E': '#a40ae7',
            'B': '#fc3902',
            'CS': '#ffb014',
            'CL': '#276cc1',
            'L': '#52d600'
        }

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {
                var rSize = {
                    'HEAVY': 100,
                    'FLIGHT': 70,
                    'ELITE': 50,
                    'BLOCKAGE': 40,
                    'CHAMPIONS': 10,
                    'CLASSIC': 50,
                    'LIGHT': 50
                };
                var options = {
                    'HEAVY': ['heavy', 'rosterSchemaHeavy'],
                    'FLIGHT': ['flight', 'rosterSchemaFlight'],
                    'ELITE': ['elite', 'rosterSchemaElite'],
                    'BLOCKAGE': ['blockage', 'rosterSchemaBlockage'],
                    'CHAMPIONS': ['champions', 'rosterSchemaChampions'],
                    'CLASSIC': ['classic', 'rosterSchemaClassic'],
                    'LIGHT': ['light', 'rosterSchemaLight']
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