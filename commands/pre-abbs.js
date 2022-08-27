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
    explanation: 'Ex: wcl abbs H\nwhere H - Heavyweight division\n\nPrefix\nH - Heavy Weight\nF - Flight\nCL - Classic\nL - Light Weight\nE - Elite\nB - Blockage\nCS - Champions(Esports)',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]
        const options = {
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
        const stringDiv = {
            'HEAVY': 'HEAVY',
            'FLIGHT': 'FLIGHT',
            'ELITE': 'ELITE',
            'BLOCKAGE': 'BLOCKAGE',
            'CHAMPIONS': 'CHAMPIONS',
            'CLASSIC': 'CLASSIC',
            'LIGHT': 'LIGHT'
        }
        const logo = {
            'H': 'https://cdn.discordapp.com/attachments/995764484218028112/995764719791112252/WCL_Heavy.png?width=539&height=612',
            'F': 'https://cdn.discordapp.com/attachments/995764484218028112/995764818525044746/WCL_Flight.png?width=530&height=612',
            'E': 'https://cdn.discordapp.com/attachments/995764484218028112/995765404565782609/WCL_ELITE.png?width=514&height=612',
            'B': 'https://cdn.discordapp.com/attachments/995764484218028112/995765525001011310/WCL_Blockage-.png?width=435&height=613',
            'CS': 'https://cdn.discordapp.com/attachments/995764484218028112/995764652418023444/WCL_Champions.png?width=548&height=612',
            'L': 'https://cdn.discordapp.com/attachments/995764484218028112/995764946975596564/WCl_Light_Division-.png?width=548&height=612',
            'CL': 'https://cdn.discordapp.com/attachments/995764484218028112/995765980972195850/WCL_Classic-.png?width=548&height=612'
        };
        if (!notForUseChannels.includes(message.channel.id)) {
            if (!options[args[0].toUpperCase()])
                return message.reply(`Incorrect division ${args[0].toUpperCase()}!`);

            try {
                var abbCollection = require('./abbSchema/registeredAbbs');
                var searchBySubString = Object.keys(stringDiv).find(function (key) { return key.indexOf(args[0].toUpperCase()) != -1 ? stringDiv[key] : null });
                const allABBS = await abbCollection.find({ div: options[args[0].toUpperCase()] || searchBySubString });
                if (allABBS.length > 0) {
                    var reqABBS = [];
                    allABBS.forEach(abb => {
                        reqABBS.push([abb.abb, abb.clanTag, abb.clanName]);
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
                            col += `${data[0].padEnd(4, ' ')} ${data[1].padEnd(12, ' ')} ${data[2].padEnd(15, ' ')}\n`;
                        }
                    });

                    var EmbedColor = color[args[0].toUpperCase()] || Object.keys(color).find(function (key) { return color[key] === searchBySubString ? key : null });
                    var EmbedLogo = logo[args[0].toUpperCase()] || Object.keys(logo).find(function (key) { return logo[key] === searchBySubString ? key : null })
                    popUpEmbed(message, args,
                        {
                            color: EmbedColor,
                            logo: EmbedLogo,
                            col: col,
                            div: options[args[0].toUpperCase()] || searchBySubString
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
                            div: options[args[0].toUpperCase()] || searchBySubString
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