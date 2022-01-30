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
  let [bigArray, setBigArray] = useState([]);
  let [bigArrayLoaded, setBigArrayLoaded] = useState(false);
  let [isLoaded, setLoaded] = useState(false); //duplicate testing for dev

  useEffect(() => {


    if (chart.data.length > 0) {
      if (!isLoaded) {

        initializeBigArray();
        createDataSets();
        vBatDisplay();
        setLoaded(true);

      }
    }

    //createDataSets()

  }, [chart]) //could be refreshed using setInterval, but its known for memory leaks. 


  const initializeBigArray = () => {

    let copy = bigArray;

    chart.data.map(x => {

      x.entry.map(y => {

        let exists = findIfIdExists(y.sensorID, copy);
        if (exists === -1) {
          copy.push([y]);
        }
        else {

          // var valueArr = copy[exists].map((item)=> item.expirationSet );
          // if(!valueArr.some((item, idx)=> item == y.expirationSet )) 
          copy[exists].push(y); //delete duplicates because initializeBigArray is called twice


        }
      })




    })
    setBigArray(copy);
    setBigArrayLoaded(true); // if this causes a remound we need a way to stop duplicates. 
  }

  const findIfIdExists = (y, copy) => {
    for (let i = 0; i < copy.length; i++) {

      if (copy[i][0].sensorID == y){ //look into first element only
        
      return i;
      }

    }

    return -1;
  }

  //essentially just map a dataset. 
  const createDataSets = () => {
    console.log(bigArray)

    setDataSet(bigArray.map((x, i) => ({
      label: (typeof x[0].sensorID === 'undefined') ? 'No Sensor ID' : x[0].sensorID,
      data: x.map((x) => x.sM),//might not need
      borderWidth: 1,
      fill: false,
      borderColor: 'red'
    })))

  }

  const vBatDisplay = () => {

    setVBat(bigArray.map(x => ({
      "sensorID": (typeof x[0].sensorID === 'undefined') ? 'No Sensor ID' : x[0].sensorID,
      "vBat": x[x.length - 1].vBat //see if this value is anything
    })))






  }




  var moistureData = {
    labels: chart.data.map(x=>x.dateInterval), //fix for legend lengths
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
    labels: vBat.map(x => x.sensorID),
    datasets: [
      {
        label: 'Battery Voltage',

        borderColor: 'red',
        borderWidth: 2,
        data: vBat.map(x => x.vBat)
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