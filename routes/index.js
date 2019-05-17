const express = require('express');
const router = express.Router();
const request = require('request');

const PAT = process.argv[2];
const target = process.argv[3];
const resource = process.argv[4];

router.get('/', function(req, res, next) {
  res.status(200);
  res.send("Send a GET request to /create-webhook to create a webhook.");
});

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

    console.log(":: Create Webhook - Handling Response ::");
    console.log(subRes.statusCode);
    console.log(subRes.headers);
    console.log(body);

    res.status(200);
    res.send("Tried to create a webhook.");
    console.log(":: Create Webhook - Got Response Code" + subRes.statusCode + " ::");
  });
});

/* POST home page. */
router.post('/', function(req, res, body) {
  console.log(":: Received Handshake - Handling POST ::");
  console.log(req.headers);
  console.log(body);
  const secret = req.header('X-Hook-Secret');
  if (secret) {
    res.set('X-Hook-Secret', secret);
  }
  res.status(200);
  res.send();
  console.log(":: Received Handshake - Sent Response ::");
});

module.exports = router;
