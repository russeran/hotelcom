 
  
  export default function HotelListItem({hotel, index}) {

    return (
<>
        
            <tbody  className='hotel-tbody'  >
                    <tr>
                        <td>{hotel.name}</td>
                        <td>{hotel.ratePlan.price.current}</td>
                        <td>{hotel.roomsLeft}</td>
                        <td>{hotel.neighbourhood}</td>
                        <td>{hotel.guestReviews.rating}</td>
                    </tr>
           </tbody>

</>
              
    )}

