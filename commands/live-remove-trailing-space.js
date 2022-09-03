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
        try {
            if (message.member.hasPermission('MANAGE_GUILD')) {
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