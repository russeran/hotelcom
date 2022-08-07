import ConciergeListItem from "../../components/ListItems/ConciergeListItem";

export default function ConciergeList({ concierges }) {
    return (
        <div className="concierge-list">
            {concierges.map((concierge, index) => (
                <ConciergeListItem key={index} concierge={concierge} index={index} />
            ))}
        </div>
    );
}