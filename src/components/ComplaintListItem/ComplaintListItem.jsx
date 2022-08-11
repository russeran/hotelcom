import "./ComplaintListItems.css"



export default function ComplaintListItem({ complaint }) {
    return (
 
     <tbody>
     <tr>
         <td>{complaint.date}</td>
         <td>{complaint.room}</td>
         <td>{complaint.name}</td>
         <td>{complaint.issue}</td>
         <td>{complaint.solution}</td>
         <td>{complaint.status}</td>
            <td>{complaint.user}</td>
     </tr>
 </tbody>
    );
}