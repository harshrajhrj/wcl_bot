module.exports = {
    name: 'help',
    aliases: ['help'],
    description: 'Lists the commands for BCL',
    args: false,
    execute: async (message) => {
        const notForUseChannels = require('./live-notForUseChannels');

        const com = `Roster Rep Only
bcl add - allows you to add a player to the roster
bcl remove - allows you to remove a player from the roster\n\n
Representative Only
bcl sch - go for a war scheduling
bcl delsch - delete a scheduled war
bcl subs - Allows you to take a subtitute!(NOT AVAILABLE)
More commands coming soon.........\n\n
Streamer Only
bcl claim - To claim a war for streaming(for streamer purpose only)
bcl unclaim - To unclaim a war for streaming(for streamer purpose only)
More commands coming soon.........\n\n
All Participants of BCL 🙂
bcl abbs - lists all the clan abbreviations for a division
bcl attackframe - shows Champion(eSports) attack frame
bcl activewars - List all the active wars in a particular division
bcl forfeitwars - List all the forfeit wars in a particular division
bcl listwars - list all the scheduled wars in a particular division for a week
bcl pendingwars - List all the pending wars in a particular division in specific week
bcl reps - lists the clan representative for a clan
bcl roster - lists the clan's roster
bcl search - searches a player for all available rosters
bcl standings - lists official standing according to a division
bcl stats - shows scheduled war detail with the war stats(if active)
bcl vdual - shows all duals in a particular division
bcl viewwars - shows all war scores of a particular clan
More commands coming soon.........`
        if (!notForUseChannels.includes(message.channel.id))
            return message.channel.send('```plaintext\n' + com + '\n```')
        else
            return message.reply(`Please use this command anywhere else!`)
    }
}