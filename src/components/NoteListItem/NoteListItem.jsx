import {Button} from "react-bootstrap";
import './NoteListItem.css'    

export default function NoteListItem({ note, handleDelete }) {
    return (
        <tbody>
            <tr>
                <td>{note.date}</td>
                <td>{note.user}</td>
                <td>{note.note}</td>
                <Button  variant="danger"  onClick={()=> handleDelete(note._id)} >DELETE</Button>
            </tr>
        </tbody>
    );
}