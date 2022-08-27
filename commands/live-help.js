module.exports = {
    name: 'help',
    aliases: ['help'],
    description: 'Lists the commands for WCL',
    args: false,
    execute: async (message) => {
        const com = `Roster Rep Only
wcl add - allows you to add a player to the roster
wcl remove - allows you to remove a player from the roster\n\n
Representative Only
wcl sch - go for a war scheduling
More commands coming soon.........\n\n
All Warriors of WCL 🙂
wcl abbs - lists all the clan abbreviations for a division
wcl reps - lists the clan representative for a clan
wcl roster - lists the clan's roster
wcl attackframe - shows Champion(eSports) attack frame
wcl search - searches a player for all available rosters
wcl vdual - shows all duals in a particular division\n\n
More commands coming soon.........`
        message.channel.send('```plaintext\n' + com + '\n```')
    }
}