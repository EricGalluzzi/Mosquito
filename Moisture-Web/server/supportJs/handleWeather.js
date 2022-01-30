
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


const {insertObj, retrieveObj, updateObj} = require('./mongoClient')

module.exports = {
    async updateDb(soilMoisture) {
  
    await weather.getSmartJSON(async function(err, smart){
          
      let apiPackage = smart;
      apiPackage = Object.assign(apiPackage, soilMoisture); //data also contains vBat
      if(Date.now() <= globalTime + hoursToMs){ //timer for new db entries. add: instead of using Date, use date of last entry.- avoid creating new entries on server reboot.
        updateObj(apiPackage);
      } else{
        
        insertObj(apiPackage);
        globalTime = Date.now();
      }
     
    
    });
  
  }
}

