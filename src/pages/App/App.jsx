import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import ComplaintList from "../ComplaintList/ComplaintList.jsx"
import NewComplaintForm from "../../components/Forms/NewComplaintForm.jsx";

export default function App() {
  const [user, setUser] = useState(getUser());
  const [complaints, setComplaints] = useState([]);

  function addComplaint(complaint) {
    setComplaints([...complaints, complaint]);
  }

  return (
    <main className="App">
      {user ? (
        <>

          <NavBar user={user} setUser={setUser} />
          <div className="complaint-section">
          <NewComplaintForm addComplaint={addComplaint} />
        <ComplaintList complaints={complaints} />
        </div>
          <Routes></Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
