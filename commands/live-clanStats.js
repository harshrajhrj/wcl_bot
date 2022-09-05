const { ClanModel } = require("../data_models/standingsModel");
const ErrorHandler = require("../utility/errorUtils");
const ResourcesUtils = require("../utility/resourcesUtils");
const PaginationEmbed = require("discord-paginationembed");
const Utility = require("../utility/utility");
const { MessageEmbed } = require("discord.js");

/*
module.exports = {
    name : "clanstats",
    aliases : ['cs','clanstats'],
    description: 'Lists the official standings of WCL for a particular division',
    args: true,
    length: 1,
    category: "all",
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl clanstats ES',
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

                // if(opp.status === "UNDECLARED") continue;
                
                var oppTeamName = await (await Utility.getClanByAbb(opp.abb)).teamName;
                var pageTitle = `${obj.teamName} VS ${oppTeamName}`;
                const oppRecords = await indWarSchema.findOne({abb : opp.abb});
                const oppClan = new ClanModel(oppRecords);
                const oppPerDest = await oppClan.getOpponent(wk).perDest;
                var emb = new MessageEmbed()
                    .setAuthor(author)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setTitle(pageTitle)
                    .setDescription(`${obj.teamName} => ${opp.starsFor} <:c_star:1016290573994442824>  ${opp.perDest}\n${oppTeamName} => ${opp.starAgainst} <:c_star:1016290573994442824>  ${oppPerDest}`)
                
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
*/

// /**
//      * @static
//      * @async
//      * @param {String} title 
//      * @param {String} descValues 
//      * @param {String} color 
//      * @param {String} thumbnailURL
//      * @return {Promise<MessageEmbed[]>} Array of Embeds.
//      */
//  static async createStandingsEmbeds(title, descValues, color, thumbnailURL){
//     const { MessageEmbed } = require("discord.js");
//     var Embeds = [];
//     const author = "By WCL Technical";
//     const infoDesc = "1) A.S.D - Average Star Differential\n2) A.D.P - Average Destruction Percentage\n3) Grp_No - Group Number\n4) Grp_Rec - Group Record\nMobile users are requested to see the preview in landscape mode :pager:";
//     const descHeader = `Rank Team Name       W/T/L A.S.D A.D.P  Grp_No Grp_Rec\n\n`;

//     // per row size = 56, description limit = 4096, description header size on this command = 56
//     // 4096 - 56 = 4040 available for description value i.e rows. 
//     //therefore  4040 is descValuePerPage size
//     // 4040 - 56 = 3984
//     var descValuePerPage = 3984;
//     var valueStart = 0;
//     var valueEnd = descValuePerPage;
//     var valueLength = descValues.length;
//     while(valueLength > 0){
//         const emb = new MessageEmbed()
//                 .setAuthor(author)
//                 .setColor(color)
//                 .setThumbnail(thumbnailURL)
//                 .setTitle(title)
//                 .setDescription("```" + descHeader + descValues.slice(valueStart, valueEnd) + "```")
//                 .addFields({name:"Information", value : infoDesc})
//                 .setTimestamp();
//         Embeds.push(emb);
        
//         valueStart = valueEnd;
//         valueEnd += descValuePerPage;
//         valueLength -= descValuePerPage;
//     }
//     return Embeds;
// }
