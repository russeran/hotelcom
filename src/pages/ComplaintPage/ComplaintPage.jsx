import {useEffect, useState} from 'react';
import ComplaintForm from '../../components/ComplaintForm/ComplaintForm';
import ComplaintList from '../../components/ComplaintList/ComplaintList';
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
    
    function addComplaint(complaint) {
        complaintsAPI.addAComplaint(complaint);
        setComplaints([...complaints, complaint]);

    }

   


    return (
        <div className="complaint-page">
            <br />
            <strong><h2>COMPLAINTS</h2></strong>
            <ComplaintForm addComplaint={addComplaint}  />
            <ComplaintList complaints={complaints} />
        </div>
    );
}