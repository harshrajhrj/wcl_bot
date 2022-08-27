const repsSchema = require("./repsSchema/repsSchema");
module.exports = {
    name: 'roleup',
    aliases: ['rl'],
    description: `Helps to assign roles prior to a division`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'div_prefix',
    missing: ['`div_prefix`'],
    explanation: 'Ex: wcl rl CS\n\nwhere CS - Champions\n\nPrefix\nH - Heavy Weight\nF - Flight\nCL - Classic\nL - Light Weight\nE - Elite\nB - Blockage\nCS - Champions(Esports)\n\nwcl rl CL -r\nwhere "-r" flag removes all the roles for a given div_prefix!',
    execute: async (message, args) => {
        const options = {
            'H': 'Heavy',
            'F': 'Flight',
            'E': 'Elite',
            'B': 'Blockage',
            'CS': 'Champions',
            'CL': 'Classic',
            'L': 'Light',
            'ME': '1013141547270807677',
        };

        const roleID = {
            'H': '1011612506093015040',
            'F': '1011612972155682876',
            'E': '1011612255026167878',
            'B': '1011613535702364330',
            'CS': '1011611354190336101',
            'CL': '1011613324934381628',
            'L': '1011613102422368346',
            'ME': '1013141547270807677',
        }
        if (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES')) {
            if (options[args[0].toUpperCase()]) {
                let role = message.guild.roles.cache.find(r => r.id === roleID[args[0].toUpperCase()]);
                if (role) {
                    const findReps = await repsSchema.find({ div: options[args[0].toUpperCase()] });
                    var allReps = [];
                    findReps.forEach(rep => {
                        allReps.push(rep.rep1_dc);
                        allReps.push(rep.rep2_dc);
                    })
                    const lengthBefore = allReps.length;
                    if (args.length > 1 && args[1].toUpperCase() === "-R") {
                        message.guild.members.cache.filter(m => !m.user.bot).forEach(member => {
                            if (allReps.includes(member.id)) {
                                member.roles.remove(roleID[args[0].toUpperCase()]);
                                allReps = allReps.filter(function (rep) { return rep != member.id });
                            }
                        })
                        const lengthAfter = allReps.length;
                        await message.react('✅');
                        message.reply(`Removed roles from members ${lengthBefore - lengthAfter}/${lengthBefore} | Division - ${options[args[0].toUpperCase()]}!`).then((msg) => msg.react('✅'))
                        return;
                    }
                    message.guild.members.cache.filter(m => !m.user.bot).forEach(member => {
                        if (allReps.includes(member.id)) {
                            member.roles.add(roleID[args[0].toUpperCase()]);
                            allReps = allReps.filter(function (rep) { return rep != member.id });
                        }
                    })
                    const lengthAfter = allReps.length;
                    await message.react('✅');
                    message.reply(`Added roles to members ${lengthBefore - lengthAfter}/${lengthBefore} | Division - ${options[args[0].toUpperCase()]}!`).then((msg) => msg.react('✅'))
                } else {
                    message.reply(`Role doesn't exist for division **${options[args[0].toUpperCase()]}**!`)
                }
            } else {
                message.reply(`Invalid division prefix **${args[0].toUpperCase()}**!`)
            }
        }
    }
}