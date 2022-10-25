module.exports = {
    name: 'removeabb',
    aliases: ['removeabb'],
    description: 'Removes the clan abb',
    args: true,
    length: 1,
    category: "all",
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: bcl removeabb HR\nwhere HR - clanAbb',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_GUILD')) {
                const abbCollection = require('./abbSchema/registeredAbbs');
                const subsSchema = require('./subTracking/substitutionSchema');
                const findAbb = await abbCollection.findOne({ abb: args[0].toUpperCase() });
                // indwar schema also needs to be updated (group stage)
                if (findAbb) {
                    const repCollection = require('./repsSchema/repsSchema');

                    var rosterCollection;
                    if (findAbb.div === 'CHAMPIONS')
                        rosterCollection = require('./rosterSchemas/rosterSchemaChampions');

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