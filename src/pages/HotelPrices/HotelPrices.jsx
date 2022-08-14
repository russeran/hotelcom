import Data from './data.json';

export default function HotelPrices() {
var index = 0;
  return (

    <div className="hotel-prices">
      
      
          {Data.map((hotel, index) => {
            
            return (
            <div key={index}>
              <h2>{hotel.searchResults.results[index].name}</h2>
              <h3>{hotel.searchResults.results[index].ratePlan.price.current}</h3>
            </div>
            )
            {var index = index +1;}
          }
          )}

        </div>
       
     



//     <div className="hotel-prices">
//       <div className='prices'>
// {Data.map(hotel => {
//   return (
//     <div key={hotel.searchResults.results[1].id}>
//       <h1>{hotel.searchResults.results[2].name}</h1>
//       <h2>{hotel.searchResults.results[2].ratePlan.price.current}</h2>
//     </div>
//   )
// })}

//       </div>

//       </div>

  )
}

