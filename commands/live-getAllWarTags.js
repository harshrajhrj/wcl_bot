//Returns a string: "#clanTag1 #oppClanTag1 #clanTag2 #oppClanTag2 ...." and so on
//The above string to be copy pasted into minion bot setmatches command.

const { ClanModel } = require("../data_models/standingsModel")
const ResourcesUtils = require('../utility/resourcesUtils');
const ErrorHandler = require("../utility/errorUtils");
const Utility = require("../utility/utility");


module.exports = {
    name : "getAllWarTags",
    aliases : ["getwartags","gwt"],
    description: "Lists the clan tags of wars of WCL for a particular division, week.\nIn the form of `#clanTag1 #oppTag1 #clanTag2 #oppTag2 ...`",
    args: true,
    length: 2,
    category: "all",
    usage: "divisionPrefix weekPrefix",
    missing: ["`divisionPrefix`, ", "`weekPrefix`"],
    explanation: "Ex: wcl getWarTags H WK1\nwhere H - Heavyweight division\nWK1 - Week 1",
    execute : async (message, args) => {
        
        const divAbbs = ResourcesUtils.DIVISION_ABBS;
        const weekAbbs = ResourcesUtils.WEEK_ABBS;

        //user entered arg for divisionPrefix and weekPrefix.
        const extractedDivValue = args[0].toUpperCase();
        const extractedWeekValue = args[1].toUpperCase();
        
        //checks in both key and value to find out division. 
        const div = (divAbbs[extractedDivValue] || Object.values(divAbbs).includes(extractedDivValue))?  Utility.getKeyByValue(divAbbs,extractedDivValue) || extractedDivValue: null;
        const week = (weekAbbs[extractedWeekValue])? weekAbbs[extractedWeekValue] : null;

        //if div or week is null, then invalid division input. 
        if(!div) return message.reply(`Invalid division abbreviation/name: \`${extractedDivValue}\`!`);
        if(!week || parseInt(week.slice(2)) > 7) return message.reply(`Invalid week abbreviation: \`${extractedWeekValue}\`!\nValid week abbreviations: \`WK1, WK2, WK3, WK4, WK5, WK6, WK7\``);

        try {
            const indWarSchema = require("./war&schedule&standings/individualWarRecord")
            const records = await indWarSchema.find({div : divAbbs[div]});
            var msg = "";
            var byeWarsMsg = "";
            var clansInMsg = [];

            for(let record of records){
                let clan = new ClanModel(record);

                //go to next iteration is clanTag already exists in msg to avoid duplicate wars.
                if(clansInMsg.includes(clan.clanTag)) continue;

                let opp = await clan.getOpponent(week);

                //go to next iteration if clan or opp is BYE
                if(clan.clanTag === "BYE" || opp.clanTag === "BYE"){
                    byeWarsMsg += (clan.clanTag === "BYE")? `${opp.clanTag} vs BYE` : `${clan.clanTag} vs BYE\n`;
                    continue;
                }

                msg += `${clan.clanTag} ${opp.clanTag} `;
                clansInMsg.push(clan.clanTag);
                clansInMsg.push(opp.clanTag);
            }

            var output = "```\n" + msg + "\n```" + `Number of matches of \`${week}\` in ${divAbbs[div]} = ${clansInMsg.length/2}`;
            if(byeWarsMsg.length > 0) output += `\n\nBye wars of \`${week}\` in ${divAbbs[div]}:` + "\n```" + byeWarsMsg + "\n```";
            message.channel.send(output);
        } catch (error) {
            return await ErrorHandler.unexpectedErrorHandler(error,message);
        }
    }
}