import "./ComplaintListItems.css"
import Table from 'react-bootstrap/Table';


export default function ComplaintListItem({ complaint }) {
    return (
        <tbody>
        <tr>
            <td>{complaint.name}</td>
            <td>{complaint.type}</td>
            <td>{complaint.price}</td>
            <td>{complaint.distance}</td>
            <td>{complaint.user}</td>
            <td>{complaint.note}</td>
        </tr>
    </tbody>
    
    );
}