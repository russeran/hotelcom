import NoteListItem from "../NoteListItem/NoteListItem";
import { Table } from "react-bootstrap";
import "./NoteList.css"


export default function NoteList({ notes, handleDelete }) {
    return (
        <Table hover responsive className="align-middle mb-0 note-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Author</th>
                    <th>Note</th>
                    <th className="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                {notes.map((note, index) => (
                    <NoteListItem key={note._id || index} note={note} handleDelete={handleDelete} />
                ))}
            </tbody>
        </Table>
    );
}
