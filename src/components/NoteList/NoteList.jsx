import NoteListItem from "../NoteListItem/NoteListItem";
import { Table } from "react-bootstrap";


export default function NoteList({ notes }) {
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
                <NoteListItem key={index} note={note} index={index} />
            ))}
            </Table>
        </div>
    );
} 