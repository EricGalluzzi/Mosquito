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
  let [dataSet, setDataSet] = useState([]); //Contains datasets for line graph. 
  
 
  let [isLoaded, setLoaded] = useState(false); //duplicate testing for dev

  useEffect(() => {


    if (chart.data.length > 0) { //only render when actual data is passed in.
      if (!isLoaded) { //only render once

      
        createDataSets(); //create Data Sets
        vBatDisplay(); //create vBat display
        setLoaded(true);

      }
    }

    //createDataSets()

  }, [chart]) //rerender when restAPI data changes on Home.js


  



 

  //essentially just map a dataset. 
  const createDataSets = () => {


    setDataSet(chart.data.map(x => ({
      label: (typeof x.sensorID === 'undefined') ? 'No Sensor ID' : x.sensorID,
      data: x.entry.map((y) => y.sM),//data would require parsing through the entry component of each document.
      borderWidth: 1,
      fill: false,
      borderColor: 'red'
    })))

  }

  const vBatDisplay = () => {

    setVBat(chart.data.map(x => ({
       "sensorID": (typeof x.sensorID === 'undefined') ? 'No Sensor ID' : x.sensorID,
      "vBat": x.entry[x.entry.length-1].vBat //get latest battery voltage
     })))






  }




  var moistureData = {
    labels: chart?.data[0]?.entry?.map(y=> y.recordedAt), //fix for legend lengths (do line with max value)
    datasets: dataSet
  };

  var options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Soil Moisture Data'
      }
    },
    scales: {
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
  console.log(vBat);
  return (
    <div>
      <br />
      <br />
      <div className='moistureGraph'>
        <Line
          data={moistureData}
          height={400}
          options={options}
        />
      </div>
      <div className='voltageGraph'>
        <Bar
          data={displayVBat}
          height={400}
          options={options}
        />
      </div>
    </div>
  )
}

export default GraphManager