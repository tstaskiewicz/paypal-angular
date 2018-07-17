var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["Origin", "Content-Type"]);
  next();
});

app.post("/logs/paypal", function (req, res, next) {
  console.log(req.body);
  res.send("OK");
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.sendStatus(500);
});


app.listen(1199, function () {
  console.log("Server for paypal webhooks (on port 1199...");
});

module.exports = app;
