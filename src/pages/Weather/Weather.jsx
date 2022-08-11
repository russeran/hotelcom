import axios from 'axios';
import { useState } from 'react';

export default function Weather() {

    const [data, setData] = useState({});
    const [location, setLocation] = useState('');


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=9ebb7fe68548d4066e5174b3b0d8b388`

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
<div></div>
    //     <div className="weather">
    //         <div className='search'>
    //             <input 
    //             value={location}
    //             type="text" 
    //             placeholder="Search" 
    //             onChange={(event) => setLocation(event.target.value)} 
    //             onKeyPress={searchLocation}
    //             />

    //         </div>
    //         <h1>Weather</h1>
    //         <div className="weather-container">
                
    //                         <h2>{data.name}</h2>
    //                         <h2>Weather</h2>
    //                         <div>
    //                             <span>Temperature:</span>
    //                             <span>{data.main ? <h1>{data.main.temp}</h1> : null }</span>
    //                         </div>    
    //                         <div>
    //                             <span>Humidity:</span>
    //                             <span>{data.main ? <h1>{data.main.humidity}%</h1> : null }</span>
    //                         </div>
    //                         <div>
    //                             <span>Wind:</span>
    //                             <span>{data.wind ? <h1>{data.wind.speed}MPH</h1> : null }</span>

    //                         </div>
                        
    //                     </div>
                  
    //     </div>
    )                 
}
