
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';

import Nav from './features/navBar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// import GraphManager from './features/graphManager'
import GraphManager from './features/newGraphFormat'



function Home() {
    //usestate of weather data, can be an array
    //useState of soil Moisture data, can also be an array

    const [restAPI, setRestAPI] = useState([]); //will contain backend sensor data.

    /* form of 
        [temp : 25,
		humidity : 88,
		pressure : 101325,
		description : 'sun',
        weathercode : 200
        sM : 100
        VBat: 69]
        
        add picture functionality.
    */
    const [loading, setLoading] = useState(true); //only display page once data is loaded
    const [err, setError] = useState(null); // handle errors
    useEffect(() => { //render website when mounted

        const fetchData = async () => { //used callback hell because await was throwing issues

            fetch('/api').then(re => {
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
       
        fetchData()


    }, []) 

    
    if (err) return "error";

    return (
        <div className="Home">
            <Nav />
            <div>
            
                <GraphManager data={restAPI} />
            </div>
        </div>

    );

}
export default Home;





