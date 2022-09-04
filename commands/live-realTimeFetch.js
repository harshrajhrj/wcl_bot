const cron = require('node-cron');
const indWarSchema = require('./war&schedule&standings/individualWarRecord');
const scheduleSchema = require('./war&schedule&standings/scheduleSchema');
const fetch = require('node-fetch');
const clashApi = require('clash-of-clans-api');


// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImIyN2ZiMWIzLWZjZmUtNDY2Ni1hNzBkLWI5ZTU3YzM0YzU2MSIsImlhdCI6MTY2MjIyNDQ2MSwic3ViIjoiZGV2ZWxvcGVyLzA3OTVlYmEzLWMxN2UtNjc2NS00ZWUzLThkMDdlMmExNTY0MCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEwMy4zMC4xNzguNDAiXSwidHlwZSI6ImNsaWVudCJ9XX0.U5cMsV9ABZehyVzb0JFTrJ29xSMpRQlaxpzPn0gI2wUpFWOgPyZITcACwonUt0yCvSi7V8PFJtFsSaZXuhOSFA
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY4YzMyYzE4LTZmMjYtNGYzMS1iNGRhLWQxZmI1MDRkYTM5MyIsImlhdCI6MTY2MjIzNDYyNSwic3ViIjoiZGV2ZWxvcGVyLzA3OTVlYmEzLWMxN2UtNjc2NS00ZWUzLThkMDdlMmExNTY0MCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjE2Mi4yNDguMTAxLjIxMSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.yaUi4pl2Kk9PU7C8GVdnj__V1Fafw5xCLe_tVPAyZofbbk7LjzROebytl-XaAVxevfL84nd8Ih50gRfae9wuXQ'
// const options = {
//     'contentType': 'application/json',
//     'method': 'get',
//     'muteHttpExceptions': true,
//     'headers': { 'Accept': 'application/json', 'authorization': `Bearer ${token}` }
// };

let client = clashApi({
    token: token,
    'contentType': 'application/json',
    'method': 'get',
    'muteHttpExceptions': true,
})
/*
currentWar
state - warEnded
state - inWar
*/

// running every 1 hour
cron.schedule("0 * * * *", async function () {

    // get all active status object
    const getActiveWars = await scheduleSchema.find({ status: 'ACTIVE' });

    for (var i = 0; i < getActiveWars.length; i++) {
        const fetchClanTag = getActiveWars[i].clan.tag;
        const fetchOpponentTag = getActiveWars[i].opponent.tag;

        try {
            const parseToJSON = await client.clanCurrentWarByTag(decodeURIComponent(fetchClanTag).replace(/[^\x00-\x7F]/g, ""))
            console.log(parseToJSON.clan.name);
            // const currentWar = await fetch(`https://api.clashofclans.com/v1/clans/%23${decodeURIComponent(fetchClanTag.slice(1)).replace(/[^\x00-\x7F]/g, "")}/currentwar`, options);
            // if (currentWar.status === 200) {
            // const parseToJSON = await currentWar.json();
            if (parseToJSON.state != 'notInWar') {
                const DateIndex = parseToJSON.preparationStartTime.split('T')[0];
                if (new Date(DateIndex.substring(0, 4), `${parseInt(DateIndex.substring(4, 6), 10) - 1}`, DateIndex.substring(6, 8)) >= getActiveWars[i].dow && fetchOpponentTag === parseToJSON.opponent.tag) {
                    getActiveWars[i].clan.star = parseToJSON.clan.stars;
                    getActiveWars[i].clan.dest = parseToJSON.clan.destructionPercentage;
                    getActiveWars[i].opponent.star = parseToJSON.opponent.stars;
                    getActiveWars[i].opponent.dest = parseToJSON.opponent.destructionPercentage;
                    if (parseToJSON.state === 'warEnded') {
                        getActiveWars[i].status === "COMPLETED";
                    }
                    await getActiveWars[i].markModified('clan');
                    await getActiveWars[i].markModified('opponent');

                    await getActiveWars[i].save()
                        .then((data) => console.log(data));
                }
            }
            // }
        } catch (err) {
            console.log(err.message);
        }
    }
})