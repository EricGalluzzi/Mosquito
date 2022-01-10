import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const cooperCityWeatherId = 4151824;
const apiKey = process.env.REACT_APP_WEATHER_KEY;





const WeatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?id=${cooperCityWeatherId}&appid=${apiKey}`

const LineChart = () => {
    const [chart, setChart] = useState({})
    const [temp, setTemp] = useState([])
  
  
  
    useEffect(() => {
        const fetchData = async () =>{
            /*
              new rest format
              weatherApi pulls from /api/weather

              will pull weather array of past temperature, descriptions, humidity, etc.

              lastmeasured temp
              lastmeasured description
              lastmeasured humidity
              last measured data
              
            */





            Promise.all([
              fetch(WeatherApiUrl).then((resp)=> resp.json()).then(weather => {
                
                setChart(weather)
                setTemp([...temp, weather.main.temp])
              })
                //fetch('/api').then(resp => resp.json()).then(moisture => setSoilMoisture(moisture)),
            ]).catch((error) => {
                console.log(error);
              });
            }
        
        fetchData()


        }, []);
      
  
  
    console.log("chart", chart);
    
    var data = {
      labels: chart?.weather?.map(x => x.description),
      datasets: [{
        label: `${chart?.weather?.length}`,
        data: temp,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };
  
    var options = {
      maintainAspectRatio: false,
      scales: {
      },
      legend: {
        labels: {
          fontSize: 25,
        },
      },
    }
  
    return (
      <div>
        <Line
          data={data}
          height={400}
          options={options}
  
        />
      </div>
    )
  }
  
  export default LineChart