module.exports = {
    name : 'shelp',
    aliases : ['shelp'],
    description : 'Lists the commands for staffs of WCL',
    args : false,
    execute : async (message) => {
        if(message.guild.id === '615297658860601403' || message.guild.id === '765523244332875776')
        {
            const com = `Developer Only
wcl scan - scans the latest banned clan visit\n\n
League Admins Only
wcl rbug - clears rosterbug
wcl forceadd - coming soon....
wcl replace - replaces old clan_abb with new clan_abb
Wcl replaceeach - replaces CT(Old to New ClanTag), CN(Old to New ClanName), SCT(Old to New Secondary CT), CL(Old to New ClanLogo) and CRL(Old to New ClanRosterLink)
wcl trans - transfer roster data
wcl confirm - transfer team data
wcl sreps - interchange/update the clan representatives
wcl binfo - lists the blockage banned troops or blockage week rules\n\n
More commands coming soon.........`
            message.channel.send('```plaintext\n'+com+'\n```');
        }
        else
        {
            message.reply('Not allowed to use the command here.');
        }
    }
}