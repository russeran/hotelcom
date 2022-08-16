import ComplaintListItem from "../ComplaintListItem/ComplaintListItem.jsx";
import "./ComplaintList.css"

export default function ComplaintList({ complaints, handleDelete, updateComplaint }) {
   
    return (
        <div className="complaint-table">
      
       
    
            {complaints.map((complaint, index) => (
                <ComplaintListItem key={index} complaint={complaint} index={index} handleDelete={handleDelete} updateComplaint={updateComplaint} />
            ))}
        
       </div>
    );
}