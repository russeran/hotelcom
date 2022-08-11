import ComplaintListItem from "../ComplaintListItem/ComplaintListItem.jsx";
import "./ComplaintList.css"
import {Table} from 'react-bootstrap';

export default function ComplaintList({ complaints}) {
   
    return (
        <div className="complaint-table">
        <Table striped bordered hover>
        <thead>
            <tr>
                <th>Date</th>
                <th>Room</th>
                <th>Guest Name</th>
                <th>Issue</th>
                <th>Solution</th>
                <th>Status</th>
                <th>User</th>
            </tr>
        </thead>
    
            {complaints.map((complaint, index) => (
                <ComplaintListItem key={index} complaint={complaint} index={index} />
            ))}
         </Table>
       </div>
    );
}