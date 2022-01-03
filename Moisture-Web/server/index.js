// server/index.js

const express = require("express");
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const PORT = process.env.PORT || 3001;
const mqtt = require('mqtt');
const app = express();
const apiKey = process.env.API_KEY
const city = "4151824"

//const url =  `http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apiKey}`;
const host = "10.0.0.228"
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const topic = 'helium/50529e4d-b101-461b-8170-7e7192accc1a/rx'
const connectUrl = `mqtt://${host}:${port}`
const request = require('request');
const bodyParser = require("body-parser");
const msgpack = require('msgpack5')()
, decode = msgpack.decode;
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
    // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    //     if (error) {
    //       console.error(error)
    //     }
    //   })
    
  })
let test = '' //access payload globally, theres gotta be a better solution 
client.on('message', (topic, payload) => {
    
    test = JSON.parse(payload);
   
    let buff = new Buffer(test['payload'], 'base64');
    let unpacked = decode(buff);
    soilMoisture = unpacked;
    
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




// Have Node serve the files for our built React app
let weather;
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));

//Request info on timeout. We have limited calls per month.
// const reqPls = () => {
// request(url, function(err, response, body) {

//     // On return, check the json data fetched
    
//         weather = body;

//       //console.log(JSON.parse(body).main.temp);
//       })
// }

//where json data is sent for front end.
app.get("/api", (req, res) => {
  console.log(soilMoisture)
  if (soilMoisture != undefined){
    res.json(soilMoisture);
  }else {
    res.json("nothing");
  }
  
});

//setTimeout(reqPls, 5000)

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  