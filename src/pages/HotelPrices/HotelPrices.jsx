import axios from "axios";
import { useState } from "react";
import "./HotelPrices.css";


export default function HotelPrices(){

  const options = {
    method: 'GET',
    url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
    params: {
      latitude: '34.099645',
      currency: 'USD',
      longitude: '-118.3312496',
      checkout_date: '2022-09-03',
      sort_order: 'BEST_SELLER',
      checkin_date: '2022-09-02',
      adults_number: '1',
      locale: 'en_US',
      guest_rating_min: '3',
      star_rating_ids: '3,4,5',
      children_ages: '4,0,15',
      page_number: '1',
      price_min: '10',
      accommodation_ids: '20,8,15,5,1',
      theme_ids: '14,27,25',
      price_max: '800',
      amenity_ids: '527,2063'
    },
    headers: {
      'X-RapidAPI-Key': '3c30f65b81msh70f4a13bd6bf8ccp1c759ajsnc90fcdc9b0bb',
      'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
    }
  };
  
console.log(options);

  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });


return (
  <div></div>
);


};