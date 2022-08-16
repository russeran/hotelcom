import ConciergeListItem from "../../components/ConciergeListItem/ConciergeListItem.jsx";
import { Table } from "react-bootstrap";
import "./ConciergeList.css"

export default function ConciergeList({ concierges }) {
    return (
        <div className="concierge-list">

        <Table striped bordered hover>
           <thead>
             <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Price</th>
                <th>Trip</th>
                <th>User</th>
                <th>Note</th>
            </tr>
           </thead>
            {concierges.map((concierge, index) => (
                <ConciergeListItem key={index} concierge={concierge} index={index} />
            ))}
            </Table>
        </div>
    );
}