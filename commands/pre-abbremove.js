module.exports = {
    name: 'removeabb',
    aliases: ['removeabb'],
    description: 'Removes the clan abb',
    args: true,
    length: 1,
    category: "all",
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl removeabb HR\nwhere HR - clanAbb',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        try {
            if (message.member.hasPermission('MANAGE_GUILD')) {
                const abbCollection = require('./abbSchema/registeredAbbs');
                const subsSchema = require('./subTracking/substitutionSchema');
                const findAbb = await abbCollection.findOne({ abb: args[0].toUpperCase() });
                // indwar schema also needs to be updated (group stage)
                if (findAbb) {
                    const repCollection = require('./repsSchema/repsSchema');

                    var rosterCollection;
                    if (findAbb.div === 'HEAVY')
                        rosterCollection = require('./rosterSchemas/rosterSchemaHeavy');
                    else if (findAbb.div === 'FLIGHT')
                        rosterCollection = require('./rosterSchemas/rosterSchemaFlight');
                    else if (findAbb.div === 'ELITE')
                        rosterCollection = require('./rosterSchemas/rosterSchemaElite');
                    else if (findAbb.div === 'BLOCKAGE')
                        rosterCollection = require('./rosterSchemas/rosterSchemaBlockage');
                    else if (findAbb.div === 'CHAMPIONS')
                        rosterCollection = require('./rosterSchemas/rosterSchemaChampions');
                    else if (findAbb.div === 'CLASSIC')
                        rosterCollection = require('./rosterSchemas/rosterSchemaClassic');
                    else if (findAbb.div === 'LIGHT')
                        rosterCollection = require('./rosterSchemas/rosterSchemaLight');

                    // deleting the objects
                    const clanData = await abbCollection.findOneAndDelete({ abb: args[0].toUpperCase() });
                    await repCollection.findOneAndDelete({ abb: args[0].toUpperCase() });
                    await rosterCollection.findOneAndDelete({ abb: args[0].toUpperCase() });
                    await subsSchema.findOneAndDelete({ abb: args[0].toUpperCase() });
                    message.reply(`Successfully deleted team:\nDivision - ${clanData.div}\nClan Tag - ${clanData.clanTag}\nClan Name - ${clanData.clanName}`).then((msg) => msg.react('✅'));
                } else {
                    message.reply(`No such abb registered till now!`);
                    return;
                }
            }
            else {
                message.reply(`You can't use this command!`);
            }
        }
        catch (err) {
            console.log(err);
            message.reply(err.message);
        }
    }
}