const { ClanModel } = require("../data_models/standingsModel");
const ErrorHandler = require("../utility/errorUtils");
const ResourcesUtils = require("../utility/resourcesUtils");
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
    explanation: 'Ex: bcl viewwars ES',
    execute : async (message, args) => {
        const divAbbs = ResourcesUtils.DIVISION_ABBS;
        const divColor = ResourcesUtils.DIVISION_COLOR;
        const logoURL = ResourcesUtils.DIVISION_LOGO_URL;

        //user entered arg for clanAbb.
        const extractedAbbValue = args[0].toUpperCase();

        //search for clan with the user entered clanAbb, if not found value will be null.
        const obj = await Utility.getClanByAbb(extractedAbbValue);
        if(!obj) return message.reply(`Invalid clanAbb: \`${extractedAbbValue}\`!\nRun \`bcl abbs\` to list the valid clanAbbs.`);

        const divCode = Utility.getKeyByValue(divAbbs, obj.division);
        const color = divColor[divCode];
        const thumbnail = logoURL[divCode];

        try {
            const indWarSchema = require("./war&schedule&standings/individualWarRecord")
            const records = await indWarSchema.findOne({abb : obj.abb});
            if(!records) return message.reply(`No wars found for \`${extractedAbbValue}\`!`);
            const clan = new ClanModel(records);
            const title = `Wars of ${obj.teamName}`
            const author = "By BCL Technical";
            const descInfo = `\\*F - Stars For\n\\*A - Stars Against\n% - Percentage Destruction\nNote - The W/L/T, \\*For and % are of the "For" Team\nMobile users are requested to see the preview in landscape mode 📟`;

            var emb = new MessageEmbed()
                .setAuthor(author)
                .setColor(color)
                .setThumbnail(thumbnail)
                .setTitle(title)
                .setTimestamp();

            const weeks = Object.keys(clan.opponents); //["WK1","WK2", ...]
            let row = "";
            for(let wk of weeks){
                const opp = await clan.getOpponent(wk);
                var oppTeamName = await (await Utility.getClanByAbb(opp.abb)).teamName;
                let starsFor = opp.starFor;
                let starsAgainst = opp.starAgainst;
                let perDest = opp.perDest.toFixed(2).replace(/.00$/, ""); //if 60.00 then just 60 elseif 60.25 then 60.25
                let status = opp.status;
                
                if(["W","L","T"].includes(status)){
                    row += `${wk} ${obj.teamName.padEnd(15, " ").substring(0, 15)} ${oppTeamName.padEnd(15, " ").substring(0, 15)} ${status}   ${starsFor} ${starsAgainst} ${perDest}\n`;
                }else{
                    row += `${wk} ${obj.teamName.padEnd(15, " ").substring(0, 15)} ${oppTeamName.padEnd(15, " ").substring(0, 15)} -   - - -\n`;
                }
            }

            emb.setDescription(`\`\`\`WK# ${`FOR`.padEnd(15, " ").substring(0, 15)} ${`AGAINST`.padEnd(15, " ").substring(0, 15)} W/L/T *F *A %\`\`\`\n\n\`\`\`${row}\`\`\`\n${descInfo}`);
            message.channel.send(Embeds=emb);
        } catch (error) {
            return await ErrorHandler.unexpectedErrorHandler(error,message);
        }
    }
}