
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });

const apiKey = process.env.API_KEY
const city = "4151824"

const url =  `http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apiKey}`;
const clock = require('clock');
const hoursToMs = 3600000;
const bodyParser = require("body-parser");
const msgpack = require('msgpack5')()
, decode = msgpack.decode;444
const weather = require('openweather-apis');
weather.setLang('en');
weather.setCityId(city);
weather.setAPPID(apiKey);
let globalTime = 0;


// const {insertObj, retrieveObj, updateObj} = require('./mongoClient')
const {retrieveObj, handleObj} = require('./mongoClient')

module.exports = {
    async updateDb(soilMoisture) {
  
    await weather.getSmartJSON(async function(err, smart){ //retrieve weather data from API
          
      let apiPackage = smart;
      apiPackage = Object.assign(apiPackage, soilMoisture); //combine weather data with received MQTT data.
      handleObj(apiPackage) //update/insert weather entries
     
    
    });
  
  }
}

