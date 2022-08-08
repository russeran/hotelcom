import ConciergeListItem from "../../components/ConciergeListItem/ConciergeListItem.jsx";

export default function ConciergeList({ concierges }) {
    return (
        <div className="concierge-list">


<thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Price</th>
        <th>Distance</th>
        <th>User</th>
        <th>Note</th>
    </tr>
</thead>
            {concierges.map((concierge, index) => (
                <ConciergeListItem key={index} concierge={concierge} index={index} />
            ))}
        </div>
    );
}