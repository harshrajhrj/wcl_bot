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
// cron.schedule('*/10 * * * *', async function () {
//     const getActiveWars = await scheduleSchema.find({ status: 'ACTIVE' });
//     var productsToReturn = []
//     let requests = getActiveWars.map(id => {
//         //create a promise for each API call
//         return new Promise(async (resolve, reject) => {
//             const fetchClanTag = id.clan.tag;
//             const warData = await fetch(`https://api.clashofclans.com/v1/clans/%23${decodeURIComponent(fetchClanTag.slice(1)).replace(/[^\x00-\x7F]/g, "")}/warlog?limit=10`, options);
//             resolve(await warData.json());
//         })
//     })
//     Promise.all(requests).then(async (body) => {
//         //this gets called when all the promises have resolved/rejected.
//         body.forEach(res => {
//             if (res)
//                 productsToReturn.push(res)
//         })

//         try {
//             getActiveWars.forEach(async war => {
//                 var warData = false;
//                 var goodData;
//                 productsToReturn.forEach(aow => {
//                     if (aow.items != undefined) {
//                         warData = aow.items.find(function (warDatas) {
//                             if (warDatas.endTime != undefined) {
//                                 const DateIndex = warDatas.endTime.split('T')[0];
//                                 const newDate = new Date(DateIndex.substring(0, 4), `${parseInt(DateIndex.substring(4, 6), 10) - 1}`, DateIndex.substring(6, 8))
//                                 // var today = new Date();
//                                 // var dd = String(today.getDate()).padStart(2, '0');
//                                 // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//                                 // var yyyy = today.getFullYear();
//                                 // const todayDate = new Date(yyyy, `${parseInt(mm, 10) - 1}`, dd);
//                                 return newDate.getTime() >= war.dow.getTime() && warDatas.opponent.tag === war.opponent.tag
//                             }
//                         })
//                         if (typeof warData === "object") {
//                             goodData = warData
//                         }
//                     }
//                 })

//                 if (typeof goodData === "object") {
//                     console.log(goodData.clan.tag, goodData.opponent.tag)
//                     // war.clan.star = goodData.clan.stars;
//                     war.clan.star = 0;
//                     // war.clan.dest = goodData.clan.destructionPercentage;
//                     war.clan.dest = 0;
//                     // war.opponent.star = goodData.opponent.stars;
//                     war.opponent.star = 0;
//                     // war.opponent.dest = goodData.opponent.destructionPercentage;
//                     war.opponent.dest = 0;
//                     if (['win', 'lose', 'tie'].includes(goodData.result)) {
//                         war.status = "ACTIVE";
//                     }
//                     await war.markModified('clan');
//                     await war.markModified('opponent');

//                     await war.save()
//                         .then((data) => console.log(data));
//                 }
//             })
//         } catch (err) {
//             console.log(err.message)
//         }
//     }).catch(err => console.log(err.message))
// })