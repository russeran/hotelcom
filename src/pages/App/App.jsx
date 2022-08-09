import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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

          <NavBar user={user} setUser={setUser} />

          <hr />
        <div className="task-section">
          <TaskForm  addTask={addTask}  />
          <TaskList tasks={tasks} />
        </div>
        <hr />
          <div className="complaint-section">
          <ComplaintForm addComplaint={addComplaint} />
        <ComplaintList complaints={complaints} />
        </div>
<hr />
        <div className="note-section">
          <NoteForm  addNote={addNote}  />
          <NoteList notes={notes} />
        </div>
<hr />
        <div className="concierge-section">
          <ConciergeForm  addConcierge={addConcierge}  />
          <ConciergeList concierges={concierges} />
        </div>
        
          <Routes></Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
