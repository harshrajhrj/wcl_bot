const { ClanModel } = require("../data_models/standingsModel");
const ErrorHandler = require("../utility/errorUtils");
const ResourcesUtils = require("../utility/resourcesUtils");
const PaginationEmbed = require("discord-paginationembed");
const Utility = require("../utility/utility");
const { MessageEmbed } = require("discord.js");


module.exports = {
    name : "viewwars",
    aliases : ["vw", "viewwar", "viewwars"],
    description: "View war stats of a clan.",
    args: true,
    length: 1,
    category: "all",
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl viewwars ES',
    execute : async (message, args) => {
        const divAbbs = ResourcesUtils.DIVISION_ABBS;
        const divColor = ResourcesUtils.DIVISION_COLOR;
        const logoURL = ResourcesUtils.DIVISION_LOGO_URL;

        //user entered arg for clanAbb.
        const extractedAbbValue = args[0].toUpperCase();

        //search for clan with the user entered clanAbb, if not found value will be null.
        const obj = await Utility.getClanByAbb(extractedAbbValue);

        if(!obj) return message.reply(`Invalid clanAbb: \`${extractedAbbValue}\`!\nRun \`wcl abbs\` to list the valid clanAbbs.`);

        const divCode = Utility.getKeyByValue(divAbbs, obj.division);
        const color = divColor[divCode];
        const thumbnail = logoURL[divCode];

        try {
            const indWarSchema = require("./war&schedule&standings/individualWarRecord")
            const records = await indWarSchema.findOne({abb : obj.abb});
            const clan = new ClanModel(records);
            const title = `Clan Stats for ${obj.teamName}`
            const author = "By WCL Technical";

            var embeds = [];
            const embed1 = new MessageEmbed()
                .setAuthor(author)
                .setColor(color)
                .setThumbnail(thumbnail)
                .setTitle(title)
                .addField("W/T/L",`${clan.wins}/${clan.ties}/${clan.loses}`,false)
                .addField("Stars",`\`\`\`\nAverage Star Diff => ${clan.averageSD}\nTotal Stars For => ${clan.starsFor}\nTotal Stars Against => ${clan.starsAgainst}\n\`\`\``,false)
                .addField("Percentage",`\`\`\`\nAverage Destruction % => ${clan.averagePerDest}%\n\`\`\``,false);
                
            embeds.push(embed1);
            // message.channel.send(embed1);
            const weeks = Object.keys(clan.opponents); //["WK1","WK2", ...]
            for(let wk of weeks){
                const opp = await clan.getOpponent(wk);
                
                //skip iterations for undeclared wars.
                if(opp.status === "UNDECLARED") continue;
                
                var oppTeamName = await (await Utility.getClanByAbb(opp.abb)).teamName;
                var pageTitle = `${wk}\n${obj.teamName} \`vs\` ${oppTeamName}`;
                const oppRecords = await indWarSchema.findOne({abb : opp.abb});
                const oppClan = new ClanModel(oppRecords);
                const oppPerDest = await (await oppClan.getOpponent(wk)).perDest;
                var winnerString = (opp.status === "T") ? "Tie" : (opp.status === "W") ? `Winner: ${obj.teamName}` : `Winner: ${oppTeamName}`;

                var emb = new MessageEmbed()
                    .setAuthor(author)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setTitle(pageTitle)
                    .setDescription(`${obj.teamName} => ${opp.starFor} <:star:1017468754692677822>   ${opp.perDest}%\n\n${oppTeamName} => ${opp.starAgainst} <:star:1017468754692677822>   ${oppPerDest}%\n\n\n${winnerString}`)
                
                embeds.push(emb);
                }

                if(embeds.length === 1){
                    message.channel.send(embeds[0].setFooter("Page 1/1"));
                }else{
                    //if more than 1 embed is created then send it as a embed pagination.
                    let pageCount = 0; 
                    embeds.map((e) => { pageCount++; return e.setFooter(`Page ${pageCount}/${embeds.length}`)});
    
                    const Embeds = new PaginationEmbed.Embeds()
                        .setArray(embeds)
                        .setTimeout(120000) //2 mins
                        .setChannel(message.channel)
                        .setDeleteOnTimeout(false)
                        .setDisabledNavigationEmojis(["back","forward","jump","delete"])
                        .setFunctionEmojis({
                            '◀️': (_, instance) => {
                                instance.setPage('back');
                            },
                            '▶️': (_, instance) => {
                                instance.setPage('forward');
                            },
                            '⛔': (_, instance) => {
                                //stops awaiting on click.
                                instance.setTimeout(5);
                            }
                        })
                    await Embeds.build();
                }
        } catch (error) {
            return await ErrorHandler.unexpectedErrorHandler(error,message);
        }
    }
}