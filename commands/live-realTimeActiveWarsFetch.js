/* This algorithm fetches all active and ongoing wars */

const cron = require('node-cron');
const scheduleSchema = require('./war&schedule&standings/scheduleSchema');
const fetch = require('node-fetch');


// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImIyN2ZiMWIzLWZjZmUtNDY2Ni1hNzBkLWI5ZTU3YzM0YzU2MSIsImlhdCI6MTY2MjIyNDQ2MSwic3ViIjoiZGV2ZWxvcGVyLzA3OTVlYmEzLWMxN2UtNjc2NS00ZWUzLThkMDdlMmExNTY0MCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEwMy4zMC4xNzguNDAiXSwidHlwZSI6ImNsaWVudCJ9XX0.U5cMsV9ABZehyVzb0JFTrJ29xSMpRQlaxpzPn0gI2wUpFWOgPyZITcACwonUt0yCvSi7V8PFJtFsSaZXuhOSFA'; //LOCAL
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjNjMTU4MmVjLThkYmMtNDI0OC1iMGE4LTU3NzZjYzY1YjQ4ZCIsImlhdCI6MTY2MjQ4MjY0Mywic3ViIjoiZGV2ZWxvcGVyLzA3OTVlYmEzLWMxN2UtNjc2NS00ZWUzLThkMDdlMmExNTY0MCIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjE2Mi4yNDguMTAxLjEyOSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.fXRGuufrBJ7429K7VoeQHKmf9Fpxb4Y99aMp5zft0_IO0F4hjZ7DOyBanww80CYT1NXDDZY3e-t5qB_a7qkYTQ' //VPS
const options = {
    'contentType': 'application/json',
    'method': 'get',
    'muteHttpExceptions': true,
    'headers': { 'Accept': 'application/json', 'authorization': `Bearer ${token}` }
};

// let client = clashApi({
//     token: token,
//     'contentType': 'application/json',
//     'method': 'get',
//     'muteHttpExceptions': true,
// })

/*
currentWar
state - warEnded
state - inWar
*/

// running every 10 mins
cron.schedule('*/10 * * * *', async function () {
    const getActiveWars = await scheduleSchema.find({ status: 'ACTIVE' });
    var productsToReturn = []
    let requests = getActiveWars.map(id => {
        //create a promise for each API call
        return new Promise(async (resolve, reject) => {
            const fetchClanTag = id.clan.tag;
            const warData = await fetch(`https://api.clashofclans.com/v1/clans/%23${decodeURIComponent(fetchClanTag.slice(1)).replace(/[^\x00-\x7F]/g, "")}/currentwar`, options);
            resolve(await warData.json());
        })
    })
    Promise.all(requests).then(async (body) => {
        //this gets called when all the promises have resolved/rejected.
        body.forEach(res => {
            if (res)
                productsToReturn.push(res)
        })

        try {
            getActiveWars.forEach(async war => {
                const warData = productsToReturn.find(function (warData) {
                    if (warData.state != undefined && warData.state != 'notInWar') {
                        return war.clan.tag === warData.clan.tag && warData.opponent.tag === war.opponent.tag
                    }
                })
                if (warData) {
                    war.clan.star = warData.clan.stars;
                    war.clan.dest = warData.clan.destructionPercentage;
                    war.opponent.star = warData.opponent.stars;
                    war.opponent.dest = warData.opponent.destructionPercentage;
                    if (warData.state === 'warEnded') {
                        war.status = "COMPLETED";
                    }
                    await war.markModified('clan');
                    await war.markModified('opponent');

                    await war.save()
                        .then((data) => console.log(data));
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }).catch(err => console.log(err.message))
})
