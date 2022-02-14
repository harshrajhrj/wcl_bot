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
wcl roster - lists the clan's roster\n
wcl fw - lists the weekly record for a clan and group standings for a clan\n
wcl search - searches a player for being rostered in any team participating in WCL\n
wcl sdual - searches a dual for being rostered in more than one team participating in WCL\n
wcl standings - lists down the standings\n
wcl logo - shows you a clan logo\n
wcl attack_frame - lists the attack and time frames of WCL eSports wars\n
wcl getwars - lists all the scheduled wars for a particular week being searched\n
wcl warinfo - show the info of a scheduled war via warID\n
wcl checkroster - help you to scan unrostered players in a live war roster\n\n\n
More commands coming soon.........`
        message.channel.send('```plaintext\n'+com+'\n```')
    }
}