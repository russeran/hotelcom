import ComplaintListItem from "../../components/ComplaintListItem/ComplaintListItem.jsx";
import "../ComplaintList/ComplaintList.css"
import { Table } from "react-bootstrap";

export default function ComplaintList({ complaints}) {
   
    return (
       
   <div>
    
            {complaints.map((complaint, index) => (
                <ComplaintListItem key={index} complaint={complaint} index={index} />
            ))}
         
       </div>
    );
}