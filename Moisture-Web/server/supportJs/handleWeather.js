
const path = require('path');
require('dotenv').config({ path: __dirname + '/process.env' });

const apiKey = process.env.API_KEY
const city = "4151824"
const lat = "26.0573"
const lon = "-80.2717"

//https://api.openweathermap.org/data/2.5/onecall?lat=26.0573&lon=-80.2717&exclude=minutely&units=imperial&appid=${apiKey}
//switch to link to get better data 
const url =  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${apiKey}`;


const bodyParser = require("body-parser");
const axios = require("axios")
const msgpack = require('msgpack5')()
, decode = msgpack.decode;444
const weather = require('openweather-apis');
weather.setLang('en');
weather.setCityId(city);
weather.setAPPID(apiKey);
let globalTime = 0;


// const {insertObj, retrieveObj, updateObj} = require('./mongoClient')
const {retrieveObj, findAvgSm} = require('./mongoClient')

const retrieveWeeklyWeather = async () => {
  let response = await axios.get(url)
  let weatherData = await response.data.daily


  return await weatherData;
}
module.exports = { //will be handled by cron at 11:00 every night, since it is in Unix, will it be the next days weather at 11?
  
    async updateDb() {
    
    //what if data is not received for that day?
    try{
      let response = await axios.get(url)
      let weatherData = await response.data.daily[0] //maybe store next day for the next use in case unix deletes actual daily weather
      let todayDate = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
      todayDate = todayDate.split(',')[0] //get the date
    
      //pass in weatherData daily + date for mongo organizing 
      console.log(weatherData.rain);
      weatherData = ({
        "humidity": weatherData.humidity,
        "TMAX": weatherData.temp.max,
        "TMIN": weatherData.temp.min,
        "WSPEED": weatherData.wind_speed,
        "PRCP": typeof weatherData.rain === 'undefined' ?  0.00 : weatherData.rain
      })
      
      await findAvgSm(weatherData, todayDate, await retrieveObj("MoistureWeb"));
    } catch(e){
      console.log(e)
    }
  
        
    //   let apiPackage = smart;
    //   apiPackage = Object.assign(apiPackage, soilMoisture); //combine weather data with received MQTT data.
    //   //handleObj(apiPackage) //update/insert weather entries
     
    
    // }); does not provide daily forecast
  
  },
  async retrieveWeather(){
    let apiPackage = await retrieveWeeklyWeather();
    return apiPackage
  }
}

