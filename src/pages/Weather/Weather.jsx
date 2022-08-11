import axios from 'axios';
import { useState } from 'react';
import "./Weather.css";

export default function Weather() {

    const [data, setData] = useState({});
    const [location, setLocation] = useState('hollywood');


    const url = `https://api.openweathermap.org/data/2.5/weather?q=hollywood&appid=9ebb7fe68548d4066e5174b3b0d8b388`

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
        axios.get(url).then((res) => {
            setData(res.data);
            console.log(res.data);
        })
        setLocation('');
    }
  }

    return (

        <div className="weather">
            <h2>Weather</h2>
            <hr />
            <div className='search'>
                <input 
                value={location}
                type="text" 
                placeholder="Hollywood" 
                onChange={(event) => setLocation(event.target.value)} 
                onKeyPress={searchLocation}
                />

            </div>
            
            <div className="weather-container">
                
                <h2>{data.name}</h2>
                <hr />
                    <div>
                        <span>Temperature:</span>
                        <span>{data.main ? <h1>{data.main.temp}</h1> : null }</span>
                    </div>
                   <hr /> 
                   <div>
                        <span>Humidity:</span>
                        <span>{data.main ? <h1>{data.main.humidity}%</h1> : null }</span>
                   </div>
                     <hr />
                   <div>
                       <span>Wind:</span>
                        <span>{data.wind ? <h1>{data.wind.speed}MPH</h1> : null }</span>

                    </div>
                        
            </div>
                  
        </div>
    )                 
}
