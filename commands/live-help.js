module.exports = {
    name: 'help',
    aliases: ['help'],
    description: 'Lists the commands for WCL',
    args: false,
    execute: async (message) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294',
            '1018472654233149460',
            '1018472232403607604'
        ]

        const com = `Roster Rep Only
wcl add - allows you to add a player to the roster
wcl remove - allows you to remove a player from the roster\n\n
Representative Only
wcl sch - go for a war scheduling
wcl delsch - delete a scheduled war
wcl subs - Allows you to take a subtitute!
More commands coming soon.........\n\n
All Warriors of WCL 🙂
wcl abbs - lists all the clan abbreviations for a division
wcl attackframe - shows Champion(eSports) attack frame
wcl activewars - List all the active wars in a particular division
wcl forfeitwars - List all the forfeit wars in a particular division
wcl pendingwars - List all the pending wars in a particular division in specific week
wcl reps - lists the clan representative for a clan
wcl roster - lists the clan's roster
wcl search - searches a player for all available rosters
wcl standings - lists official standing according to a division
wcl stats - shows scheduled war detail with the war stats(if active)
wcl vdual - shows all duals in a particular division
wcl viewwars - shows all war scores of a particular clan
More commands coming soon.........`
        if (!notForUseChannels.includes(message.channel.id))
            return message.channel.send('```plaintext\n' + com + '\n```')
        else
            return message.reply(`Please use this command anywhere else!`)
    }
}