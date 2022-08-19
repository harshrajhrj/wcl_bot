const paginationembed = require('discord-paginationembed');
const Discord = require('discord.js');
module.exports = async function showEmbed(message, args, embedData, embedType) {
    try {
        if (embedType === "roster") {
            const { headerName, roster, thumbnail, townHalls, rosterSize, additionStatusLimit, clanName } = embedData;
            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor('#1980de')
                .setThumbnail(thumbnail)
                .setAuthor('By WCL Technical')
                .setTitle(`Submitted roster of ${args[0].toUpperCase()} | ${clanName}!`)
                .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + roster.slice(0, 1984) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (roster.length > 1984) {
                const embedagain = new Discord.MessageEmbed()
                    .setColor('#1980de')
                    .setThumbnail(thumbnail)
                    .setAuthor('By WCL Technical')
                    .setTitle(`Submitted roster of ${args[0].toUpperCase()} | ${clanName}!`)
                    .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + roster.slice(1984, roster.length) + "```")
                    .setTimestamp()
                embeds.push(embedagain);
            }

            if (embeds.length === 1) {
                message.channel.send(embeds[0].addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${townHalls['th14']}**\n<:townhall13:766289069486506004> | **${townHalls['th13']}**\n<:townhall12:766289153766850562> | **${townHalls['th12']}**\n<:townhall11:766289216661356564> | **${townHalls['th11']}**\n**Less than** <:townhall11:766289216661356564> | **${townHalls['less than 11']}**\n**Total Accounts** | **${rosterSize}**\n**Addition Left** | **${additionStatusLimit}**`).setFooter(`Page 1/1`));
            }
            else {
                let m1 = 0;
                embeds.map(function (r) { m1++; return r.addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${townHalls['th14']}**\n<:townhall13:766289069486506004> | **${townHalls['th13']}**\n<:townhall12:766289153766850562> | **${townHalls['th12']}**\n<:townhall11:766289216661356564> | **${townHalls['th11']}**\n**Less than** <:townhall11:766289216661356564> | **${townHalls['less than 11']}**\n**Total Accounts** | **${rosterSize}**\n**Addition Left** | **${additionStatusLimit}**`).setFooter(`Page ${m1}/2`) })
                const Embeds = new paginationembed.Embeds()
                    .setArray(embeds)
                    .setTimeout(300000)
                    .setChannel(message.channel)
                    .setDisabledNavigationEmojis(['all'])
                    .setDisabledNavigationEmojis(['back', 'forward', 'jump'])
                    .setFunctionEmojis({
                        '◀️': (_, instance) => {
                            instance.setPage('back');
                        },
                        '▶️': (_, instance) => {
                            instance.setPage('forward');
                        },
                    })

                await Embeds.build();
            }
        } else if (embedType === "abbs") {
            const { color, logo, col, div } = embedData;
            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor('By WCL Technical')
                .setThumbnail(logo)
                .setTitle(`Clan Abbreviations for ${div}!`)
                .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(0, 1972) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (col.length > 1972) {
                const embed1 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo)
                    .setTitle(`Clan Abbreviations for ${div}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(1972, 3944) + "```")
                    .setTimestamp()
                embeds.push(embed1);
            }
            if (col.length > 3944) {
                const embed2 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo)
                    .setTitle(`Clan Abbreviations for ${div}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(3944, 5916) + "```")
                    .setTimestamp()
                embeds.push(embed2);
            }
            if (col.length > 5916) {
                const embed3 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo)
                    .setTitle(`Clan Abbreviations for ${div}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(5916, col.length) + "```")
                    .setTimestamp()
                embeds.push(embed3);
            }

            if (embeds.length === 1) {
                message.channel.send(embeds[0].setFooter(`Page 1/1`));
            }
            else {
                let m1 = 0;
                embeds.map(function (r) { m1++; return r.setFooter(`Page ${m1}/${embeds.length}`) })
                const Embeds = new paginationembed.Embeds()
                    .setArray(embeds)
                    .setTimeout(600000)
                    .setChannel(message.channel)
                    /* Sets the client's assets to utilise. Available options:
                     *  - message: the client's Message object (edits the message instead of sending new one for this instance)
                     *  - prompt: custom content for the message sent when prompted to jump to a page
                     *      {{user}} is the placeholder for the user mention
                     *.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                     */
                    .setDeleteOnTimeout(false)
                    .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                    .setFunctionEmojis({
                        /*'⏮️': (_,instance) => { //to be enabled during season 9
                            instance.setPage(1);
                        },*/
                        '◀️': (_, instance) => {
                            instance.setPage('back');
                        },
                        '▶️': (_, instance) => {
                            instance.setPage('forward');
                        },
                        /*'⏭️': (_,instance) => { //to be enabled during season 9
                            instance.setPage(4);
                        },*/
                        '🔄': (_, instance) => {
                            instance.resetEmojis();
                        }
                    })

                await Embeds.build();
            }
        } else if (embedType === 'searchRoster') {
            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor('#1980de')
                .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                .setAuthor('By WCL Technical')
                .setTitle(`Search results for ${args[0].toUpperCase()}!`)
                .setDescription("```" + `Abb  Player Tag   Division  Player Name` + `\n\n` + embedData.slice(0, 1984) + "```")
                .setTimestamp()
            embeds.push(embed);
            message.channel.send(embeds[0].setFooter(`Page 1/1`));
        } else if (embedType === 'viewdual') {
            const { div, embeddata } = embedData;
            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor("#1980de")
                .setAuthor('By WCL Technical')
                .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                .setTitle(`Found duals for ${div}!`)
                .setDescription("```" + `Abb  Player Tag   Player Name      Clan Name` + `\n\n` + embeddata.slice(0, 4004) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (embeddata.length > 4004) {
                const embed1 = new Discord.MessageEmbed()
                    .setColor("#1980de")
                    .setAuthor('By WCL Technical')
                    .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                    .setTitle(`Found duals for ${div}!`)
                    .setDescription("```" + `Abb  Player Tag   Player Name      Clan Name` + `\n\n` + embeddata.slice(4004, embeddata.length) + "```")
                    .setTimestamp()
                embeds.push(embed1);
            }

            if (embeds.length === 1) {
                message.channel.send(embeds[0].setFooter(`Page 1/1`));
            }
            else {
                let m1 = 0;
                embeds.map(function (r) { m1++; return r.setFooter(`Page ${m1}/${embeds.length}`) })
                const Embeds = new paginationembed.Embeds()
                    .setArray(embeds)
                    .setTimeout(600000)
                    .setChannel(message.channel)
                    /* Sets the client's assets to utilise. Available options:
                     *  - message: the client's Message object (edits the message instead of sending new one for this instance)
                     *  - prompt: custom content for the message sent when prompted to jump to a page
                     *      {{user}} is the placeholder for the user mention
                     *.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                     */
                    .setDeleteOnTimeout(false)
                    .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                    .setFunctionEmojis({
                        /*'⏮️': (_,instance) => { //to be enabled during season 9
                            instance.setPage(1);
                        },*/
                        '◀️': (_, instance) => {
                            instance.setPage('back');
                        },
                        '▶️': (_, instance) => {
                            instance.setPage('forward');
                        },
                        /*'⏭️': (_,instance) => { //to be enabled during season 9
                            instance.setPage(4);
                        },*/
                        '🔄': (_, instance) => {
                            instance.resetEmojis();
                        }
                    })

                await Embeds.build();
            }
        }
    } catch (err) {
        console.log(err.message);
        message.reply(err.message);
    }
}