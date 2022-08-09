import "./ComplaintListItems.css"
import Table from 'react-bootstrap/Table';


export default function ComplaintListItem({ complaint }) {
    return (
        <Table striped bordered hover className="complaints-table" >
        <tbody>
        <tr>
            <td><button className="table-button" >DATE:</button>{complaint.date}</td>
        </tr>
        <tr>
            <td><button className="table-button" >ROOM:</button>{complaint.room}</td>
            <td><button className="table-button" >NAME:</button>{complaint.name}</td>
        </tr>
        <tr>
            <td><button className="table-button" >ISSUE:</button>{complaint.complaint}</td>
        </tr>
        <tr>
            <td><button className="table-button" >SOLUTION:</button>{complaint.solution}</td>
        </tr>
        <tr>
            <td><button className="table-button" >STATUS:</button>{complaint.status}</td>
            <td><button className="table-button" >USER:</button>{complaint.user}</td>
        </tr>
         </tbody>
    </Table>
    
    );
}