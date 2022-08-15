import "./ComplaintListItems.css"
import { useEffect ,useState } from "react";
import * as complaintsAPI from '../../utilities/complaints-api';
import ComplaintUpdate from "../ComplaintUpdate/ComplaintUpdate";


export default function ComplaintListItem({ complaint, handleDelete, updateComplaint }) {
    const [complaints, setComplaints] = useState([]);
  
    useEffect(function(){
        async function getAllComplaints(){
        let users = await complaintsAPI.getAllComplaints();
        setComplaints(users);
        }
        getAllComplaints();
    } ,[] );



 

    return (

 <>
     <tbody>
     <tr>
         <td>{complaint.date}</td>
         <td>{complaint.room}</td>
         <td>{complaint.name}</td>
         <td>{complaint.issue}</td>
         <td>{complaint.solution}</td>
         <td>{complaint.status}</td>
         <td>{complaint.user}</td>
         <td><button onClick={()=> handleDelete(complaint._id)} >X</button></td>
              
     </tr>
    
     
 </tbody>
 
 </>
    );
}