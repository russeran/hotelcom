import { useState } from 'react';
import {Table} from 'react-bootstrap';
import HotelForm from '../../components/HotelForm/HotelForm.jsx';
import HotelList from '../../components/HotelList/HotelList.jsx';


export default function HotelPage({ index}) {
   const [hotels, setHotels] = useState([]);
   const [error, setError] = useState(null);
   const [checkin_date, setCheckin_date] = useState('');
   const [checkout_date, setCheckout_date] = useState('');


   const axios = require("axios");

   const options = {
     method: 'GET',
     url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
     params: {
       latitude: '34.0996494',
       currency: 'USD',
       longitude: '-118.3334383',
       checkout_date: `${checkout_date}`,
       sort_order: 'BEST_SELLER',
       checkin_date: `${checkin_date}`,
       adults_number: '1',
       locale: 'en_US'
     },
     headers: {
       'X-RapidAPI-Key': '3c30f65b81msh70f4a13bd6bf8ccp1c759ajsnc90fcdc9b0bb',
       'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
     }
   };

   const searchDate = (e) => {
  
    if (e.key === 'Enter') {
      console.log("gfk")
        axios.request(options).then(response => {
            setHotels(response.data.searchResults.results);
        }).catch(function (error) {

            setError(error);
            ;
        }).then(() => {
            setCheckin_date('');
            setCheckout_date('');
        }
        );
    }
}

   return (
    <div>
    <HotelForm searchDate={searchDate} setCheckin_date={setCheckin_date} setCheckout_date={setCheckout_date} setHotels={setHotels} checkin_date={checkin_date} checkout_date={checkout_date}/>
    <HotelList hotels={hotels} index={index} />
    </div>

    );
    }