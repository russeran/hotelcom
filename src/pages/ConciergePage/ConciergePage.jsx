import {useEffect, useState} from 'react';
import ConciergeForm from '../../components/ConciergeForm/ConciergeForm';
import ConciergeList from '../../components/ConciergeList/ConciergeList';
import * as conciergesAPI from '../../utilities/concierges-api';
import './ConciergePage.css';

export default function ConciergePage() {
    const [concierges, setConcierges] = useState([]);
    const [change, setChange] = useState(true);
    

    useEffect(function(){
        async function getAllConcierges(){
        let users = await conciergesAPI.getAllConcierges();
        setConcierges(users);
        }
        getAllConcierges();
    } ,[change] );
    
    function addConcierge(concierge) {
        conciergesAPI.addAConcierge(concierge);
        setConcierges([...concierges, concierge]);
    }
    
    async function handleDelete(complaint) {
        await conciergesAPI.deleteAConcierge(complaint);
        const conciergeCopy = [...concierges];
        const newConcierge = conciergeCopy.filter(complaint => complaint.id === complaint._id);
        setConcierges(newConcierge);
        setChange(!change);
      
    }

    return (
        <>
        <br></br>
        <br></br>
        <div className="concierge-page">
            <br />
            <strong><h1 className='con-h1' >CONCIERGE</h1></strong>
            <ConciergeForm addConcierge={addConcierge} />
            <ConciergeList concierges={concierges} handleDelete={handleDelete}/>
        </div>
        </>
    );
}