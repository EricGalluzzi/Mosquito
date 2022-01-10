import logo from './logo.svg';
import './App.css';
import React from 'react';
import {
    Route,
    BrowserRouter,
    Routes,
} from "react-router-dom";
import Home from './Home';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
