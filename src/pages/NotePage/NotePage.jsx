import { useEffect, useState } from 'react';
import NoteForm from '../../components/NoteForm/NoteForm';
import NoteList from '../../components/NoteList/NoteList';
import * as notesAPI from '../../utilities/notes-api';
import './NotePage.css';

export default function NotePage() {
    const [notes, setNotes] = useState([]);

    useEffect(function () {
        async function getAllNotes() {
            let all = await notesAPI.getAllNotes();
            setNotes(all);
        }
        getAllNotes();
    }, []);

    async function addNote(note) {
        const newNote = await notesAPI.addANote(note);
        setNotes([newNote, ...notes]);
    }

    async function handleDelete(noteId) {
        await notesAPI.deleteANote(noteId);
        setNotes(notes.filter(note => note._id !== noteId));
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Shift Handover Notes</h1>
                    <p className="section-subtitle">{notes.length} note{notes.length === 1 ? '' : 's'} logged</p>
                </div>
            </header>

            <div className="surface-card page-card">
                <NoteForm addNote={addNote} />
            </div>

            <div className="surface-card page-card">
                {notes.length === 0 ? (
                    <div className="empty-state">No notes yet. Add the first handover note above.</div>
                ) : (
                    <NoteList notes={notes} handleDelete={handleDelete} />
                )}
            </div>
        </div>
    );
}
