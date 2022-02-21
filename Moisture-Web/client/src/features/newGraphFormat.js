import React, { useState, useEffect } from 'react'
import '../App.css';
import WeatherUpdate from './WeatherUpdate'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
} from 'chart.js';
import { ProgressBar } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement
);


const GraphManager = (chart) => {
  let [vBat, setVBat] = useState([]); //Holds Battery Voltage value for Bar chart
  let [graphSet, setGraphSet] = useState([]); //Contains datasets for line graph. 

 
  let [isLoaded, setLoaded] = useState(false); //duplicate testing for dev

  useEffect(() => {


    if (chart.data.length > 0) { //only render when actual data is passed in.
        
      if (!isLoaded) { //only render once

      
        createGraphs(); //create Data Sets
        
        vBatDisplay(); //create vBat display
        setLoaded(true);

      }
    }

    //createGraphSets()

  }, [chart]) //rerender when restAPI data changes on Home.js


  



 

  //essentially just map a dataset. 

  //setGraphSet-> setGraphs 

  /*
map a graph for each after creating a a set of graph data

//each label equals its own date
//each data set has label sensor ID // could change since title could be sensor ID
//data - map sM.



  */
 const createGraphs = () => {
     setGraphSet(chart.data.map(x=>({
         labels: x.entry.map(y=> y.Date), //add time :(((())))
         datasets : [{
            label : x.sensorID,
            data: x.entry.map((y) => y.sM),
            borderWidth: 1,
            fill: false,
            borderColor: 'red'

         }]
     })))
     
 }

  const vBatDisplay = () => {

    setVBat(chart.data.map(x => ({
       "sensorID": (typeof x.sensorID === 'undefined') ? 'No Sensor ID' : x.sensorID,
      "vBat": x.entry[x.entry.length-1].vBat //get latest battery voltage
     })))






  }




//   var moistureData = {
//     labels: chart?.data[0]?.entry?.map(y=> y.recordedAt), //fix for legend lengths (do line with max value)
//     datasets: graphSet
//   };

  var options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Soil Moisture Data'
      }
    },
    scales: {
        y: {
          beginAtZero: true
        }
      },
    legend: {
      labels: {
        fontSize: 25,
      },
    },
  }

  const displayVBat = {
    labels: chart.data.map(x => x.sensorID),
    datasets: [
      {
        label: 'Battery Voltage',

        borderColor: 'red',
        borderWidth: 2,
        data: chart.data.map(x => (x.entry[x.entry.length-1].vBat/1000.0))
      }
    ]
  }
  

  graphSet.map((x)=> {
      
    console.log(x)
      
  })
  
  return (

      
      <div className='moistureGraphs'>
      
    
    <WeatherUpdate/>
  
    
      {graphSet.length > 0 ?  
        graphSet.map((x,i)=> (
        <div className = "sub chart-wrapper" key = {i}>
        <Line 
          data = {x}
          height = {400}
          options = {options} 

      /></div>)) : "Soil Moisture Graphs Unavailable"}
        
      

      
      
      <div className='voltageGraph'>
        {vBat.length > 0? <Bar
          data={displayVBat}
          height={400}
          options={options}
        /> : "Battery Voltage Unavailable"}
      </div>
      </div>
    
  )
}

export default GraphManager