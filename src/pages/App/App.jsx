import "./App.css";
import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import Weather from "../Weather/Weather";
import TaskPage from "../TaskPage/TaskPage";
import NotePage from "../NotePage/NotePage";
import ConciergePage from "../ConciergePage/ConciergePage";
import ComplaintPage from "../ComplaintPage/ComplaintPage";
import HotelPrices from "../HotelPrices/HotelPrices";


export default function App() {
  const [user, setUser] = useState(getUser());
  


  return (
    <main className="App">
      {user ? (
        <>
        <br />
        <NavBar user={user} setUser={setUser} />
        <br />
        
        <Weather />
        <br />
        <TaskPage />
        <br />
        <ComplaintPage />
        <br />
        <NotePage/>
        <br />
        <ConciergePage/>
        <br />
        <HotelPrices/>

        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
