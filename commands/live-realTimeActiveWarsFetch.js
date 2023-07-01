/* This algorithm fetches all active and ongoing wars */

const cron = require('node-cron');
const scheduleSchema = require('./war&schedule&standings/scheduleSchema');
const fetch = require('node-fetch');

const token = "token";
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


cron.schedule('*/10 * * * *', async function () {
    const getActiveWars = await scheduleSchema.find({ status: 'ACTIVE' });
    var productsToReturn = []
    let requests = getActiveWars.map(id => {
        //create a promise for each API call
        return new Promise(async (resolve, reject) => {
            const fetchOpponentTag = id.opponent.tag;
            const warData = await fetch(`https://api.clashofclans.com/v1/clans/%23${decodeURIComponent(fetchOpponentTag.slice(1)).replace(/[^\x00-\x7F]/g, "")}/currentwar`, options);
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
                        return war.opponent.tag === warData.clan.tag && warData.opponent.tag === war.clan.tag
                    }
                })
                if (warData) {
                    war.opponent.star = warData.clan.stars;
                    war.opponent.dest = warData.clan.destructionPercentage;
                    war.clan.star = warData.opponent.stars;
                    war.clan.dest = warData.opponent.destructionPercentage;
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
