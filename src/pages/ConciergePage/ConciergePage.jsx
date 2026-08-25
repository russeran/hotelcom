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
    
    async function addConcierge(concierge) {
        const newConcierge = await conciergesAPI.addAConcierge(concierge);
        setConcierges([...concierges, newConcierge]);
    }
    
    async function handleDelete(conciergeId) {
        await conciergesAPI.deleteAConcierge(conciergeId);
        setConcierges(concierges.filter(concierge => concierge._id !== conciergeId));
        setChange(!change);
      
    }

    return (
        <>
        <br></br>
        <br></br>
        <strong><h1 className='con-h1' >CONCIERGE</h1></strong>
        <div className="concierge-page">
            <br />
            
            <ConciergeForm addConcierge={addConcierge} />
            <ConciergeList concierges={concierges} handleDelete={handleDelete}/>
        </div>
        </>
    );
}