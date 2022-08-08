import ComplaintListItem from "../../components/ComplaintListItem/ComplaintListItem.jsx";
import "../ComplaintList/ComplaintList.css"


export default function ComplaintList({ complaints}) {
   
    return (
       
   <div>
        <thead>
    <tr>
        <th>Date</th>
        <th>Room</th>
        <th>Name</th>
        <th>Issue</th>
        <th>Solution</th>
        <th>Status</th>
        <th>User</th>
    </tr>
</thead>
            {complaints.map((complaint, index) => (
                <ComplaintListItem key={index} complaint={complaint} index={index} />
            ))}
         
       </div>
    );
}