import NoteListItem from "../NoteListItem/NoteListItem";
import { Table } from "react-bootstrap";
import "./NoteList.css"


export default function NoteList({ notes, handleDelete }) {
    return (
        <div>
            <Table className="note-table" striped bordered hover>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Note</th>
                    <th>Actions</th>
                </tr>
            </thead>
            {notes.map((note, index) => (
                <NoteListItem key={note._id || index} note={note} index={index} handleDelete={handleDelete} />
            ))}
            </Table>
        </div>
    );
} 