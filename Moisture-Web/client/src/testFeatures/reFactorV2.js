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
  let [vBat, setVBat] = useState([]); //format, array of object ID and vBat
  let [dataSet, setDataSet] = useState([]);
  
 
  let [isLoaded, setLoaded] = useState(false); //duplicate testing for dev

  useEffect(() => {


    if (chart.data.length > 0) {
      if (!isLoaded) {

    
        createDataSets();
        vBatDisplay();
        setLoaded(true);

      }
    }

    //createDataSets()

  }, [chart])


  



//chart->data->each data member then has to map through its entries

 

  //essentially just map a dataset. 
  const createDataSets = () => {


    setDataSet(chart.data.map(x => ({
      label: (typeof x.sensorID === 'undefined') ? 'No Sensor ID' : x.sensorID,
      data: x.entry.map((y) => y.sM),//might not need
      borderWidth: 1,
      fill: false,
      borderColor: 'red'
    })))

  }

  const vBatDisplay = () => {

    setVBat(chart.data.map(x => ({
       "sensorID": (typeof x.sensorID === 'undefined') ? 'No Sensor ID' : x.sensorID,
      "vBat": x.entry[x.entry.length-1].vBat //see if this value is anything
     })))






  }




  var moistureData = {
    labels: "hip", //fix for legend lengths
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