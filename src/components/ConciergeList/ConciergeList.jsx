import ConciergeListItem from "../../components/ConciergeListItem/ConciergeListItem.jsx";
import "./ConciergeList.css"

export default function ConciergeList({ concierges, handleDelete }) {
    return (
        <>

       
         
            {concierges.map((concierge, index) => (
                <ConciergeListItem key={concierge._id || index} concierge={concierge} index={index} handleDelete={handleDelete} />
            ))}
    
        </>
    );
}