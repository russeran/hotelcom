// import { useEffect } from 'react';
// import { useState } from 'react';
// import {Table} from 'react-bootstrap';
// import "./HotelPrices.css"

// export default function HotelPrices({ hotelData}) {
//    const [hotels, setHotels] = useState([]);
//    const [error, setError] = useState(null);
//    const [checkin_date, setCheckin_date] = useState('');
//    const [checkout_date, setCheckout_date] = useState('');


//    const axios = require("axios");

//    const options = {
//      method: 'GET',
//      url: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
//      params: {
//        latitude: '34.0996494',
//        currency: 'USD',
//        longitude: '-118.3334383',
//        checkout_date: `${checkout_date}`,
//        sort_order: 'BEST_SELLER',
//        checkin_date: `${checkin_date}`,
//        adults_number: '1',
//        locale: 'en_US'
//      },
//      headers: {
//        'X-RapidAPI-Key': '3c30f65b81msh70f4a13bd6bf8ccp1c759ajsnc90fcdc9b0bb',
//        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
//      }
//    };
   



// const searchDate = (e) => {
  
//     if (e.key === 'Enter') {
//       console.log("gfk")
//         axios.request(options).then(response => {
//             setHotels(response.data.searchResults.results);
//         }).catch(function (error) {

//             setError(error);
//             ;
//         }).then(() => {
//             setCheckin_date('');
//             setCheckout_date('');
//         }
//         );
//     }
// }



//   return (

// <div>

//   <div className='search'>
//   <label className='search-labels' >CHECK-IN</label>
//       <input
//       value={checkin_date}
//       type="text"
//       placeholder="YYYY-MM-DD"
//       onChange={(e) => setCheckin_date(e.target.value)}
      
//       />
//       <label className='search-labels' >CHECK-OUT</label>
//       <input
//       value={checkout_date}
//       type="text"
//       placeholder="YYYY-MM-DD"
//       onChange={(e) => setCheckout_date(e.target.value)}
//       onKeyPress={searchDate}
//       />


//   </div>
  
//   <br />
//    <Table striped bordered hover className='hotel-table' >
//       <thead className='hotel-thead' >
//           <tr>
//               <th>Name</th>
//               <th>Rate</th>
//               <th>Rooms Left</th>
//               <th>Neighbourhood</th>
//               <th>Rating</th>
//           </tr>
//       </thead>

//     {hotels.map((hotel, index) => {
//     return (
//     <tbody  className='hotel-tbody' key={index} >
//             <tr>
//                 <td>{hotel.name}</td>
//                 <td>{hotel.ratePlan.price.current}</td>
//                 <td>{hotel.roomsLeft}</td>
//                 <td>{hotel.neighbourhood}</td>
//                 <td>{hotel.guestReviews.rating}</td>
//             </tr>
//    </tbody>
//         )

//       })} 
//       </Table>
//    <div/>
// </div>
   
  
//   );
// }

  