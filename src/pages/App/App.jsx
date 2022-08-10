import "./App.css";
import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import ComplaintList from "../ComplaintList/ComplaintList.jsx"
import ComplaintForm from "../../components/ComplaintForm/ComplaintForm.jsx"
import ConciergeForm from "../../components/ConciergeForm/ConciergeForm.jsx";
import ConciergeList from "../ConciergeList/ConciergeList.jsx";
import NoteForm from "../../components/NoteForm/NoteForm.jsx";
import NoteList from "../../pages/NoteList/NoteList.jsx";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskList from "../../pages/TaskList/TaskList";

export default function App() {
  const [user, setUser] = useState(getUser());
  const [complaints, setComplaints] = useState([]);
  const [concierges, setConcierges] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  function addTask(task) {
    setTasks([...tasks, task]);
  }

  function addConcierge(concierge) {
    setConcierges([...concierges, concierge]);
  }

  function addComplaint(complaint) {
    setComplaints([...complaints, complaint]);
  }

  function addNote(note) {
    setNotes ([...notes, note])
  }

  return (
    <main className="App">
      {user ? (
        <>
        <br />
        <NavBar user={user} setUser={setUser} />
        <br />
        <div className="task-section">
        <br/> 
        <h3>TASK LIST</h3>
        <TaskForm addTask={addTask} />
        <TaskList tasks={tasks} />
        </div>
        <br />
        <div className="complaint-section">
        <br/> 
        <h3>COMPLAINT LIST</h3>
        <ComplaintForm addComplaint={addComplaint} />
        <ComplaintList complaints={complaints} />
        
        </div>
       <br />
        <div className="note-section" >
        <br/> 
        <h3>NOTE LIST</h3>
        <NoteForm addNote={addNote} />
        <NoteList notes={notes} />
       
        </div>
       <br />
        <div className="concierge-section" >
        <br/>
        <h3>CONCIERGE LIST</h3>
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
