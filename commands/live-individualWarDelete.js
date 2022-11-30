const fs = require('fs');
const indWarSchema = require('./war&schedule&standings/individualWarRecord');

module.exports = {
    name: 'deleteweek',
    aliases: ['dw'],
    description: 'Deletes individual week for a whole division or for a individial team',
    args: true,
    length: 2,
    category: "admins",
    usage: 'division/clanAbb weekNo',
    missing: ['`division/clanAbb`, ', '`weekNo`'],
    explanation: `Ex: wcl deleteweek H wk7\nwhere H is Heavyweight Division\nwk7 is Week 7\n\nwcl deleteweek abb wk7\ndeletes wk7 for a particular abb\n\nWeek code/range
    'WK1': 'WK1',
    'WK2': 'WK2',
    'WK3': 'WK3',
    'WK4': 'WK4',
    'WK5': 'WK5',
    'WK6': 'WK6',
    'WK7': 'WK7',
    'WK8': 'WK8',
    'WK9': 'WK9',
    'WK10': 'WK10',
    'WK11': 'WK11',
    'R128': 'R128',
    'R64': 'R64',
    'R32': 'R32',
    'WC': 'WC',
    'WC2' : 'WC2',
    'QF': 'QF',
    'SF': 'SF',
    'F': 'F'`,
    accessableby: ['League Admins', 'Moderator'],
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

        // playoff round for champ division to be asked
        const week = {
            'WK1': 'WK1',
            'WK2': 'WK2',
            'WK3': 'WK3',
            'WK4': 'WK4',
            'WK5': 'WK5',
            'WK6': 'WK6',
            'WK7': 'WK7',
            'WK8': 'WK8',
            'WK9': 'WK9',
            'WK10': 'WK10',
            'WK11': 'WK11',
            'R128': 'R128',
            'R64': 'R64',
            'R32': 'R32',
            'WC': 'WC',
            'QF': 'QF',
            'SF': 'SF',
            'F': 'F',
        };

        function divCheck(ABB) {
            var ABBSobject = fs.readFileSync('./commands/abbs.json');
            var abbs = JSON.parse(ABBSobject);

            var div = [];
            abbs.values.forEach(abb => {
                if (abb[2] == ABB)
                    div.push(abb[0], abb[1], abb[2], abb[3]);
            })
            return div;
        }

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {
                if (!week[args[1].toUpperCase()])
                    return message.reply(`Invalid week **${args[1].toUpperCase()}**!`);
                if (options[args[0].toUpperCase()]) {
                    const getClans = await indWarSchema.find({ div: options[args[0].toUpperCase()] });
                    for (var i = 0; i < getClans.length; i++) {
                        var opponentKey = getClans[i].opponent;
                        delete opponentKey[args[1].toUpperCase()];
                        getClans[i].opponent = opponentKey;
                        await getClans[i].markModified('opponent');
                        await getClans[i].save();
                    }
                    await message.react('✅');
                    return message.reply(`Successfully deleted **${args[1].toUpperCase()}** of **${options[args[0].toUpperCase()]}** Division!`);
                } else {
                    var getABB = divCheck(args[0].toUpperCase());
                    if (getABB.length > 0) {
                        const getWars = await indWarSchema.findOne({ abb: args[0].toUpperCase() });
                        var opponentKey = getWars.opponent;
                        delete opponentKey[args[1].toUpperCase()];
                        getWars.opponent = opponentKey;
                        await getWars.markModified('opponent');
                        await getWars.save()
                            .then(data => { console.log(data) });
                        await message.react('✅');
                        return message.reply(`Successfully deleted **${args[1].toUpperCase()}** of **${args[0].toUpperCase()}**!`);
                    } else {
                        return message.reply(`Invalid clan abb **${args[0].toUpperCase()}**!`);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            message.reply(err.message);
        }
    }
}