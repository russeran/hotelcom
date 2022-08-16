import HotelListItem from "../HotelListItem/HotelListItem";
import { Table } from "react-bootstrap";
import "./HoteList.css"

export default function HotelList({ hotels }) {
  return (
    <Table striped hover className="hotel-table" >
     
        <thead className="hotel-thead">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Rooms Left</th>
            <th>Neighbourhood</th>
            <th>Guest Reviews</th>
          </tr>
       </thead>
          {hotels.map((hotel, index) => (
            <HotelListItem key={index} hotel={hotel} index={index} />
          ))}
     
    </Table>
  );
}