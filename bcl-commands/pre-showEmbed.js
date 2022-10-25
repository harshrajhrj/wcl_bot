const paginationembed = require('discord-paginationembed');
const Discord = require('discord.js');
module.exports = async function showEmbed(message, args, embedData, embedType) {
    try {
        if (embedType === "roster") {
            const { headerName, roster, thumbnail, townHalls, rosterSize, additionStatusLimit, clanName, maxRosterSize, totalAdditions } = embedData;
            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor('#f2961e')
                .setThumbnail(thumbnail)
                .setAuthor('By BCL Technical')
                .setTitle(`Submitted roster of ${args[0].toUpperCase()} | ${clanName}!`)
                .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + roster.slice(0, 1984) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (roster.length > 1984) {
                const embedagain = new Discord.MessageEmbed()
                    .setColor('#f2961e')
                    .setThumbnail(thumbnail)
                    .setAuthor('By BCL Technical')
                    .setTitle(`Submitted roster of ${args[0].toUpperCase()} | ${clanName}!`)
                    .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + roster.slice(1984, roster.length) + "```")
                    .setTimestamp()
                embeds.push(embedagain);
            }

            if (embeds.length === 1) {
                message.channel.send(embeds[0].addField(`**Roster Information**`, `<:townhall15:1033255562026168400> | **${townHalls['th15']}**\n<:townhall14:842730161718820885> | **${townHalls['th14']}**\n<:townhall13:766289069486506004> | **${townHalls['th13']}**\n<:townhall12:766289153766850562> | **${townHalls['th12']}**\n<:townhall11:766289216661356564> | **${townHalls['th11']}**\n<:townhall10:766289275490533426> | **${townHalls['th10']}**\n**Less than** <:townhall10:766289275490533426> | **${townHalls['less than 10']}**\n**Total Accounts** | **${rosterSize}/${maxRosterSize}**\n**Addition Left** | **${additionStatusLimit}/${totalAdditions}**`).setFooter(`Page 1/1`));
            }
            else {
                let m1 = 0;
                embeds.map(function (r) { m1++; return r.addField(`**Roster Information**`, `<:townhall15:1033255562026168400> | **${townHalls['th15']}**\n<:townhall14:842730161718820885> | **${townHalls['th14']}**\n<:townhall13:766289069486506004> | **${townHalls['th13']}**\n<:townhall12:766289153766850562> | **${townHalls['th12']}**\n<:townhall11:766289216661356564> | **${townHalls['th11']}**\n<:townhall10:766289275490533426> | **${townHalls['th10']}**\n**Less than** <:townhall10:766289275490533426> | **${townHalls['less than 10']}**\n**Total Accounts** | **${rosterSize}/${maxRosterSize}**\n**Addition Left** | **${additionStatusLimit}/${totalAdditions}**`).setFooter(`Page ${m1}/2`) })
                const Embeds = new paginationembed.Embeds()
                    .setArray(embeds)
                    .setTimeout(300000)
                    .setChannel(message.channel)
                    .setDisabledNavigationEmojis(['all'])
                    .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
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
                .setAuthor('By BCL Technical')
                .setThumbnail(logo)
                .setTitle(`Clan Abbreviations for ${div}!`)
                .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(0, 1972) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (col.length > 1972) {
                const embed1 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor('By BCL Technical')
                    .setThumbnail(logo)
                    .setTitle(`Clan Abbreviations for ${div}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(1972, 3944) + "```")
                    .setTimestamp()
                embeds.push(embed1);
            }
            if (col.length > 3944) {
                const embed2 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor('By BCL Technical')
                    .setThumbnail(logo)
                    .setTitle(`Clan Abbreviations for ${div}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(3944, 5916) + "```")
                    .setTimestamp()
                embeds.push(embed2);
            }
            if (col.length > 5916) {
                const embed3 = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor('By BCL Technical')
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
                .setColor('#f2961e')
                .setThumbnail('https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612')
                .setAuthor('By BCL Technical')
                .setTitle(`Search results for ${args[0].toUpperCase()}!`)
                .setDescription("```" + `Abb  Player Tag   Division  Player Name` + `\n\n` + embedData.slice(0, 1984) + "```")
                .setTimestamp()
            embeds.push(embed);
            message.channel.send(embeds[0].setFooter(`Page 1/1`));
        } else if (embedType === 'viewdual') {
            const { div, embeddata } = embedData;
            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor('#f2961e')
                .setAuthor('By BCL Technical')
                .setThumbnail('https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612')
                .setTitle(`Found duals for ${div}!`)
                .setDescription("```" + `Abb  Player Tag   Player Name      Clan Name` + `\n\n` + embeddata.slice(0, 4004) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (embeddata.length > 4004) {
                const embed1 = new Discord.MessageEmbed()
                    .setColor('#f2961e')
                    .setAuthor('By BCL Technical')
                    .setThumbnail('https://media.discordapp.net/attachments/766306691994091520/1034435209984233562/BCL_S2.png?width=500&height=612')
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
        } else if (embedType === 'schedule') {
            await message.react('✅');
            const { color, warID, thumbnail, week, div, clan, opponent, dow, tow, duration, scheduledBy, approvedBy } = embedData;
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`Schedule/War ID : ${warID}`)
                .setThumbnail(thumbnail)
                .setAuthor('By BCL')
                .addField('Week', week, false)
                .addField('Division', div, false)
                .addField('Clan 1', clan, true)
                .addField('Clan 2', opponent, false)
                .addField('Scheduled On', ':calendar: ' + dow, true)
                .addField('Time(EST)', ':clock1: ' + tow, false)
                .addField('Duration', ':timer: ' + duration, false)
                .addField('Scheduled By', `<@${scheduledBy}>`, false)
                .addField('Agreed By', `<@${approvedBy}>`, false)
                .setTimestamp()
                .setFooter('Agreed Time will be in EST Time Zone!')
            await message.channel.send(embed);
        } else if (embedType === 'stats') {
            const { embedArr } = embedData;
            const embeds = [];
            embedArr.forEach(embed => {
                const Embed = new Discord.MessageEmbed()
                    .setColor(embed.color)
                    .setTitle(`Schedule/War ID : ${embed.warID}`)
                    .setThumbnail(embed.thumbnail)
                    .setAuthor('By BCL')
                    .addField('Week', embed.week, false)
                    .addField('Division', embed.div, false)
                    .addField('Clan 1', embed.clan, true)
                    .addField('Clan 2', embed.opponent, false)
                    .addField('Scheduled On', ':calendar: ' + embed.dow, true)
                    .addField('Time(EST)', ':clock1: ' + embed.tow, false)
                    .addField('Duration', ':timer: ' + embed.duration, false)
                    .addField('Scheduled By', `<@${embed.scheduledBy}>`, false)
                    .addField('Agreed By', `<@${embed.approvedBy}>\n\u200B`, false)
                    .addField('⚔️-----WAR STATS-----⚔️', '\u200B')
                    .addField(`Clan - ${embed.clanStats.abb}`, `⭐ ${embed.clanStats.star}`, false)
                    .addField(`Clan - ${embed.clanStats.abb}`, `${embed.clanStats.dest}%`, false)
                    .addField(`Opponent - ${embed.opponentStats.abb}`, `⭐ ${embed.opponentStats.star}`, false)
                    .addField(`Opponent - ${embed.opponentStats.abb}`, `${embed.opponentStats.dest}%`, false)
                    .addField('Status', embed.status, false)
                    .setTimestamp()
                embeds.push(Embed);
            })
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
        } else if (embedType === 'activewars') {
            const embedArr = embedData
            const embeds = [];
            embedArr.forEach(embed => {
                const Embed = new Discord.MessageEmbed()
                    .setColor(embed.color)
                    .setTitle(`Schedule/War ID : ${embed.warID}`)
                    .setThumbnail(embed.thumbnail)
                    .setAuthor('By BCL')
                    .addField('Week', embed.week, false)
                    .addField('Clan 1', embed.clan, true)
                    .addField('Clan 2', embed.opponent, false)
                    .addField('Status', embed.status, false)
                    .setTimestamp()
                embeds.push(Embed);
            })
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
                    '⏮️': (_, instance) => {
                        instance.setPage(1);
                    },
                    '◀️': (_, instance) => {
                        instance.setPage('back');
                    },
                    '▶️': (_, instance) => {
                        instance.setPage('forward');
                    },
                    '⏭️': (_, instance) => {
                        instance.setPage(m1);
                    },
                    '🔄': (_, instance) => {
                        instance.resetEmojis();
                    }
                })

            await Embeds.build();
        } else if (embedType === 'forfeitwars') {
            const embedArr = embedData
            const embeds = [];
            embedArr.forEach(embed => {
                const Embed = new Discord.MessageEmbed()
                    .setColor(embed.color)
                    .setTitle(`Schedule/War ID : ${embed.warID}`)
                    .setThumbnail(embed.thumbnail)
                    .setAuthor('By BCL')
                    .addField('Week', embed.week, false)
                    .addField('Clan 1', embed.clan, true)
                    .addField('Clan 2', embed.opponent, false)
                    .addField('Status', embed.status, false)
                    .setTimestamp()
                embeds.push(Embed);
            })
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
                    '⏮️': (_, instance) => {
                        instance.setPage(1);
                    },
                    '◀️': (_, instance) => {
                        instance.setPage('back');
                    },
                    '▶️': (_, instance) => {
                        instance.setPage('forward');
                    },
                    '⏭️': (_, instance) => {
                        instance.setPage(m1);
                    },
                    '🔄': (_, instance) => {
                        instance.resetEmojis();
                    }
                })

            await Embeds.build();
        } else if (embedType === 'pendingwars') {
            const embedArr = embedData
            const embeds = [];
            embedArr.forEach(embed => {
                const Embed = new Discord.MessageEmbed()
                    .setColor(embed.color)
                    .setTitle(`Schedule/War ID : ${embed.warID}`)
                    .setThumbnail(embed.thumbnail)
                    .setAuthor('By BCL')
                    .addField('Week', embed.week, false)
                    .addField('Clan 1', embed.clan, true)
                    .addField('Clan 2', embed.opponent, false)
                    .addField('Status', embed.status, false)
                    .setTimestamp()
                embeds.push(Embed);
            })
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
                    '⏮️': (_, instance) => {
                        instance.setPage(1);
                    },
                    '◀️': (_, instance) => {
                        instance.setPage('back');
                    },
                    '▶️': (_, instance) => {
                        instance.setPage('forward');
                    },
                    '⏭️': (_, instance) => {
                        instance.setPage(m1);
                    },
                    '🔄': (_, instance) => {
                        instance.resetEmojis();
                    }
                })

            await Embeds.build();
        } else if (embedType === 'listwars') {
            const { color, thumbnail, wars } = embedData;
            const embeds = [];
            var i = 0;
            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`All Scheduled Wars!`)
                .setThumbnail(thumbnail)
                .setAuthor('By BCL')
                .setTimestamp()
            for (i; i < ((wars.length > 24) ? 24 : wars.length); i++) {
                embed.addField(`**${wars[i].clan.name}** vs **${wars[i].opponent.name}**`, `${wars[i].dow}   ${wars[i].tow}  **${wars[i].status}**\n||BCL claim ${wars[i].warID} <your stream link>|| (for streamers only)${wars[i].streams === null ? '' : "\n**Streamed by**\n" + wars[i].streams}`);
            }
            embeds.push(embed);
            if (wars.length > 24) {
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`All Scheduled Wars!`)
                    .setThumbnail(thumbnail)
                    .setAuthor('By BCL')
                    .setTimestamp()
                for (i; i < ((wars.length > 48) ? 48 : wars.length); i++) {
                    embed.addField(`**${wars[i].clan.name}** vs **${wars[i].opponent.name}**`, `${wars[i].dow}   ${wars[i].tow}  **${wars[i].status}**\n||BCL claim ${wars[i].warID} <your stream link>|| (for streamers only)${wars[i].streams === null ? '' : "\n**Streamed by**\n" + wars[i].streams}`)
                }
                embeds.push(embed);
            }
            if (wars.length > 48) {
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`All Scheduled Wars!`)
                    .setThumbnail(thumbnail)
                    .setAuthor('By BCL')
                    .setTimestamp()
                for (i; i < ((wars.length > 72) ? 72 : wars.length); i++) {
                    embed.addField(`**${wars[i].clan.name}** vs **${wars[i].opponent.name}**`, `${wars[i].dow}   ${wars[i].tow}  **${wars[i].status}**\n||BCL claim ${wars[i].warID} <your stream link>|| (for streamers only)${wars[i].streams === null ? '' : "\n**Streamed by**\n" + wars[i].streams}`)
                }
                embeds.push(embed);
            }
            if (wars.length > 72) {
                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`All Scheduled Wars!`)
                    .setThumbnail(thumbnail)
                    .setAuthor('By BCL')
                    .setTimestamp()
                for (i; i < ((wars.length > 96) ? 96 : wars.length); i++) {
                    embed.addField(`**${wars[i].clan.name}** vs **${wars[i].opponent.name}**`, `${wars[i].dow}   ${wars[i].tow}  **${wars[i].status}**\n||BCL claim ${wars[i].warID} <your stream link>|| (for streamers only)${wars[i].streams === null ? '' : "\n**Streamed by**\n" + wars[i].streams}`)
                }
                embeds.push(embed);
            }

            let m1 = 0;
            embeds.map(function (r) { m1++; return r.setFooter(`Page ${m1}/${embeds.length} | TIMES ARE IN EST TZ |TOTAL WARS : ${wars.length}`) })
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
                    '⏮️': (_, instance) => {
                        instance.setPage(1);
                    },
                    '◀️': (_, instance) => {
                        instance.setPage('back');
                    },
                    '▶️': (_, instance) => {
                        instance.setPage('forward');
                    },
                    '⏭️': (_, instance) => {
                        instance.setPage(m1);
                    },
                    '🔄': (_, instance) => {
                        instance.resetEmojis();
                    }
                })

            await Embeds.build();
        }
    } catch (err) {
        console.log(err.message);
        message.reply(err.message);
    }
}