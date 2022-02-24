// server/index.js

const express = require("express");
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const PORT = process.env.PORT || 3001;
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
cron.schedule('0 23 * * *', () =>{
  soilMoisture = {"SM" : 76}
  updateDb(soilMoisture);
}, {
  timezone: "America/New_York"
})
listen(); //start MQTT listening //testing weather

// updateDb({'sensorId' : 'adasrasfd', 'soilMoisture' : 57, 
// 'VBat' : 70
// });


app.use(express.static(path.resolve(__dirname, '../client/build'))); //serve react webpage
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api", (req, res) => {

  (async () => res.json(await retrieveObj("handleData")))() //retrieve mongo entries. Had to be async in order to work properly

});
app.get("/alert", (req, res) => {

  (async () => res.json(await iLovePython()))() //retrieve mongo entries. Had to be async in order to work properly

});


app.get('*', (req, res) => { //index html for homepage
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => { //listen for requests on port. 
  console.log(`Server listening on ${PORT}`);
});


