import {useEffect, useState} from 'react';
import ComplaintForm from '../../components/ComplaintForm/ComplaintForm';
import ComplaintList from '../../components/ComplaintList/ComplaintList';
import ComplaintListItem from '../../components/ComplaintListItem/ComplaintListItem';
import * as complaintsAPI from '../../utilities/complaints-api';
import './ComplaintPage.css';


export default function ComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    

    useEffect(function(){
        async function getAllComplaints(){
        let users = await complaintsAPI.getAllComplaints();
        setComplaints(users);
        }
        getAllComplaints();
    } ,[] );
    
    async function addComplaint(complaint) {
       const anything = await complaintsAPI.addAComplaint(complaint);
       setComplaints([...complaints, anything]);

    }

    async function deleteComplaint(delComplaint) {
        await complaintsAPI.deleteAComplaint(delComplaint);
        const complaintsCopy = [...complaints];
        const newComplaints = complaintsCopy.filter(complaint => complaint.id === delComplaint);
        setComplaints(newComplaints);
      
    }
   


    return (
        <div className="complaint-page">
            <br />
            <strong><h2>COMPLAINTS</h2></strong>
            <ComplaintForm addComplaint={addComplaint} deleteComplaint={deleteComplaint} />
            <ComplaintList complaints={complaints} deleteComplaint={deleteComplaint}/>
            
        </div>
    );
}