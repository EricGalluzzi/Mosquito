
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });
const mqttPass = process.env.MQTTPASSWORD;
const mqtt = require('mqtt');

const host = "10.0.0.228"
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
        client.on('message', (topic, payload) => {

            test = JSON.parse(payload);

            let buff = new Buffer(test['payload'], 'base64'); //unpack on database retrieve to send less data
            let unpacked = decode(buff);
            let sensorID = topic.split("/")[1];
            unpacked["sensorID"]= sensorID;
            soilMoisture = unpacked;

            updateDb(soilMoisture);

        })

        client.on("error", function (error) {
            console.log("ERROR: ", error);
        });

        client.on('offline', function () {
            console.log("offline");
        });

        client.on('reconnect', function () {
            console.log("reconnect");
        });
    }
}
