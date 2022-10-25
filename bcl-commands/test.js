module.exports = {
    name: 'test',
    aliases: ['test'],
    description: 'test command for bcl',
    args: false,
    length: 1,
    missing: ['`clan_abbreviation`'],
    usage: 'clan_abb',
    explanation: 'Ex: wcl logo INQ\nwhere INQ is clan_abb',
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780')) {
        if (message.author.id === '531548281793150987') {
            message.channel.send("successful");
        }
    }
}