import {axios} from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import {Table} from 'react-bootstrap';


export default function HotelPrices() {
   const [hotels, setHotels] = useState([]);
   const [error, setError] = useState(null);


 

 
  

   const axios = require("axios");

   const options = {
     method: 'GET',
    //  url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
     params: {
       latitude: '34.0996494',
       currency: 'USD',
       longitude: '-118.3334383',
       checkout_date: '2022-09-03',
       sort_order: 'BEST_SELLER',
       checkin_date: '2022-09-02',
       adults_number: '1',
       locale: 'en_US'
     },
     headers: {
       'X-RapidAPI-Key': '3c30f65b81msh70f4a13bd6bf8ccp1c759ajsnc90fcdc9b0bb',
       'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
     }
   };
   
   axios.request(options).then(response => {
     setHotels(response.data.searchResults.results);
   }).catch(function (error) {
     console.error(error)
     setError(error);
     ;
   });



  // axios.request(options).then(function (response) {
  //   var hotel = response.data.searchResults.results;
  //   var price = hotel[0].ratePlan.price.current;
  //   for (const key in hotel) {
  //     if (hotel.hasOwnProperty(key)) {
  //        element = hotel[key];
  //     }
  //   }
  //    } 
  
  
  // ).catch(function (error) {
  //   console.error(error);
  // });

  return (

    <div>
      <h2>HOTELS</h2>
  {hotels.map(hotel => {
    return (
      <div key={hotel.name} >
        <div>
          <h2>HOTEL NAME</h2>
          <h3>{hotel.name}</h3>
        </div>
        <div>
          <h2>HOTEL PRICE</h2>
          <h3>{hotel.ratePlan.price.current}</h3>
        </div>
        <div>
        <h2>ROOMS LEFT</h2>
        <h3>{hotel.roomsLeft}</h3>
        </div>
        <div>
        <h2>Neighbourhood</h2>
        <h3>{hotel.neighbourhood}</h3>
        </div>
        <div>
          <h2>Rating</h2>
          <h3>{hotel.guestReviews.rating}</h3>
        </div>


          
      </div>

    )

  })}
    
   </div>
   
  );
}