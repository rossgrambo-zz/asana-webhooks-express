const express = require('express');
const router = express.Router();
const request = require('request');

const PAT = process.argv[2];
const target = process.argv[3];
const resource = process.argv[4];

let savedSecret = null;

request.debug = true;

router.get('/', function(req, res, next) {
  res.status(200);
  let url = req.protocol + '://' + req.get('host') + "/create-webhook";
      res.send("Go <a href='" + url + "'>" + url + "</a> to create a webhook.");
});

/* CREATE WEBHOOK */
router.get('/create-webhook', function(req, res, next) {
  console.log(":: Create Webhook - Sending POST ::");
  request.post('https://app.asana.com/api/1.0/webhooks', {
    json: {
      data: {
        resource: resource,
        target: target
      }
    },
    auth: {
      bearer: PAT
    }
  }, function (error, subRes, body) {
    if (error) {
      console.error(error);
      return
    }

    console.log(":: Create Webhook - Got Response Code " + subRes.statusCode + " ::");

    //console.log(subRes.headers);
    console.log(body);

    let createdWebhook = '';
    if (body && body.data && body.data.gid) {
      createdWebhook = body.data.gid;
    }

    res.status(200);
    if (subRes.statusCode === 201) {
      let url = req.protocol + '://' + req.get('host') + "/delete-webhook?webhook=" + createdWebhook;
      res.send("Created a webhook. Go to <a href='" + url + "'>" + url + "</a> to delete it.");
    } else {
      res.send("Failed to create a webhook.");
    }

    console.log(":: Create Webhook - Finished Handling Response ::");
  });
});

/* DELETE WEBHOOK */
router.get('/delete-webhook', function(req, res, next) {
  let webhookId = req.query.webhook;

  if (!webhookId) {
    res.send("Please supply a ?webhook");
    return;
  }

  console.log(":: Delete Webhook - Sending DELETE ::");
  request.delete('https://app.asana.com/api/1.0/webhooks/' + webhookId, {
    auth: {
      bearer: PAT
    }
  }, function (error, subRes, body) {
    if (error) {
      console.error(error);
      return;
    }

    console.log(":: Delete Webhook - Got Response Code " + subRes.statusCode + " ::");

    res.status(200);
    if (subRes.statusCode === 200) {
      let url = req.protocol + '://' + req.get('host') + "/create-webhook";
      res.send("Deleted a webhook. To create a new webhook, go to <a href='" + url + "'>" + url + "</a>.");
    } else {
      res.send("Failed to delete the webhook.");
    }
  });
});

// This function is only for debugging, never use this in an actual application.
function sleepFor( sleepDuration ){
  var now = new Date().getTime();
  while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

/* HANDSHAKE */
router.post('/', function(req, res, body) {
  console.log(":: Received Handshake - Handling POST ::");

  // For Debugging, uncomment any lines below.
  //sleepFor(15000);
  //console.log(req.headers);
  //console.log(body);

  const secret = req.header('X-Hook-Secret');
  if (secret) {
    res.set('X-Hook-Secret', secret);
    res.set('SomeHeader', "cat=meow");
    savedSecret = secret;
  }

  res.status(200);
  res.send();
  console.log(":: Received Handshake - Sent Response ::");
});

module.exports = router;
