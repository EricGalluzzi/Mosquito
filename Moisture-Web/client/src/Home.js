
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';

import Nav from './features/navBar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import LineChart from './LineChart'
//import LineChartTest from './testFeatures/LineChartTest'
import BreakComputer from './testFeatures/BreakComputer'

function Home() {
    //usestate of weather data, can be an array
    //useState of soil Moisture data, can also be an array

    const [restAPI, setRestAPI] = useState([]);

    /* form of 
        [temp : 25,
		humidity : 88,
		pressure : 101325,
		description : 'sun',
        weathercode : 200
        soilMoisture : 100
        VBat: 69]
        
        add picture functionality.
    */
    const [loading, setLoading] = useState(true);
    const [err, setError] = useState(null)
    useEffect(() => {

        const fetchData = async () => { //used callback hell because await was throwing issues

            fetch('http://localhost:3001/api').then(re => {
                if (re.ok) {
                    return re.json()
                }
                throw re
            }).then(data => {
                setRestAPI(data)
                console.log(data)

            }).catch(err => {
                console.log(err)
                //setError(err)
            }).finally(() => {
                setLoading(false);

            })


        }
        //let p =[{ "entry": [{"_id":"61dcf08892345810681c7f7b","temp":21.89,"humidity":80,"pressure":1021,"description":"clear sky","weathercode":800,"rain":0,"soilMoisture":100,"VBat":100,"expirationSet":"2022-01-11T02:50:48.753Z"}, {"_id":"61dcf08892345810681c7f7","temp":21.89,"humidity":80,"pressure":1021,"description":"clear sky","weathercode":800,"rain":0,"soilMoisture":70,"VBat":100,"expirationSet":"2022-01-11T02:50:48.753Z"}]}, {"entry": [{"_id":"61dcf08892345810681c7fb","temp":21.89,"humidity":80,"pressure":1021,"description":"clear sky","weathercode":800,"rain":0,"soilMoisture":69,"VBat":100,"expirationSet":"2022-01-11T02:50:48.753Z"}]}, { "entry": [{"_id":"61dcf08892345810681c7f7b","temp":21.89,"humidity":80,"pressure":1021,"description":"clear sky","weathercode":800,"rain":0,"soilMoisture":100,"VBat":100,"expirationSet":"2022-01-10T02:50:48.753Z"}, {"_id":"61dcf08892345810681c7f7","temp":21.89,"humidity":80,"pressure":1021,"description":"clear sky","weathercode":800,"rain":0,"soilMoisture":70,"VBat":100,"expirationSet":"2022-01-10T02:50:48.753Z"}]}]} />
        fetchData()


    }, []) //refresh feature might not be needed if recordings are taken out at long spaced out intervals

    if (err) return "error";

    return (
        <div className="Home">
            <Nav />
            <div>
            
                <BreakComputer data={restAPI} />
            </div>
        </div>

    );

}
export default Home;





