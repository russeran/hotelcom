
import "./ListItems.css"

export default function ConciergeListItem({concierge}){

return (

<table>
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
<tbody>
    <tr>
        <td>{concierge.name}</td>
        <td>{concierge.type}</td>
        <td>{concierge.price}</td>
        <td>{concierge.distance}</td>
        <td>{concierge.user}</td>
        <td>{concierge.note}</td>
    </tr>
</tbody>

    
</table>
)


}