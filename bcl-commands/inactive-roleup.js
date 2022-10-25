const repsSchema = require("./repsSchema/repsSchema");
module.exports = {
    name: 'roleup-lock',
    aliases: ['rll'],
    description: `Helps to assign roles prior to a division`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'div_prefix',
    missing: ['`div_prefix`'],
    explanation: 'Ex: bcl rl CS\n\nwhere CS - Champions\n\nPrefix\nCS - Champions(Esports)\n\nbcl rl CL -r\nwhere "-r" flag removes all the roles for a given div_prefix!',
    execute: async (message, args) => {
        const resources = require('../bclutility/resourcesUtils');
        const divPrefix = resources.DIVISION_ABBS;

        const roleID = {} // CS : 'ID'

        const notForUseChannels = require('./live-notForUseChannels');

        if (!notForUseChannels.includes(message.channel.id) && (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES'))) {
            if (divPrefix[args[0].toUpperCase()]) {
                let role = message.guild.roles.cache.find(r => r.id === roleID[args[0].toUpperCase()]);
                if (role) {
                    const findReps = await repsSchema.find({ div: divPrefix[args[0].toUpperCase()] });
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
                        message.reply(`Removed roles from members ${lengthBefore - lengthAfter}/${lengthBefore} | Division - ${divPrefix[args[0].toUpperCase()]}!`).then((msg) => msg.react('✅'))
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
                    message.reply(`Added roles to members ${lengthBefore - lengthAfter}/${lengthBefore} | Division - ${divPrefix[args[0].toUpperCase()]}!`).then((msg) => msg.react('✅'))
                } else {
                    message.reply(`Role doesn't exist for division **${divPrefix[args[0].toUpperCase()]}**!`)
                }
            } else {
                message.reply(`Invalid division prefix **${args[0].toUpperCase()}**!`)
            }
        } else {
            return message.reply(`You can't use this command here!`);
        }
    }
}