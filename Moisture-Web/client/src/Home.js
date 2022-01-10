
import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'react-bootstrap';
import Nav from './features/navBar' ;
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import LineChart from './LineChart'







function Home(){
    //usestate of weather data, can be an array
    //useState of soil Moisture data, can also be an array
    
    const [restAPI, setRestAPI] = useState({});
    //const [chartData, setChartData] = useState({})

    
    //API data with a promise resolve nad useEffect
    useEffect(() => {
   
        //fetch rest api
        /*
            json format:

            soilMoisture array - read from database
            last soil moisture reading

        */
        

       
       
    
       
    },[])
    

    return(
        <div className="Home">
            <Nav />
            <div>
             <LineChart />   
            
            </div>
        </div>

        
        
    );




}
export default Home;





