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







const LineChart = (chart) => {
  let [vBat, setVBat] = useState(0)
  useEffect(() => {
    setVBat(chart ?.data ?.slice(-1).pop() ?.VBat) //some reason would'nt let me access vBat from final index like a normal person

  }, [chart]) //Rerenders when chart updates. Originally, vBat would remain unchanged since its state would never change. By passing the prop as an argument, the page renders with the asynchronous passing of chart (chart was passed through an async array)






  var data = {
    labels: chart ?.data.map(x => String(x.expirationSet).substring(0, 10)),
    datasets: [{
      label: 'Temperature',
      data: chart ?.data.map(x => x.temp),
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

  var moistureData = {
    labels: chart ?.data.map(x => x.description),
    datasets: [{
      label: 'Soil Moisture',
      data: chart ?.data.map(x => x.soilMoisture),
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
      <div className="progressBar">
        Battery Voltage
                <ProgressBar now={vBat} />
        percentage: {vBat}
      </div>
      <div>
        <Line
          data={data}
          height={400}
          options={options}

        />
      </div>
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

export default LineChart