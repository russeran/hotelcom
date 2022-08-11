import "./App.css";
import { useEffect, useState } from "react";
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
import * as complaintsAPI from "../../utilities/complaints-api";
import HotelPrice from "../../pages/HotelPrices/HotelPrices";
import axios from "axios";
import Weather from "../Weather/Weather";


export default function App() {
  const [user, setUser] = useState(getUser());
  const [complaints, setComplaints] = useState([]);
  const [concierges, setConcierges] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [hotels, setHotels] = useState([]);

  

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await HotelPrice.get("/hotels");
        setHotels(response.data);

      } catch (error) {
        if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log("Error", error.message);
      }
    }
  }
  fetchHotels();
}, []);



useEffect(function(){
  async function getAllComplaint(){
    let users = await complaintsAPI.getAllComplaints();
    setComplaints(users);
}
getAllComplaint();
}, );



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
