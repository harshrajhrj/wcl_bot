module.exports = {
    name: 'shelp',
    aliases: ['shelp'],
    description: 'Lists the commands for staffs of BCL',
    args: false,
    execute: async (message) => {
        const notForUseChannels = require('./live-notForUseChannels');
        if (!notForUseChannels.includes(message.channel.id) && (message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_ROLES'))) {
            const com = `Developer Only\n\n
League Admins Only
bcl addroster - To add/update a team's roster
bcl creps - Interchange/update the clan representatives
bcl changesize - To resize new team's roster addition spot
bcl createnego - Create all negotiation rooms for a particular week inside a week category(applicable for Champions Esports division only) (NOT AVAILABLE)
bcl deletenego - Delete all negotiation rooms for a particular week inside a week category (NOT AVAILABLE)
bcl deletewars - Delete official wars which were used for tracking
bcl forceres - Results a war with force W/L/T!
bcl getwartags - List the clan tags of wars of BCL for a particular division, week.
bcl insertwars - Inserts official wars for tracking
bcl opennego - Create a negotiation room with details provided as clanAbb and opponentAbb (NOT AVAILABLE)
bcl replace - Replaces old clan_abb with new clan_abb
bcl res - Manual resulting of a war using warID and clanAbb
bcl removeabb - Removes a team from BCL
bcl roleup - Helps to assign roles prior to a division (NOT AVAILABLE)
bcl rts - Removes all trailing white spaces and special characters from all tags
bcl updatedb - Populates new details of clan abbreviations
More commands coming soon.........`
            message.channel.send('```plaintext\n' + com + '\n```');
        }
        else {
            message.reply('Not allowed to use the command here.');
        }
    }
}