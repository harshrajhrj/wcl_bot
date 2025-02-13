const { StandingsModel } = require("../data_models/standingsModel");
const PaginationEmbed = require("discord-paginationembed");
const ResourcesUtils = require("../bclutility/resourcesUtils");
const Utility = require("../bclutility/utility");
const StandingsUitls = require("../bclutility/standingsUtils");
const ErrorHandler = require("../bclutility/errorUtils");


module.exports = {
    name: "standings",
    aliases: ['std', 'standings', 'rank'],
    description: 'Lists the official standings of BCL for a particular division',
    args: true,
    length: 1,
    category: "all",
    usage: 'divisionPrefix',
    missing: ['`divisionPrefix`'],
    explanation: 'Ex: bcl rank H\nwhere CS - Champions(Esports)',
    execute: async (message, args) => {
        const divAbbs = ResourcesUtils.DIVISION_ABBS;
        const divColor = ResourcesUtils.DIVISION_COLOR;
        const divLogoURL = ResourcesUtils.DIVISION_LOGO_URL;

        //user entered arg for divisionPrefix.
        const extractedDivValue = args[0].toUpperCase();

        //checks in both key and value to find out division. 
        const div = (divAbbs[extractedDivValue] || Object.values(divAbbs).includes(extractedDivValue)) ? Utility.getKeyByValue(divAbbs, extractedDivValue) || extractedDivValue : null;

        //if div is null, then invalid division input. 
        if (!div) return message.reply(`Invalid division abbreviation/name: \`${extractedDivValue}\`!`);

        try {
            const indWarSchema = require("./war&schedule&standings/individualWarRecord")
            const records = await indWarSchema.find({ div: divAbbs[div] });

            //if no wars found, return
            if(records.length === 0) return message.reply(`No wars were found for \`${div}\` division to form standings!`);
            const sortedClanRecords = await StandingsModel.sort(records);
            var row = "";
            let rank = 1;

            //creating desciption value i.e formatting clan records into a string.
            for (let clan of sortedClanRecords) {
                clan.name =  await (await Utility.getClanByAbb(clan.abb)).teamName
                let record = `${clan.wins}/${clan.ties}/${clan.loses}`
                row += `${`#${rank}`.padEnd(4, " ")} ${clan.name.padEnd(15, " ").substring(0, 15)} ${record.padEnd(5, " ")} ${(clan.averageSD).toFixed(2).toString().padEnd(5, " ")} ${(clan.averagePerDest).toFixed(2).toString().padEnd(6, " ")} ${"0".padEnd(6, " ")} ${"0".padEnd(7, " ")}\n\n`;
                rank++;
            }
        } catch (error) {
            return await ErrorHandler.unexpectedErrorHandler(error, message);
        }

        //creating embed pagination. 
        try {
            const color = divColor[div];
            const thumbnail = divLogoURL[div];
            const title = `BCL Standings for ${divAbbs[div]} Division!`;

            const embeds = await StandingsUitls.createStandingsEmbeds(title, row, color, thumbnail);

            //if only 1 embed is created then just send it as a embed,
            if (embeds.length === 1) {
                message.channel.send(embeds[0].setFooter("Page 1/1"));
            } else {
                //if more than 1 embed is created then send it as a embed pagination.
                let pageCount = 0;
                embeds.map((e) => { pageCount++; return e.setFooter(`Page ${pageCount}/${embeds.length}`) });

                const Embeds = new PaginationEmbed.Embeds()
                    .setArray(embeds)
                    .setTimeout(240000) //4 mins
                    .setChannel(message.channel)
                    .setDeleteOnTimeout(false)
                    .setDisabledNavigationEmojis(["back", "forward", "jump", "delete"])
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
        } catch (err) {
            return await ErrorHandler.unexpectedErrorHandler(err, message);;
        }
    }
}