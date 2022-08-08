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