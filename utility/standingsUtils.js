/**
 * A utility class to assist performing `standings` command.
 * **Note all methods are static.**
 */
class StandingsUtils{
    /**
     * @static
     * @async
     * @param {String} title 
     * @param {String} descValues 
     * @param {String} color 
     * @param {String} thumbnailURL
     * @return {Promise<MessageEmbed[]>} Array of Embeds.
     */
    static async createStandingsEmbeds(title, descValues, color, thumbnailURL){
        const { MessageEmbed } = require("discord.js");
        var Embeds = [];
        const author = "By WCL Technical";
        const infoDesc = "1) A.S.D - Average Star Differential\n2) A.D.P - Average Destruction Percentage\n3) Grp_No - Group Number\n4) Grp_Rec - Group Record\nMobile users are requested to see the preview in landscape mode :pager:";
        const descHeader = `Rank Team Name       W/T/L A.S.D A.D.P  Grp_No Grp_Rec\n\n`;

        // per row size = 56, description limit = 4096, description header size on this command = 56
        // 4096 - 56 = 4040 available for description value i.e rows. 
        // 56 * 72 = 4032 (per row size multiply by number of rows to be displayed)
        // 4032 < 4040(char limit available)
        var descValuePerPage = 4032;
        var valueStart = 0;
        var valueEnd = descValuePerPage;
        var valueLength = descValues.length;
        while(valueLength > 0){
            const emb = new MessageEmbed()
                    .setAuthor(author)
                    .setColor(color)
                    .setThumbnail(thumbnailURL)
                    .setTitle(title)
                    .setDescription("```" + descHeader + descValues.slice(valueStart, valueEnd) + "```")
                    .addFields({name:"Information", value : infoDesc})
                    .setTimestamp();
            Embeds.push(emb);
            
            valueStart = valueEnd;
            valueEnd += descValuePerPage;
            valueLength -= descValuePerPage;
        }
        return Embeds;
    }


    /**
     * @static
     * @async
     * @param {String} abb of the clan.
     * @returns {Promise<String>} ClanName/TeamName.
     */
    static async getTeamName(abb){
        const fs = require("fs");
        const abbs = fs.readFileSync("./commands/abbs.json");
        const j = JSON.parse(abbs).values; // array of array with index 0 = clanTag, 1 = teamName, 2 = abb, 3 = div

        for(let element of j){
            if (element[2] == abb) {
                return element[1].trim();
            }
        }
    }
}

module.exports = StandingsUtils;