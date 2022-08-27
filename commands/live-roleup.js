module.exports = {
    name: 'roleup-lock',
    aliases: ['rll'],
    description: `Helps to assign roles prior to a division`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'div_prefix',
    missing: ['`div_prefix`'],
    explanation: 'Ex: wcl rl CL\n\nwhere CS - Champions\n\nPrefix\nH - Heavy Weight\nF - Flight\nCL - Classic\nL - Light Weight\nE - Elite\nB - Blockage\nCS - Champions(Esports)',
    execute: async (message, args) => {
        const options = {
            'H': 'Heavy',
            'F': 'Flight',
            'E': 'Elite',
            'B': 'Blockage',
            'CS': 'Champions',
            'CL': 'Classic',
            'L': 'Light'
        };

        const roleID = {
            'H': '1011612506093015040',
            'F': '1011612972155682876',
            'E': '1011612255026167878',
            'B': '1011613535702364330',
            'CS': '1011611354190336101',
            'CL': '1011613324934381628',
            'L': '1011613102422368346'
        }
        if (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES')) {

        }
    }
}