import "./ListItems.css";
import Table from 'react-bootstrap/Table';


export default function ComplaintListItem({ complaint }) {
    return (
       <Table striped bordered hover  className="complaints-table" >

            <thead>
                <tr>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Room #</th>
                    <th>Guest Name</th>
                    <th>Complaint</th>
                    <th>Solution</th>
                    <th>Agent Name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{complaint.status}</td>
                    <td>{complaint.date}</td>
                    <td>{complaint.room}</td>
                    <td>{complaint.name}</td>
                    <td>{complaint.complaint}</td>
                    <td>{complaint.solution}</td>
                    <td>{complaint.user}</td>
                </tr>   
            </tbody>
       </Table>
    );
}