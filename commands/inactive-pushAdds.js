// const mongoose = require('mongoose');
// require('dotenv/config');
// mongoose.connect(process.env.CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to DB'))
//     .catch((err) => console.log(err.message))



// var fs = require('fs');
// async function sendBack(div, abb, dataArray) {
//     var options = {
//         'HEAVY WEIGHT': ['heavy', 'rosterSchemaHeavy'],
//         'FLIGHT': ['flight', 'rosterSchemaFlight'],
//         'ELITE': ['elite', 'rosterSchemaElite'],
//         'BLOCKAGE': ['blockage', 'rosterSchemaBlockage'],
//         'CHAMPIONS': ['champions', 'rosterSchemaChampions']
//     };
//     var rosterSchema = require('./rosterSchemas/' + options['CHAMPIONS'][1]);
//     var getData = await rosterSchema.find();
//     // var data = fs.readFileSync('./commands/pullAdds.json');
//     // var myObject = JSON.parse(data);
//     // const producedAbbs = [];
//     getData.forEach(data => {
//         if (data.additionStatusLimit > 0) {
//             data.additionStatus = 'Yes';
//             data.save()
//                 .then((msg) => console.log(msg))
//                 .catch((err) => console.log(err.msg));
//         }
//         // console.log(data);
//         // producedAbbs.push([data.abb, data.additionStatusLimit]);
//     })
//     // myObject["newValues"] = producedAbbs;
//     // var newData = JSON.stringify(myObject);
//     // fs.writeFile('./commands/pullAdds.json', newData, (err) => {
//     //     if (err) {
//     //         throw err.message;
//     //     }
//     //     console.log('Done');
//     // });
// }

// //sendBack();

// const repsSchema = require('./repsSchema/repsSchema');
// const substitutionSchema = require('./subTracking/substitutionSchema');

// async function putSubAbbs() {
//     const findObjects = await repsSchema.find();
//     // var i;
//     // for (i = 0; i < findObjects.length; i++) {
//     //     var substitutionSchemaIS = new substitutionSchema({
//     //         refer: findObjects[i]._id,
//     //         abb: findObjects[i].abb
//     //     })
//     //     await substitutionSchemaIS.save()
//     //         .then((data) => console.log(data));
//     // }
//     // console.log(i);
//     await repsSchema.aggregate([{ $project: { div: { $toUpper: "$div" } } }]).then(async (data) => {
//         for (var i = 0; i < data.length; i++) {
//             await repsSchema.findOneAndUpdate({ _id: data[i]._id },
//                 {
//                     div: data[i].div
//                 }).then((dt) => console.log(dt));
//         }
//     });
// }

// putSubAbbs();

// const rosterSchemaChampions = require("./rosterSchemas/rosterSchemaChampions");

// async function pushAdds() {
//     await rosterSchemaChampions.updateMany({ div: 'CHAMPIONS' }, [
//         {
//             $set: {
//                 additionStatusLimit: 3
//             }
//         }
//     ]).then((data) => console.log(data.modifiedCount));
// }

// pushAdds()


// const individualWarRecord = require('./war&schedule&standings/individualWarRecord');
// const abbSchema = require('./abbSchema/registeredAbbs');

// async function checkleft() {
//     const left = [];
//     const findAbbs = await abbSchema.find({ div: 'CHAMPIONS' });
//     for (var i = 0; i < findAbbs.length; i++) {
//         const midcheck = await individualWarRecord.findOne({ abb: findAbbs[i].abb });
//         if (!midcheck) {
//             left.push([findAbbs[i].abb, findAbbs[i].clanName]);
//         }
//     }
//     console.log(left);
// }

// checkleft();


const rosterSchema = require('./rosterSchemas/rosterSchemaChampions');
const fs = require('fs');

// async function checkLeft() {
//     var rawABBS = fs.readFileSync('./commands/abbs.json')
//     var check_array = JSON.parse(rawABBS);
//     var left = [];
//     console.log("....Running")
//     var filteredChamps = check_array.values.filter(function (val) { return val[3] === "CHAMPIONS" });
//     const retrieve = await rosterSchema.find();
//     for (var i = 0; i < retrieve.length; i++) {
//         if (!filteredChamps.find(function (val) { return val[2] === retrieve[i].abb })) {
//             left.push(retrieve[i].abb);
//             // const retrieve = await rosterSchema.findOne({ abb: check_array.values[i][2] });
//             // if (retrieve)
//             //     left += check_array.values[i][0] + " | " + check_array.values[i][1] + " | " + check_array.values[i][2] + " | " + check_array.values[i][3] + "\n";
//         }
//     }
//     console.log(left);
// }

// async function checkLeft() {
//     var rawABBS = fs.readFileSync('./commands/abbs.json')
//     var check_array = JSON.parse(rawABBS);
//     var left = [];
//     console.log("....Running")
//     for (var i = 0; i < check_array.values.length; i++) {
//         if (check_array.values[i][3] === "CHAMPIONS") {
//             const retrieve = await rosterSchema.findOne({ abb: check_array.values[i][2] });
//             if (!retrieve)
//                 left.push(check_array.values[i]);
//         }
//     }
//     console.log(left);
// }

// checkLeft();