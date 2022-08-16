import "./App.css";
import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import TaskPage from "../TaskPage/TaskPage";
import NotePage from "../NotePage/NotePage";
import ConciergePage from "../ConciergePage/ConciergePage";
import ComplaintPage from "../ComplaintPage/ComplaintPage";
import HotelPrices from "../HotelPrices/HotelPrices.jsx";
import Home from "../Home/Home.jsx";
import HotelPage from "../HotelPage/HotelPage";
import { Routes, Route } from "react-router-dom";


export default function App() {
  const [user, setUser] = useState(getUser());
  


  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          
          <Routes>
          <Route path="/complaints" element={<ComplaintPage />}/>
          <Route path="/tasks" element={<TaskPage />}/>
          <Route path="/notes" element={<NotePage/>}/>
            <Route path="/concierge" element={<ConciergePage/>}/>
            <Route path="/hotels" element={<HotelPage />} />
            <Route path="/" element={<Home/>} />
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );

}
