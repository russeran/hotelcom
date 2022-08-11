import axios from "axios";



export default axios.create({
  method: 'GET',
  url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
  params: {
    latitude: '51.509865',
    currency: 'USD',
    longitude: '-0.118092',
    checkout_date: '2022-08-27',
    sort_order: 'STAR_RATING_HIGHEST_FIRST',
    checkin_date: '2022-08-26',
    adults_number: '1',
    locale: 'en_US',
    guest_rating_min: '4',
    star_rating_ids: '3,4,5',
    children_ages: '4,0,15',
    page_number: '1',
    price_min: '10',
    accommodation_ids: '20,8,15,5,1',
    theme_ids: '14,27,25',
    price_max: '500',
    amenity_ids: '527,2063'
  },
  headers: {
    'X-RapidAPI-Key': '3c30f65b81msh70f4a13bd6bf8ccp1c759ajsnc90fcdc9b0bb',
    'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
  }
});



  