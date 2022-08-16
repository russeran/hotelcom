import {useEffect, useState} from 'react';
import ConciergeForm from '../../components/ConciergeForm/ConciergeForm';
import ConciergeList from '../../components/ConciergeList/ConciergeList';
import * as conciergesAPI from '../../utilities/concierges-api';
import './ConciergePage.css';

export default function ConciergePage() {
    const [concierges, setConcierges] = useState([]);
    
    useEffect(function(){
        async function getAllConcierges(){
        let users = await conciergesAPI.getAllConcierges();
        setConcierges(users);
        }
        getAllConcierges();
    } ,[] );
    
    function addConcierge(concierge) {
        conciergesAPI.addAConcierge(concierge);
        setConcierges([...concierges, concierge]);
    }
    
    return (
        <div className="concierge-page">
            <br />
            <strong><h1 className='comp-h1' >CONCIERGE</h1></strong>
            <ConciergeForm addConcierge={addConcierge} />
            <ConciergeList concierges={concierges} />
        </div>
    );
}