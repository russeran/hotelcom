import "./NoteForm.css";
import {useState} from 'react';


export default function NoteForm ({
    addNote}) 
{
    const [newNote, setNewNote] =
    useState({
        date: '',
        user: '',
        note:'',
    })


function handleAddNote(e){
    e.preventDefault();
    addNote(newNote);
    setNewNote({
        date:'',
        user:'',
        note:'',
    })
}

function handleInputChange(e) {
    const addNewNote = {...newNote, 
        [e.target.name]:e.target.value};
        setNewNote(addNewNote)
}


return (
 <form onSubmit={handleAddNote}>
    <div className="form-container" id="new-note" >
         <h3>ADD NOTE</h3>
        <div className="form-item" >
           <label>Date</label>
           <input type="text" name="date" value={newNote.date} onChange={handleInputChange} required />
        </div>

        <div className="form-item">
           <label>User</label>
            <input type="text" name="user" value={newNote.user} onChange={handleInputChange} required />
        </div>
        <div className="form-item" >
            <label>Note</label>
            <input type="text" name="note" value={newNote.note} onChange={handleInputChange} required /> 

        </div>
        <br />
        <div className="form-item" >
            <button type="submit" >ADD</button>
        </div>

    </div>


</form>
)}