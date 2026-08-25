import { useEffect, useState } from 'react';
import ConciergeForm from '../../components/ConciergeForm/ConciergeForm';
import ConciergeList from '../../components/ConciergeList/ConciergeList';
import * as conciergesAPI from '../../utilities/concierges-api';
import './ConciergePage.css';

export default function ConciergePage() {
    const [concierges, setConcierges] = useState([]);

    useEffect(function () {
        async function getAllConcierges() {
            let all = await conciergesAPI.getAllConcierges();
            setConcierges(all);
        }
        getAllConcierges();
    }, []);

    async function addConcierge(concierge) {
        const created = await conciergesAPI.addAConcierge(concierge);
        setConcierges([created, ...concierges]);
    }

    async function handleDelete(conciergeId) {
        await conciergesAPI.deleteAConcierge(conciergeId);
        setConcierges(concierges.filter(concierge => concierge._id !== conciergeId));
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Concierge</h1>
                    <p className="section-subtitle">{concierges.length} local recommendation{concierges.length === 1 ? '' : 's'}</p>
                </div>
            </header>

            <div className="surface-card page-card">
                <ConciergeForm addConcierge={addConcierge} />
            </div>

            {concierges.length === 0 ? (
                <div className="surface-card page-card empty-state">No concierge offerings yet. Add one above.</div>
            ) : (
                <ConciergeList concierges={concierges} handleDelete={handleDelete} />
            )}
        </div>
    );
}
