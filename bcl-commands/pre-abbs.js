const popUpEmbed = require('./pre-showEmbed');

module.exports = {
    name: 'abbs',
    aliases: ['abbs'],
    description: 'List all clan abbreviations',
    args: true,
    length: 1,
    category: "all",
    usage: 'divisionPrefix',
    missing: ['`divisionPrefix`'],
    explanation: 'Ex: bcl abbs CS\nwhere CS - Champions(Esports)',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');
        const resources = require('../bclutility/resourcesUtils');
        const divPrefix = resources.DIVISION_ABBS;
        const logo = resources.DIVISION_LOGO_URL;
        const color = resources.DIVISION_COLOR;

        const stringDiv = {
            'CHAMPIONS': 'CHAMPIONS',
        }
        
        if (!notForUseChannels.includes(message.channel.id)) {
            if (!divPrefix[args[0].toUpperCase()])
                return message.reply(`Incorrect division ${args[0].toUpperCase()}!`);

            try {
                var abbCollection = require('./abbSchema/registeredAbbs');
                var searchBySubString = Object.keys(stringDiv).find(function (key) { return key.indexOf(args[0].toUpperCase()) != -1 ? stringDiv[key] : null });
                const allABBS = await abbCollection.find({ div: divPrefix[args[0].toUpperCase()] || searchBySubString });
                if (allABBS.length > 0) {
                    var reqABBS = [];
                    allABBS.forEach(abb => {
                        if (abb.teamName && abb.teamName != 'NONE')
                            reqABBS.push([abb.abb, abb.clanTag, abb.teamName]);
                        else
                            reqABBS.push([abb.abb, abb.clanTag, abb.clanName])
                    });

                    reqABBS.sort(function (a, b) {
                        var nameA = a[2].toUpperCase();
                        var nameB = b[2].toUpperCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        else if (nameA > nameB) {
                            return 1;
                        }

                        return 0;
                    });

                    let col = '';
                    reqABBS.forEach(data => {
                        if (!(data[0] === undefined)) {
                            col += `${data[0].padEnd(4, ' ')} ${data[1].padEnd(12, ' ')} ${data[2].padEnd(15, ' ').substring(0, 15)}\n`;
                        }
                    });

                    var EmbedColor = color[args[0].toUpperCase()] || Object.keys(color).find(function (key) { return color[key] === searchBySubString ? key : null });
                    var EmbedLogo = logo[args[0].toUpperCase()] || Object.keys(logo).find(function (key) { return logo[key] === searchBySubString ? key : null })
                    popUpEmbed(message, args,
                        {
                            color: EmbedColor,
                            logo: EmbedLogo,
                            col: col,
                            div: divPrefix[args[0].toUpperCase()] || searchBySubString
                        },
                        "abbs"
                    )
                } else {
                    var EmbedColor = color[args[0].toUpperCase()] || Object.keys(color).find(function (key) { return color[key] === searchBySubString ? key : null });
                    var EmbedLogo = logo[args[0].toUpperCase()] || Object.keys(logo).find(function (key) { return logo[key] === searchBySubString ? key : null })
                    popUpEmbed(message, args,
                        {
                            color: EmbedColor,
                            logo: EmbedLogo,
                            col: "NO ENTRIES",
                            div: divPrefix[args[0].toUpperCase()] || searchBySubString
                        },
                        "abbs"
                    )
                }
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        }
        else {
            message.reply(`You can't use this command here!`);
        }
    }
}