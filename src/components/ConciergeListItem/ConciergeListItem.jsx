
import "./ConciergeListItem.css"

export default function ConciergeListItem({concierge}){

return (


// change to a CARD not a table

<tbody>
    <tr>
        <td>{concierge.type}</td>
        <td>{concierge.name}</td>
        <td>{concierge.price}</td>
        <td>{concierge.distance}</td>
        <td>{concierge.user}</td>
        <td>{concierge.note}</td>
    </tr>
</tbody>

    

)


}