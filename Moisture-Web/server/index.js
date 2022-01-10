// server/index.js

const express = require("express");
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const PORT = process.env.PORT || 3001;
const mqtt = require('mqtt');
const app = express();
const apiKey = process.env.API_KEY
const city = "4151824"


const url =  `http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apiKey}`;
const host = "10.0.0.228"
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const topic = 'helium/50529e4d-b101-461b-8170-7e7192accc1a/rx'
const connectUrl = `mqtt://${host}:${port}`
const request = require('request');
const bodyParser = require("body-parser");
const msgpack = require('msgpack5')()
, decode = msgpack.decode;444
const weather = require('openweather-apis');
weather.setLang('en');
weather.setCityId(city);
weather.setAPPID(apiKey);

const {insertObj, retrieveObj} = require('./mongoClient');

let soilMoisture;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: false,
  connectTimeout: 4000,
  debug: true,
  username: 'EGall2004',
  password: '4930Soccer',
  reconnectPeriod: 1000 *1,
})
client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
    })
    
  })
let test = '' //access payload globally, theres gotta be a better solution 
client.on('message', (topic, payload) => {
    
    test = JSON.parse(payload);
   
    let buff = new Buffer(test['payload'], 'base64');
    let unpacked = decode(buff);
    soilMoisture = unpacked;
    updateDb(soilMoisture);
    
  })

  client.on("error", function(error) {
    console.log("ERROR: ", error);
});

client.on('offline', function() {
    console.log("offline");
});

client.on('reconnect', function() {
    console.log("reconnect");
});


const updateDb = (soilMoisture) => {
  
  weather.getSmartJSON(async function(err, smart){
		
    let apiPackage = smart
    apiPackage = Object.assign(apiPackage, soilMoisture); //data also contains vBat
    
    await insertObj(apiPackage);
  });

}
updateDb({'soilMoisture' : 69, //test updateDb
'VBat' : 100
});



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


  