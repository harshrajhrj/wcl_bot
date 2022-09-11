module.exports = {
    name: 'removetrails',
    aliases: ['rts'],
    description: `Helps to remove trailing white space from each tag`,
    args: true,
    length: 1,
    category: 'admin',
    usage: 'divPrefix',
    missing: ['`divPrefix`'],
    explanation: 'Ex: wcl rts CS\n\nwhere CS - Champions\n\nPrefix\nH - Heavy Weight\nF - Flight\nCL - Classic\nL - Light Weight\nE - Elite\nB - Blockage\nCS - Champions(Esports)',
    execute: async (message, args) => {
        const options = {
            'H': 'Heavy',
            'F': 'Flight',
            'E': 'Elite',
            'B': 'Blockage',
            'CS': 'Champions',
            'CL': 'Classic',
            'L': 'Light'
        }
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294',
            '1018472654233149460',
            '1018472232403607604'
        ]

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_GUILD')) {
                if (options[args[0].toUpperCase()]) {
                    const rosterCollection = require(`./rosterSchemas/rosterSchema` + options[args[0].toUpperCase()]);
                    const roster = await rosterCollection.find();
                    for (var i = 0; i < roster.length; i++) {
                        var players = [];
                        roster[i].players.forEach(player => {
                            const tempPlayer1 = player[0].replace(/[\t\n\r]/gm, '')
                            const tempPlayer2 = tempPlayer1.replace(/\s/g, '');
                            const tempPlayer3 = decodeURIComponent(tempPlayer2).replace(/[^\x00-\x7F]/g, "");
                            players.push([tempPlayer3, player[1]]);
                        })
                        roster[i].players = players;
                        await roster[i].save()
                            .then(roster => { console.log(roster) })
                    }
                    message.reply(`Successfully removed trailing white spaces!\n**Division** - ${options[args[0].toUpperCase()]}\n**Total teams** - ${roster.length}`).then((msg) => msg.react('✅'));
                } else {
                    message.reply(`Invalid division prefix **${args[0].toUpperCase()}**!`);
                }
            } else {
                message.reply(`You're not allowed to use this command!`);
            }
        }
        catch (err) { console.log(err.message) }
    }
}