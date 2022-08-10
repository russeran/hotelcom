import ComplaintListItem from "../../components/ComplaintListItem/ComplaintListItem.jsx";
import "../ComplaintList/ComplaintList.css"
import {Table} from 'react-bootstrap';

export default function ComplaintList({ complaints}) {
   
    return (
        <div complaint-table>
        <Table striped bordered hover>
        <thead>
            <tr>
                <th>Status</th>
                <th>Date</th>
                <th>Department</th>
                <th>Room</th>
                <th>User</th>
                <th>Task</th>
            </tr>
        </thead>
    
            {complaints.map((complaint, index) => (
                <ComplaintListItem key={index} complaint={complaint} index={index} />
            ))}
         </Table>
       </div>
    );
}