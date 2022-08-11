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
    <table  id="new-note" >
<thead>
    <tr>
        
        <th className="form-item" >
           <label>Date</label>
           <input type="text" name="date" value={newNote.date} onChange={handleInputChange} required />
        </th>

        <th className="form-item">
           <label>User</label>
            <input type="text" name="user" value={newNote.user} onChange={handleInputChange} required />
        </th>
        <th className="form-item" >
            <label>Note</label>
            <input type="text" name="note" value={newNote.note} onChange={handleInputChange} required /> 

        </th>
       <th>
       <button type="submit" >ADD</button>
       </th>
            
       
</tr>
</thead>
    </table>


</form>
)}