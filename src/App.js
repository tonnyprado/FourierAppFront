import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function App() {
  const [data, setData] = useState ([]);

  const handleClick = async () => {
    console.log("Botón presionado");
    const signal = [1,0,-1,0,1,0,-1,0];//REEMPLAZAR POR VERDADERAS SEÑALES

    const response = await axios.post('http://localhost:8080/api/fourier', signal);
    console.log("Response: ", response.data); //to test
    setData(response.data);
    const formatted = response.data.map((value, index) => ({freq: index, magnitude: value}));
    setData(formatted);
  };

  return (
    <div>
      <button onClick={handleClick}>CALCULAR FOURIER</button>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="freq" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="magnitude" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default App;
