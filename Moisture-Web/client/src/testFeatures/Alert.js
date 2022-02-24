
import React, { useState, useEffect } from 'react';
import '../App.css';





// import GraphManager from './features/graphManager'




function Alert() {
 
    const [alert, setAlert] = useState([]); //will contain what is returned from alert- can be an array or string?

    const [loading, setLoading] = useState(true); //only display page once data is loaded
    const [err, setError] = useState(null); // handle errors
    useEffect(() => { //render website when mounted

        const fetchData = async () => { //used callback hell because await was throwing issues

            fetch(`/alert`).then(re => {
                if (re.ok) {
                    return re.json()
                }
                throw re
            }).then(data => {
                setAlert(data)
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
    if (loading) return "loading";

    return (
        <div className = "AlertData">
            <h1 style = {{color: 'red'}}>Alerts by Sensor: (GeoTagging soon...)</h1>
                <table>
                <tr>
                    <th>SensorID</th>&nbsp;
                    <th>Risk Level Detected</th>
                </tr>
                {alert.map(x=> {
                   let color;
                   switch(x.risk){
                    case 0: color = 'green'; break;
                    case 1: color = 'orange';break;
                    case 2: color = 'red'; break;
                   }
                   return  (
                    <tr key = {x.sensorID}>
                        <td>{x.sensorID}</td>&nbsp;
                        <td style = {{color: color}}> {x.info}</td>
                    </tr>
                    // <p style = {{color: color}}>{x.sensorID}: {x.info}</p>
                    
                )
            })
        }
        </table>
                

        </div>)

}
export default Alert;
