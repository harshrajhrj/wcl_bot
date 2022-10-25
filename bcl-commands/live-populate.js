const fs = require('fs');
module.exports = {
    name: 'updatedb',
    aliases: ['updb'],
    description: 'Updates database for each change of clan(tag)/abb',
    args: false,
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        
        if (!notForUseChannels.includes(message.channel.id) && (message.guild.id === '987923973050363984' || message.guild.id === '765523244332875776' || message.member.hasPermission('MANAGE_ROLES'))) {
            try {
                var data = fs.readFileSync('./bcl-commands/abbs.json');
                var myObject = JSON.parse(data);
                const allAbbs = require('./abbSchema/registeredAbbs');
                const abbData = await allAbbs.find();

                const producedAbbs = [];
                abbData.forEach(abb => {
                    producedAbbs.push([abb.clanTag, abb.clanName, abb.abb, abb.div])
                });

                myObject["values"] = producedAbbs;
                await message.react('✅');
                var newData = JSON.stringify(myObject);
                fs.writeFile('./bcl-commands/abbs.json', newData, (err) => {
                    if (err) {
                        throw err.message;
                    }
                    message.reply(`Updated!\nTotal data : ${producedAbbs.length}`);
                });
            } catch (err) {
                message.reply(err.message)
            }
        } else {
            message.reply(`You can't use this command!`);
        }
    }
}