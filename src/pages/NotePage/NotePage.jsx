import {useEffect, useState} from 'react';
import NoteForm from '../../components/NoteForm/NoteForm';
import NoteList from '../../components/NoteList/NoteList';
import * as notesAPI from '../../utilities/notes-api';
import './NotePage.css';

export default function NotePage() {
    const [notes, setNotes] = useState([]);

    useEffect(function(){
        async function getAllNotes(){
          let users = await notesAPI.getAllNotes();
          setNotes(users);
      }
      getAllNotes();
      },[] );


      function addNote(note) {
        notesAPI.addANote(note);
        setNotes ([...notes, note])
      }

      return (
        <div className="note-page">
          <br />
            <strong><h2>NOTES</h2></strong>
            <NoteForm addNote={addNote} />
            <NoteList notes={notes} />
        </div>
        );
    }

