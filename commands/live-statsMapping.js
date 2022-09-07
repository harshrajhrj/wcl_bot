const cron = require('node-cron');
const scheduleSchema = require('./war&schedule&standings/scheduleSchema');
const indWar = require('./war&schedule&standings/individualWarRecord');

cron.schedule('*/20 * * * *', async function () {
    try {
        const findCompletedWars = await scheduleSchema.find({ status: 'COMPLETED', 'clan.star': { $ne: 0 }, 'opponent.star': { $ne: 0 } });
        for (var i = 0; i < findCompletedWars.length; i++) {
            const findWarClans = await indWar.find({ abb: { $in: [findCompletedWars[i].clan.abb, findCompletedWars[i].opponent.abb] } });
            for (var j = 0; j < findWarClans.length; j++) {
                var compareRecord = {};
                var finder1 = '';
                var finder2 = '';
                if (findWarClans[j].abb === findCompletedWars[i].clan.abb) {
                    finder1 = 'clan';
                    finder2 = 'opponent';
                }
                else {
                    finder1 = 'opponent';
                    finder2 = 'clan';
                }
                if (findCompletedWars[i][finder1].star > findCompletedWars[i][finder2].star) {
                    compareRecord['abb'] = findCompletedWars[i][finder1].abb;
                    compareRecord['status'] = 'W';
                    compareRecord['star'] = findCompletedWars[i][finder1].star;
                    compareRecord['dest'] = findCompletedWars[i][finder1].dest;
                    compareRecord['against'] = findCompletedWars[i][finder2].star;
                } else if (findCompletedWars[i][finder1].star < findCompletedWars[i][finder2].star) {
                    compareRecord['abb'] = findCompletedWars[i][finder1].abb;
                    compareRecord['status'] = 'L';
                    compareRecord['star'] = findCompletedWars[i][finder1].star;
                    compareRecord['dest'] = findCompletedWars[i][finder1].dest;
                    compareRecord['against'] = findCompletedWars[i][finder2].star;
                } else {
                    if (findCompletedWars[i][finder1].dest > findCompletedWars[i][finder2].dest) {
                        compareRecord['abb'] = findCompletedWars[i][finder1].abb;
                        compareRecord['status'] = 'W';
                        compareRecord['star'] = findCompletedWars[i][finder1].star;
                        compareRecord['dest'] = findCompletedWars[i][finder1].dest;
                        compareRecord['against'] = findCompletedWars[i][finder2].star;
                    } else if (findCompletedWars[i][finder1].dest < findCompletedWars[i][finder2].dest) {
                        compareRecord['abb'] = findCompletedWars[i][finder1].abb;
                        compareRecord['status'] = 'L';
                        compareRecord['star'] = findCompletedWars[i][finder1].star;
                        compareRecord['dest'] = findCompletedWars[i][finder1].dest;
                        compareRecord['against'] = findCompletedWars[i][finder2].star;
                    } else {
                        compareRecord['abb'] = findCompletedWars[i][finder1].abb;
                        compareRecord['status'] = 'T';
                        compareRecord['star'] = findCompletedWars[i][finder1].star;
                        compareRecord['dest'] = findCompletedWars[i][finder1].dest;
                        compareRecord['against'] = findCompletedWars[i][finder2].star;
                    }
                }
                for (const week in findWarClans[j].opponent) {
                    if (week === findCompletedWars[i].week) {
                        findWarClans[j].opponent[week].status = compareRecord.status;
                        findWarClans[j].opponent[week].starFor = compareRecord.star;
                        findWarClans[j].opponent[week].starAgainst = compareRecord.against;
                        findWarClans[j].opponent[week].perDest = compareRecord.dest;
                        findWarClans[j].opponent[week].warID = findCompletedWars[i].warID;
                    }
                }
                await findWarClans[j].markModified('opponent');
                await findWarClans[j].save()
                    .then((data) => console.log(data));
            }
        }
    } catch (err) {
        console.log(err.message);
    }
})