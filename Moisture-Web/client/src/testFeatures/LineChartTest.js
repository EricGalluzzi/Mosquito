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
import { ProgressBar } from 'react-bootstrap';
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


const LineChartTest = (chart) => {
    let [vBat, setVBat] = useState(0)
    let [dataSet, setDataSet] = useState([])
    useEffect(() => {
      setVBat(chart ?.data ?.slice(-1).pop() ?.VBat) //some reason would'nt let me access vBat from final index like a normal person
      createDataSets()
    }, [chart]) //Rerenders when chart updates. Originally, vBat would remain unchanged since its state would never change. By passing the prop as an argument, the page renders with the asynchronous passing of chart (chart was passed through an async array)
  
  
  
  //essentially just map a dataset. 

  const createDataSets =() =>{
    
    
        setDataSet(chart?.data[0]?.soilMoisture?.map((x,i) =>({
        label: (typeof chart.data[0].sensorId === 'undefined') ? 'No Sensor ID' : chart?.data[0]?.sensorId[0],
        data: chart?.data?.map(x=> (x.soilMoisture[i] === 'undefined') ? 0 : x.soilMoisture[i]) ,//might not need
        borderWidth: 1,
        fill: false,
        borderColor: 'red'
    })))
    
  }
  console.log(chart.data[1].soilMoisture[1])
  
  
  
  
    
    var moistureData = {
      labels: chart ?.data.map(x => String(x.expirationSet).substring(0, 10)),
      datasets: dataSet
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
        <br />
        <br />
        <div className='moistureGraph'>
          <Line
            data={moistureData}
            height={400}
            options={options}
          />
  
        </div></div>
    )
  }
  
  export default LineChartTest