// server/index.js

const express = require("express");
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const PORT = process.env.PORT || 3002;
const mqtt = require('mqtt');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const msgpack = require('msgpack5')()
    , decode = msgpack.decode;
let soilMoisture;
let cron = require('node-cron')
const {listen} = require('./supportJs/handleMqtt');
const {retrieveObj} = require('./supportJs/mongoClient')
const {updateDb} = require('./supportJs/handleWeather')
const {iLovePython} = require('./supportJs/connect')

cron.schedule('58 23 * * *', () =>{ //schedule front-end updates
  updateDb();
}, {
  timezone: "America/New_York"
})
listen(); //start MQTT listening


app.use(express.static(path.resolve(__dirname, '../client/build'))); //serve react webpage
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api", (req, res) => {

  (async () => res.json(await retrieveObj("handleData")))() //retrieve mongo entries. Had to be async in order to work properly

});
app.get("/alert", (req, res) => {

  (async () => res.json(await iLovePython()))() //handle risk alerts

});


app.get('*', (req, res) => { //mount react
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => { //listen for requests on port. 
  console.log(`Server listening on ${PORT}`);
});


