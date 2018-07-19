var express = require('express');
var bodyParser = require('body-parser');
var http = require('request');
var app = express();

var CLIENT = 'AX8KKyMUu_C3nhUSG8LgWKvO-pSh6J4jpkFZu7A-YPdoMpOvwhBjce9Rb04Si1uZiC3bgJ5sLFZuEBBe';
var SECRET = 'ECNFUSV6ps587kMu9DEczuZ2Uk6XZICpSpP3pccIB9eR3tHlMEA7TexkzWM9nIrkvx1GXM-a8ggYfhbR';
var PAYPAL_API = 'https://api.sandbox.paypal.com';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["Origin", "Content-Type"]);
  next();
});

app.post('/my-api/create-payment/', function (req, res) {
  http.post(PAYPAL_API + '/v1/payments/payment', {
    auth: {
      user: CLIENT,
      pass: SECRET
    },
    body: {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [{
        amount: {
          total: '5.99',
          currency: 'USD'
        }
      }],
      redirect_urls: {
        return_url: 'https://www.mysite.com',
        cancel_url: 'https://www.mysite.com'
      }
    },
    json: true
  }, function (err, response) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    res.json({
      id: response.body.id
    });
  });
});


// Execute the payment:
app.post('/my-api/execute-payment/', function (req, res) {
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;

  //variable to save in Db
  var productID = req.body.productID;
  var customerID = req.body.customerID;
  console.log('Product ' + productID + " is buying by customer with ID:"+ customerID);

  // Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  http.post(PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute', {
    auth: {
      user: CLIENT,
      pass: SECRET
    },
    body: {
      payer_id: payerID,
      transactions: [{
        amount: {
          total: '10.99',
          currency: 'USD'
        }
      }]
    },
    json: true
  }, function (err, response) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    res.json({
      status: 'success'
    });
  });
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.sendStatus(500);
});


app.listen(1199, function () {
  console.log("Server for paypal webhooks on port 1199...");
});

module.exports = app;
