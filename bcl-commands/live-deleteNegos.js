const channelSchema = require("./negotiationSchema/channelSchema");

module.exports = {
    name: 'deletenego',
    aliases: ['dn'],
    description: 'Delete all negotiation rooms for a particular week inside a week category',
    args: true,
    length: 2,
    category: "admins",
    usage: 'divPrefix weekPrefix',
    missing: ['`divPrefix`, ', '`weekPrefix`'],
    explanation: `Ex: bcl deletenego CS WK1\n\nwhere\nCS - Champions division and\nWK1 - Week 1`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        const resources = require('../bclutility/resourcesUtils');
        const divPrefix = resources.DIVISION_ABBS;
        const week = resources.WEEK_ABBS;

        if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_GUILD')) {
            try {
                if (week[args[1].toUpperCase()] && divPrefix[args[0].toUpperCase()]) {
                    const checkExistingCategory = await channelSchema.findOne({ div: divPrefix[args[0].toUpperCase()], week: week[args[1].toUpperCase()] })
                    if (checkExistingCategory) {
                        var i = 0, j = 0;
                        for (i = 0; i < checkExistingCategory.categoryID1.channels.length; i++) {
                            if (message.guild.channels.cache.get(checkExistingCategory.categoryID1.channels[i].id))
                                await message.guild.channels.cache.get(checkExistingCategory.categoryID1.channels[i].id).delete();
                        }
                        if (message.guild.channels.cache.get(checkExistingCategory.categoryID1.id))
                            await message.guild.channels.cache.get(checkExistingCategory.categoryID1.id).delete();
                        if (checkExistingCategory.categoryID2) {
                            for (j = 0; j < checkExistingCategory.categoryID2.channels.length; j++) {
                                if (message.guild.channels.cache.get(checkExistingCategory.categoryID2.channels[j].id))
                                    await message.guild.channels.cache.get(checkExistingCategory.categoryID2.channels[j].id).delete();
                            }
                            j++;
                            if (message.guild.channels.cache.get(checkExistingCategory.categoryID2.id))
                                await message.guild.channels.cache.get(checkExistingCategory.categoryID2.id).delete();
                        }
                        // await channelSchema.findOneAndDelete({ div: divPrefix[args[0].toUpperCase()], week: week[args[1].toUpperCase()] });
                        await message.react('✅');
                        return message.reply(`Deleted **${i + 1 + j}** negotiation rooms for ${args[1].toUpperCase()} | ${divPrefix[args[0].toUpperCase()]}!`);
                    }
                } else {
                    return message.reply(`Invalid week/division prefix or maybe other division than Champions!\nPlease check again and try.`);
                }
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}