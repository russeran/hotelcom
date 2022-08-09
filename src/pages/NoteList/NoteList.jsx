import NoteListItem from "../../components/NoteListItem/NoteListItem";

export default function NoteList({ notes }) {
    return (
        <div className="note-list">
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
        </div>
    );
} 