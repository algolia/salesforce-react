# salesforce-react

This is a React app with nodejs that interfaces with Algolia and Salesforce

## Setup

### Set up SFDC
1. Create the Connected App (Setup > App Manager > New Connected App)
2. Add the callback URL from ngrok
3. Store the consumer key and secret so that we can use jsforce to connect to salesforce
<img width="1515" alt="Screen Shot 2021-11-08 at 8 11 25 AM" src="https://user-images.githubusercontent.com/1056697/140747852-cc9c7278-00a2-43e0-8bc7-3d92a2eda45e.png">

5. Install nodejs https://nodejs.org/en/
6. In the root folder of this project, create a .env file and put the following in it
```
REACT_APP_SALESFORCE_CLIENT_ID = "[your Client ID from the connected app]"
REACT_APP_SALESFORCE_SECRET = "[Your secret from the connected app]"
REACT_APP_SALESFORCE_INSTANCE_URL = "[SFDC Instance]"
REACT_APP_SALESFORCE_USERNAME = "[Your SFDC username]"
REACT_APP_SALESFORCE_PASSWORD = "[Your SFDC password] + [Your Security Key]"
REACT_APP_ALGOLIA_APP_ID = "[Your Algolia API ID]"
REACT_APP_ALGOLIA_API_KEY = "[Your Aloglia API Key that has access to your index]"
REACT_APP_ALGOLIA_SEARCH_API_KEY = "[Your Algolia Search API Key]"
```
6. Then save the file
7. To init the app, run this in the command line
```
npm install
```
There is already a package.json that should install all of the dependencies
8. Once that's going, have 2 tabs in the command line.  The first one is the server (Express)
9. Run the following
```
node server.js
```
10. The second is React (Client)
```
npm start
```

That should have both server and client running on your localhost



