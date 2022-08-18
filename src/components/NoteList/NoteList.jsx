import NoteListItem from "../NoteListItem/NoteListItem";
import { Table } from "react-bootstrap";


export default function NoteList({ notes, handleDelete }) {
    return (
        <div className="note-list">
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Note</th>
                </tr>
            </thead>
            {notes.map((note, index) => (
                <NoteListItem key={index} note={note} index={index} handleDelete={handleDelete} />
            ))}
            </Table>
        </div>
    );
} 