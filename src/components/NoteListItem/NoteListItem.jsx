import { Button } from "react-bootstrap";
import './NoteListItem.css'

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d) ? value : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoteListItem({ note, handleDelete }) {
    return (
        <tr>
            <td className="text-nowrap">{formatDate(note.date)}</td>
            <td>{note.user}</td>
            <td>{note.note}</td>
            <td className="text-end">
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(note._id)}>Delete</Button>
            </td>
        </tr>
    );
}
