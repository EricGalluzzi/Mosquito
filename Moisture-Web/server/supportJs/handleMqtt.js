
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const mqttPass = process.env.MQTTPASSWORD;
const mqttIP = process.env.MQTTIP
const mqtt = require('mqtt');

const host = mqttIP;
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const topic = 'helium/+/rx'
const connectUrl = `mqtt://${host}:${port}`

const bodyParser = require("body-parser");
const msgpack = require('msgpack5')()
    , decode = msgpack.decode;

const { updateDb } = require('./handleWeather.js');
let soilMoisture;
module.exports = {
 
//initialize mqtt session
    listen() {
        const client = mqtt.connect(connectUrl, {
            clientId,
            clean: false,
            connectTimeout: 4000,
            debug: true,
            username: 'EGall2004',
            password: mqttPass,
            reconnectPeriod: 1000 * 1,
        })
        client.on('connect', () => {
            console.log('Connected')
            client.subscribe([topic], () => {
                console.log(`Subscribe to topic '${topic}'`)
            })

        })
        let test = '' //access payload globally, theres gotta be a better solution 

        //receive Helium publish
        client.on('message', (topic, payload) => {
            try {
            test = JSON.parse(payload);

            //unpack data

            let buff = new Buffer(test['payload'], 'base64'); //unpack on database retrieve to send less data
            let unpacked = decode(buff);
            let sensorID = topic.split("/")[1];
            unpacked["sensorID"]= sensorID;
            soilMoisture = unpacked;

            updateDb(soilMoisture); //when data value is received, access Handle weather JS. 

            } catch (e) {
                console.log(e);
                console.log("Usually undefined data");
            }

        })

        client.on("error", function (error) {
            console.log("ERROR: ", error);
        }); //error mqtt

        client.on('offline', function () {
            console.log("offline");
        }); //offline mqtt

        client.on('reconnect', function () {
            console.log("reconnect");
        }); //reconnect mqtt
    }
}
