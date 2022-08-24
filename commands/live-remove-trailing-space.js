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
        const fetchOptions = {
            'contentType': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true,
        };
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
                const rosterCollection = require('./rosterSchemas/rosterSchemaClassic');
                const roster = await rosterCollection.findOne({ abb: args[0].toUpperCase() });
                const players = [];
                roster.players.forEach(player => {
                    const tempPlayer = player[0];
                    const tempPlayer1 = tempPlayer.replace(/[\t\n\r]/gm, '')
                    const tempPlayer2 = tempPlayer1.replace(/\s/g, '');
                    players.push([tempPlayer2, player[1]]);
                });
                roster.players = players;
                await roster.save()
                    .then(roster => { console.log(roster) })
                message.reply(`Successfully removed trailing white spaces!`).then((msg) => msg.react('✅'));
            } else {
                message.reply(`You're not allowed to use this command!`);
            }
        }
        catch (err) { console.log(err.message) }
    }
}