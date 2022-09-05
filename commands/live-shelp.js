module.exports = {
    name: 'shelp',
    aliases: ['shelp'],
    description: 'Lists the commands for staffs of WCL',
    args: false,
    execute: async (message) => {
        if (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES') || !message.guild.id('389162246627917826')) {
            const com = `Developer Only\n\n
League Admins Only
wcl changeroster - To change a complete roster
wcl creps - Interchange/update the clan representatives
wcl changesize - To resize new teams roster addition spot(author only)
wcl deletewars - Delete official wars which were used for tracking
wcl getwartags - List the clan tags of wars of WCL for a particular division, week.
wcl insertwars - Inserts official wars for tracking
wcl replace - Replaces old clan_abb with new clan_abb
wcl res - Manual resulting of a war using warID and clanAbb
wcl roleup - Helps to assign roles prior to a division\n\n
wcl rts - Removes all trailing white spaces and special characters from all tags
wcl updatedb - Populates new details of clan abbreviations
More commands coming soon.........`
            message.channel.send('```plaintext\n' + com + '\n```');
        }
        else {
            message.reply('Not allowed to use the command here.');
        }
    }
}