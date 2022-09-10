const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const fs = require('fs');

module.exports = {
    name: 'abbstranfertosheet',
    aliases: ['atts'],
    description: 'Abb transfer to gsheet',
    args: false,
    category: "all",
    explanation: 'Ex: wcl atts',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = [
            '1011618454735966268',
            '1011618703814705262',
            '1011620257275838485',
            '1011622480600903690',
            '1011622635781771294'
        ]

        const client = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(function (err, tokens) {

            if (err) {
                console.log(err);
                return;
            }
            else {
                console.log('Connected!');
                gsrun(client);
            }
        });

        async function gsrun(cl) {
            const gsapi = google.sheets({ version: 'v4', auth: cl });

            var ABBSobject = fs.readFileSync('./commands/abbs.json');
            var abbs = JSON.parse(ABBSobject);

            abbs = abbs.values;

            const writeTogSheet = {
                spreadsheetId: '105PxE51Puv6JPtO_j5ahQ-X-uece4jVT36wbqnih6LY',
                range: 'ABBS!A:D',
                valueInputOption: 'USER_ENTERED',
                resource: { values: abbs }
            }

            try {
                await gsapi.spreadsheets.values.update(writeTogSheet).then((data) => console.log(data));
            } catch (err) {
                console.log(err.message);
                message.reply(err.message);
            }
        }
    }
}