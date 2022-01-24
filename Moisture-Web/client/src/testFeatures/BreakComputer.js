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


const BreakComputer = (chart) => {
  let [vBat, setVBat] = useState(0);
  let [dataSet, setDataSet] = useState([]);
  let [bigArray, setBigArray] = useState([]);
  let [isLoaded, setLoaded] = useState(false); //duplicate testing for dev
  useEffect(() => {
    console.log(chart)

    if (chart.data.length > 0) {
      if (!isLoaded) {

        initializeBigArray();
        createDataSets();
        setLoaded(true);
      }
    }

    //createDataSets()

  }, [chart]) //Rerenders when chart updates. Originally, vBat would remain unchanged since its state would never change. By passing the prop as an argument, the page renders with the asynchronous passing of chart (chart was passed through an async array)


  const initializeBigArray = () => {
    let copy = bigArray;

    chart.data.map(x => {

      x.entry.map(y => {

        let exists = findIfIdExists(y.sensorId, copy);
        // console.log(exists);
        // console.log(y);
        // console.log(bigArray)
        if (exists == -1) {
          copy.push([y]);
        }
        else {

          console.log("hey:")
          console.log(copy)

          // var valueArr = copy[exists].map((item)=> item.expirationSet );
          // if(!valueArr.some((item, idx)=> item == y.expirationSet )) 
          copy[exists].push(y); //delete duplicates because initializeBigArray is called twice


        }
      })




    })
    setBigArray(copy)
  }

  const findIfIdExists = (y, copy) => {
    for (let i = 0; i < copy.length; i++) {
      console.log(y)
      let exists = copy[i].find(entries => entries.sensorId == y);


      if (exists != undefined) return i;
      console.log("i didnt");


    }

    return -1;
  }

  //essentially just map a dataset. 

  const createDataSets = () => {


    setDataSet(bigArray.map((x, i) => ({
      label: (typeof x[0].sensorId === 'undefined') ? 'No Sensor ID' : x[0].sensorId,
      data: x.map((x) => x.soilMoisture),//might not need
      borderWidth: 1,
      fill: false,
      borderColor: 'red'
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

export default BreakComputer