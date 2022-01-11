
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';

import Nav from './features/navBar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LineChart from './LineChart'

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
                setError(err)
            }).finally(() => {
                setLoading(false);

            })


        }

        fetchData()


    }, []) //refresh feature might not be needed if recordings are taken out at long spaced out intervals

    if (err) return "error";

    return (
        <div className="Home">
            <Nav />
            <div>
                <LineChart data={restAPI} />
            </div>
        </div>

    );

}
export default Home;





