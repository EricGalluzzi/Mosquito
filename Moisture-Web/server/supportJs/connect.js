require('dotenv').config({ path: __dirname + '/process.env' });
const path = require('path');
const bodyParser = require("body-parser");
const axios = require("axios")
const flaskIP = process.env.FLASKIP;
const {retrieveObj} = require('./mongoClient')
const {retrieveWeather} = require('./handleWeather')
module.exports = {
    async iLovePython(){
        data = await retrieveObj("handleData"); //switch to a specialzied query
        weatherData = await retrieveWeather();
        
        //data gets an array of handle data
        /*
            [{sensor1, entry: []}, sensor2, entry: []]
        */
       data = (data.length > 0) ? data.map(x=> ({
           'sensorID': x.sensorID,
           'Date': x.entry[x.entry.length-1].Date,
           'PRCP': x.entry[x.entry.length-1].PRCP,
           'SM': x.entry[x.entry.length-1].sM,
           'TEMP': weatherData.map(x=> x.temp.day),
           'Humidity': weatherData.map(x=> x.humidity)
        })) : "empty";
        try{
        alerts = await axios.post(flaskIP, (data))
        return(await alerts.data );
        } catch (e){
            console.log(e)
        }
        //let response = await axios.post(url, obj)
    }


}