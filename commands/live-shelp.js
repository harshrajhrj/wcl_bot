module.exports = {
    name: 'shelp',
    aliases: ['shelp'],
    description: 'Lists the commands for staffs of WCL',
    args: false,
    execute: async (message) => {
        if (message.member.hasPermission('MANAGE_SERVER') || message.member.hasPermission('MANAGE_ROLES') || !message.guild.id('389162246627917826')) {
            const com = `Developer Only\n\n
League Admins Only
wcl replace - replaces old clan_abb with new clan_abb
wcl updatedb - populates new details of clan abbreviations
wcl changeroster - to change a complete roster
wcl changesize - to resize new teams roster addition spot(author only)
wcl creps - interchange/update the clan representatives
wcl rts - removes all trailing white spaces and special characters from all tags
wcl roleup - Helps to assign roles prior to a division\n\n
More commands coming soon.........`
            message.channel.send('```plaintext\n' + com + '\n```');
        }
        else {
            message.reply('Not allowed to use the command here.');
        }
    }
}