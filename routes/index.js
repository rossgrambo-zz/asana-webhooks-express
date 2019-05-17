var express = require('express');
var router = express.Router();
var request = require('request');

var PAT = process.argv[2];
var target = process.argv[3];
var resource = process.argv[4];

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
  var secret = req.header('X-Hook-Secret');
  if (secret) {
    res.set('X-Hook-Secret', secret);
  }
  res.status(200);
  res.send();
  console.log(":: Received Handshake - Sent Response ::");
});

module.exports = router;
