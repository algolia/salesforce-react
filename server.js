const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

const clientId = process.env.REACT_APP_SALESFORCE_CLIENT_ID;
const secret = process.env.REACT_APP_SALESFORCE_SECRET;
const instanceUrl = process.env.REACT_APP_SALESFORCE_INSTANCE_URL;
const username = process.env.REACT_APP_SALESFORCE_USERNAME;
const password = process.env.REACT_APP_SALESFORCE_PASSWORD;

const jsforce = require('jsforce');
const algoliasearch = require('algoliasearch');
var packageJson = require('./package.json');

const algoliaClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);
algoliaClient.addAlgoliaAgent('jsforce', packageJson.dependencies.jsforce);
algoliaClient.addAlgoliaAgent('salesforce', '53.0');


const options = {
    key: fs.readFileSync("cert/server.key"),
    cert: fs.readFileSync("cert/server.cert"),
};

const conn = new jsforce.Connection({
    oauth2: {
        // you can change loginUrl to connect to sandbox or prerelease env.
        // loginUrl : 'https://test.salesforce.com',
        clientId: clientId,
        clientSecret: secret,
        instanceUrl: instanceUrl
    },
    version: '53.0'
});


https.createServer(options, app).listen(port, () => {
    console.log('Server listening on port ' + port);
});

// create a GET route
app.get('/', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

const getSFContent = function (query, res) {
    conn.login(username, password, function (err, sfRes) {
        if (err) { return console.error(err); }
        conn.query(query, function (err, sfRes) {
            if (err) { return console.error(err); }
            console.log("Returning json from SFDC");
            res.json(sfRes.records);
        });
    });
}

app.get('/accounts', (req, res) => {
    getSFContent('SELECT Id, Name,Site,BillingAddress,Description FROM Account', res);
});

app.get('/users', (req, res) => {
    getSFContent('SELECT Id, Name FROM Users', res);
});

app.get('/channels', (req, res) => {
    conn.login(username, password, function (err, sfRes) {
        if (err) { return console.error(err); }
        conn.request('/connect/cms/delivery/channels/0ap5f000000YN1cAAG/contents/query', {}, function (err, sfRes) {
            if (err) { return console.error(err); }
            console.log("Returning content from SFDC");
            res.json(sfRes.channels);
        });
    });
});

const getContentFromChannel = async function (conn, channelId) {
    let url = '/connect/cms/delivery/channels/' + channelId + '/contents/query?managedContentType=Apparel';
    try {
        const res = await conn.request(url);
        const objects = [];

        res.items.forEach(function (sfRecord) {
            objects.push(sfRecord);
        });
        return objects;
    } catch (err) {
        console.error(err);
    }
    return [];
};
app.get('/indexContent', (req, res) => {

    conn.login(username, password, function (err, sfRes) {
        if (err) { return console.error(err); }
        let allSfData = [];
        let allIds = [];

        conn.request('/connect/cms/delivery/channels', {}, function (err, sfRes) {
            if (err) { return console.error(err); }

            // for each channel, get the content in that channel
            sfRes.channels.forEach(async function (channel) {
                // get and index the content
                let sfData = await getContentFromChannel(conn, channel.channelId);
                console.log(sfData);
                sfData.forEach(function (sfRow) {
                    if (!allIds.includes(sfRow.contentKey)) {
                        console.log("Adding id " + sfRow.contentKey);
                        allSfData.push(sfRow);
                        allIds.push(sfRow.contentKey);
                    }
                });
            });

            // now, index all the content
            let objects = [];
            allSfData.forEach(function (sfRecord) {
                let obj = {
                    objectID: sfRecord.contentKey,
                    Name: sfRecord.title,
                    Category: sfRecord.contentNodes.category.value,
                    Url: sfRecord.contentNodes.image.unauthenticatedUrl,
                    Size: sfRecord.contentNodes.size.value,
                    Type: sfRecord.contentNodes.type.value,
                    Description: sfRecord.contentNodes.description.value
                }
                objects.push(obj);
            });
            console.time("IndexContent");
            const index = algoliaClient.initIndex('content');
            index.saveObjects(objects).then(({ objectIDs }) => {
                console.log(objectIDs);
                console.timeEnd("IndexContent");
                res.json(allSfData);
            });


        });
    });

});
app.get('/indexAccounts', (req, res) => {

    conn.login(username, password, function (err, sfRes) {
        if (err) { return console.error(err); }
        conn.query('SELECT Id, Name,Site,BillingAddress,Description FROM Account', function (err, sfRes) {
            if (err) { return console.error(err); }
            //console.log(sfRes);

            // index 
            console.log("Indexing accounts");
            const index = algoliaClient.initIndex('accounts');

            const objects = [];
            sfRes.records.forEach(async function (sfRecord) {
                let street = (sfRecord.BillingAddress) ? sfRecord.BillingAddress.street : "";
                let city = (sfRecord.BillingAddress) ? sfRecord.BillingAddress.city : "";
                let state = (sfRecord.BillingAddress) ? sfRecord.BillingAddress.state : "";

                let obj = {
                    objectID: sfRecord.Id,
                    Name: sfRecord.Name,
                    Address: street,
                    City: city,
                    State: state,
                    Description: sfRecord.Description,
                }
                objects.push(obj);
            });
            console.time("IndexRecords");
            index.saveObjects(objects).then(({ objectIDs }) => {
                console.log(objectIDs);
                console.timeEnd("IndexRecords");
                res.json(sfRes.records);
            });
        });
    });

});

// callback post
app.post('/callback', function (request, response) {
    console.log("Posted a callback", request.body);
});



