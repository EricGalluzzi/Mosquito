// server/index.js

const express = require("express");
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const PORT = process.env.PORT || 3001;
const mqtt = require('mqtt');
const app = express();

const bodyParser = require("body-parser");
const msgpack = require('msgpack5')()
  , decode = msgpack.decode; 444

let soilMoisture;

const {listen} = require('./supportJs/handleMqtt');
const {retrieveObj} = require('./supportJs/mongoClient')
const {updateDb} = require('./supportJs/handleWeather')

listen();
// updateDb({'sensorId' : 'adasrasfd', 'soilMoisture' : 57, 
// 'VBat' : 70
// });


app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api", (req, res) => {

  (async () => res.json(await retrieveObj()))() //f you async

});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


