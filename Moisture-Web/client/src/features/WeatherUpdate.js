
import React, { useState, useEffect } from 'react';
import '../App.css';


const apiKey = process.env.REACT_APP_WEATHER_KEY;


// import GraphManager from './features/graphManager'




function WeatherUpdate() {
    //usestate of weather data, can be an array
    //useState of soil Moisture data, can also be an array

    const [weatherAPI, setWeatherAPI] = useState([]); //will contain backend sensor data.

    /* form of 
        [temp : 25,
		humidity : 88,
		pressure : 101325,
		description : 'sun',
        weathercode : 200
        sM : 100
        VBat: 69]
        
        add picture functionality.
    */
    const [loading, setLoading] = useState(true); //only display page once data is loaded
    const [err, setError] = useState(null); // handle errors
    useEffect(() => { //render website when mounted

        const fetchData = async () => { //used callback hell because await was throwing issues

            fetch(`http://api.openweathermap.org/data/2.5/weather?id=4151824&appid=${apiKey}`).then(re => {
                if (re.ok) {
                    return re.json()
                }
                throw re
            }).then(data => {
                setWeatherAPI(data)
                console.log(data)

            }).catch(err => {
                console.log(err)
                //setError(err)
            }).finally(() => {
                console.log(weatherAPI);
                setLoading(false);

            })


        }
       
        fetchData()


    }, []) 

    
    if (err) return "error";
    if (loading) return "loading";

    return (
        <div className = "WeatherData">
            {/* <h2>Weather in the Coop</h2>
            <ul>
                <li>Temperature: {(((weatherAPI.main.temp)-273.15) * 9/5 + 32).toFixed(2)}°</li>
                <li>Humidity: {weatherAPI.main.humidity}% </li>
                <li>Description: {weatherAPI.weather[0].description}</li>
                <li>Some Extra Desc: {weatherAPI.weather[0].main}</li>
            </ul> */}
              <div className="App">
    <header className="d-flex justify-content-center align-items-center">
      <h2>SNHS Presents...</h2>
    </header>
    <div className="container">
      <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
        
        
      </div>

      <div className="card mt-3 mx-auto" style={{ width: '60vw' }}>
        {weatherAPI.main ? (
          <div className="card-body text-center">
            <img
              src={`http://openweathermap.org/img/w/${weatherAPI.weather[0].icon}.png`}
              alt="weather status icon"
              className="weather-icon"
            />

            <p className="h2">
              {(((weatherAPI.main.temp)-273.15) * 9/5 + 32).toFixed(2)}&deg; F
            </p>

            <p className="h5">
              <i className="fas fa-map-marker-alt"></i>{' '}
              <strong>{weatherAPI.name}</strong>
            </p>

            <div className="row mt-4">
              <div className="col-md-6">
                <p>
                  <i className="fas fa-temperature-low "></i>{' '}
                  <strong>
                    {(weatherAPI.main.humidity)}% 
                  </strong>
                </p>
                <p>
                  <i className="fas fa-temperature-high"></i>{' '}
                  <strong>
                    {weatherAPI.main.pressure}hPa
                  </strong>
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  {' '}
                  <strong>{weatherAPI.weather[0].main}</strong>
                </p>
                <p><strong>{typeof weatherAPI.rain === 'undefined' ? "0 " : weatherAPI.rain['1h']} hourly mm. of PRCP</strong></p>
              </div>
            </div>
          </div>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    </div>
    <footer className="footer">
      <code>
        Created by{' '}
        <a href="https://github.com/imshines" target="none">
          imshines
        </a>{' '}
        using React
      </code>
    </footer>
  </div>
  

        </div>)

}
export default WeatherUpdate;





