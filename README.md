# asana-webhooks-express

This is an express app that will test your process for Asana Webhooks.

Install Steps:
* Clone the project `git clone git@github.com:rossgrambo/asana-webhooks-express.git`
* run `npm install` ( If you need to install node >>> mac: run `brew install node`, windows: https://nodejs.org/en/download/ )
* run `npm install ngrok -g` (This installs it globally, you can install locally by removing the `-g`).

Run Steps:
* In one terminal, run `ngrok http 3000`
  * Copy the https url this gives you.
* In another terminal, run `npm start $PAT $NGROK_URL $RESOURCE_ID` (ex: `npm start 0/abcdefg12345678 https://abcd1234.ngrok.io 1234123412`)

Testing Steps:
* Go to the ngrok url in a browser: https://abcd1234.ngrok.io
* Follow the visual steps!
