import ConciergeListItem from "../../components/ConciergeListItem/ConciergeListItem.jsx";
import "./ConciergeList.css"

export default function ConciergeList({ concierges, handleDelete }) {
    return (
        <div className="concierge-grid">
            {concierges.map((concierge, index) => (
                <ConciergeListItem key={concierge._id || index} concierge={concierge} handleDelete={handleDelete} />
            ))}
        </div>
    );
}
