import {useEffect, useState} from 'react';
import NoteForm from '../../components/NoteForm/NoteForm';
import NoteList from '../../components/NoteList/NoteList';
import * as notesAPI from '../../utilities/notes-api';
import './NotePage.css';

export default function NotePage() {
    const [notes, setNotes] = useState([]);
    const [change, setChange] = useState(true);

    useEffect(function(){
        async function getAllNotes(){
          let users = await notesAPI.getAllNotes();
          setNotes(users);
      }
      getAllNotes();
      },[change] );


      function addNote(note) {
        notesAPI.addANote(note);
        setNotes ([...notes, note])
      }

      async function handleDelete(note) {
        await notesAPI.deleteANote(note);
        const notesCopy = [...notes];
        const newNotes = notesCopy.filter(note => note.id === note._id);
        setNotes(newNotes);
        setChange(!change);
      
    }

      return (
        <>
        <br></br>
        <br></br>
        <strong><h1 id="note-h1" >SHO</h1></strong>
        <NoteForm addNote={addNote} />
        <div className="note-page">
          <br />
            
            
            <NoteList notes={notes} handleDelete={handleDelete}/>
        </div>
        </>
        );
    }

