import './NoteListItem.css'    

export default function NoteListItem({ note }) {
    return (
        <tbody>
            <tr>
                <td>{note.date}</td>
                <td>{note.user}</td>
                <td>{note.note}</td>
            </tr>
        </tbody>
    );
}