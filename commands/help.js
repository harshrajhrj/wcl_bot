module.exports = {
    name : 'help',
    aliases : ['help'],
    description : 'Lists the commands for WCL',
    args : false,
    execute : async (message) => {
        const com = `Roster Rep Only
wcl add - allows you to add a player to the roster\n
wcl remove - allows you to remove a player from the roster\n\n\n
Representative Only\n
wcl sch - schedules the official wcl wars\n
wcl unsch - unschedules the official wcl war using war_id\n
wcl subs - help to use substitution(Not allowed for Pirates(eSports) Division)\n\n\n
All Warriors of WCL 🙂\n
wcl abbs - lists all the clan abbreviations for a division\n
wcl reps - lists the clan representative for a clan\n
wcl roster - lists the clan's roster\n\n\n
More commands coming soon.........`
        message.channel.send('```plaintext\n'+com+'\n```')
    }
}