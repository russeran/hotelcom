import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import ComplaintList from "../ComplaintList/ComplaintList.jsx"
import NewComplaintForm from "../../components/Forms/NewComplaintForm.jsx";
import NewConciergeForm from "../../components/Forms/NewConciergeForm";
import ConciergeList from "../ConciergeList/ConciergeList";

export default function App() {
  const [user, setUser] = useState(getUser());
  const [complaints, setComplaints] = useState([]);
  const [concierges, setConcierges] = useState([]);

  function addConcierge(concierge) {
    setConcierges([...concierges, concierge]);
  }

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
<hr />
        <div>
          <NewConciergeForm  addConcierge={addConcierge}  />
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
