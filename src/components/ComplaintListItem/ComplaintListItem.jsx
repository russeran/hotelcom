import "./ComplaintListItems.css"
import { useEffect ,useState } from "react";
import * as complaintsAPI from '../../utilities/complaints-api';


export default function ComplaintListItem({ complaint, handleDeleteComplaint, handleUpdateComplaint }) {
    const [complaints, setComplaints] = useState([]);
  
    useEffect(function(){
        async function getAllComplaints(){
        let users = await complaintsAPI.getAllComplaints();
        setComplaints(users);
        }
        getAllComplaints();
    } ,[] );

    async function handleDeleteComplaint(evt) {
        evt.preventDefault();
        await complaintsAPI.deleteAComplaint(complaint._id);
        setComplaints([...complaints, complaint]);
      
    }

 

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
            <td><form  onSubmit={handleDeleteComplaint} ><button type="submit" >X</button></form>
                  </td>
                  
     </tr>
 </tbody>
    );
}