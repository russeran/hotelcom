import {useEffect, useState} from 'react';
import ComplaintForm from '../../components/ComplaintForm/ComplaintForm';
import ComplaintList from '../../components/ComplaintList/ComplaintList';
import * as complaintsAPI from '../../utilities/complaints-api';
import './ComplaintPage.css'



export default function ComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    const [change, setChange] = useState(true);
    

    useEffect(function(){
        async function getAllComplaints(){
        let complaint = await complaintsAPI.getAllComplaints();
        setComplaints(complaint);
        }
        getAllComplaints();
    } ,[change] );
    
    async function addComplaint(complaint) {
       const anything = await complaintsAPI.addAComplaint(complaint);
       setComplaints([...complaints, anything]);

    }

    async function handleDelete(complaint) {
        await complaintsAPI.deleteAComplaint(complaint);
        const complaintsCopy = [...complaints];
        const newComplaints = complaintsCopy.filter(complaint => complaint.id === complaint._id);
        setComplaints(newComplaints);
        setChange(!change);
      
    }
    
    async function updateComplaint(complaintId, updateComplaints) {
        const updateComplaint = await complaintsAPI.updateComplaint(complaintId, updateComplaints)
        const newUpdateComplaint = {...updateComplaints}
        const complaintFound = complaints.findIndex(complaint => complaint._id === complaintId)
        const newComplaint = [...complaints]
        newComplaint[complaintFound] = newUpdateComplaint
        setComplaints(newComplaint)
        setChange(!change)
    }
   


    return (
        <div>
            <span className='comp-date' >{new Date().toLocaleString()}</span>
            { complaints && complaints.length > 0 ?
           
           <>
        <div className="complaint-page">
            <br />
            <strong><h1 className='comp-h1' >COMPLAINTS</h1></strong>
            <ComplaintForm addComplaint={addComplaint}  />
        
            <ComplaintList complaints={complaints} handleDelete={handleDelete} updateComplaint={updateComplaint} setComplaints={setComplaints}/>
            </div>
            </>
            :
            <>
             <ComplaintForm addComplaint={addComplaint}  />
            <h1 className='comp-h1'>No Current Complaints</h1>
            <h1 className='comp-h1' > YOU ARE THE BEST </h1>
           
        
            <ComplaintList complaints={complaints} handleDelete={handleDelete} updateComplaint={updateComplaint} setComplaints={setComplaints}/>
            </>
            }  
        </div>
    );
}