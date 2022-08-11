import "./App.css";
import { useEffect, useState } from "react";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import ComplaintList from "../../components/ComplaintList/ComplaintList.jsx"
import ComplaintForm from "../../components/ComplaintForm/ComplaintForm.jsx"
import ConciergeForm from "../../components/ConciergeForm/ConciergeForm.jsx";
import ConciergeList from "../../components/ConciergeList/ConciergeList.jsx";
import NoteForm from "../../components/NoteForm/NoteForm.jsx";
import NoteList from "../../components/NoteList/NoteList.jsx";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskList from "../../components/TaskList/TaskList";
import * as complaintsAPI from "../../utilities/complaints-api";
import * as conciergesAPI from "../../utilities/concierges-api";
import * as notesAPI from "../../utilities/notes-api";
import * as tasksAPI from "../../utilities/tasks-api";

import Weather from "../Weather/Weather";




export default function App() {
  const [user, setUser] = useState(getUser());
  const [complaints, setComplaints] = useState([]);
  const [concierges, setConcierges] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);



useEffect(function(){
  async function getAllComplaint(){
    let users = await complaintsAPI.getAllComplaints();
    setComplaints(users);
}
getAllComplaint();
},[] );

useEffect(function(){
  async function getAllConcierge(){
    let users = await conciergesAPI.getAllConcierges();
    setConcierges(users);
}
getAllConcierge();
},[] );

useEffect(function(){
  async function getAllNotes(){
    let users = await notesAPI.getAllNotes();
    setNotes(users);
}
getAllNotes();
},[] );

useEffect(function(){
  async function getAllTasks(){
    let users = await tasksAPI.getAllTasks();
    setTasks(users);
}
getAllTasks();
},[] );
  


  function addTask(task) {
    tasksAPI.addATask(task);
    setTasks([...tasks, task]);

  }

  function addConcierge(concierge) {
    conciergesAPI.addAConcierge(concierge);
    setConcierges([...concierges, concierge]);
  }

  function addComplaint(complaint) {
    complaintsAPI.addAComplaint(complaint);
    setComplaints([...complaints, complaint]);

  }

  function addNote(note) {
    notesAPI.addANote(note);
    setNotes ([...notes, note])
  }

  return (
    <main className="App">
      {user ? (
        <>
        <br />
        <NavBar user={user} setUser={setUser} />
        <br />
        <div className="weather-section">
        <h2>WEATHER</h2>
        <Weather />
         </div>

        <div className="task-section">
        <br/> 
        <h2>TASK LIST</h2>
        <TaskForm addTask={addTask} />
        <TaskList tasks={tasks} />
        </div>
        <br />

        <div className="complaint-section">
        <br/> 
        <h2>COMPLAINT LIST</h2>
        <ComplaintForm addComplaint={addComplaint} />
        <ComplaintList complaints={complaints} />
        </div>
       <br />

        <div className="note-section" >
        <br/> 
        <h2>NOTE LIST</h2>
        <NoteForm addNote={addNote} />
        <NoteList notes={notes} />
        </div>
       <br />

        <div className="concierge-section" >
        <br/>
        <h2>CONCIERGE LIST</h2>
        <ConciergeForm addConcierge={addConcierge} />
        <ConciergeList concierges={concierges} /> 
        </div>
      
    
        
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
