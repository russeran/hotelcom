import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { getUser, refreshUser } from "../../utilities/users-service";
import { connectSocket, disconnectSocket } from "../../utilities/socket";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import TaskPage from "../TaskPage/TaskPage";
import NotePage from "../NotePage/NotePage";
import ConciergePage from "../ConciergePage/ConciergePage";
import ComplaintPage from "../ComplaintPage/ComplaintPage";
import Home from "../Home/Home.jsx";
import HotelPage from "../HotelPage/HotelPage";
import ChatPage from "../ChatPage/ChatPage";
import AdminPage from "../AdminPage/AdminPage";
import RoomsPage from "../RoomsPage/RoomsPage";
import ReservationsPage from "../ReservationsPage/ReservationsPage";
import ReportsPage from "../ReportsPage/ReportsPage";
import SearchPage from "../SearchPage/SearchPage";
import AiConciergePage from "../AiConciergePage/AiConciergePage";
import ProfilePage from "../ProfilePage/ProfilePage";
import GuestProfilesPage from "../GuestProfilesPage/GuestProfilesPage";
import LostAndFoundPage from "../LostAndFoundPage/LostAndFoundPage";
import PackagesPage from "../PackagesPage/PackagesPage";
import RestaurantsPage from "../RestaurantsPage/RestaurantsPage";
import RestaurantReservationsPage from "../RestaurantReservationsPage/RestaurantReservationsPage";
import ToastHost from "../../components/ToastHost/ToastHost";
import { Routes, Route } from "react-router-dom";


export default function App() {
  const [user, setUser] = useState(getUser());

  // Keep the session in sync with the server so admin-made role/department
  // changes take effect without a manual re-login. Refresh on mount, on a
  // timer, and when the tab regains focus.
  const sync = useCallback(async () => {
    if (!getUser()) return;
    const refreshed = await refreshUser();
    setUser(refreshed);
  }, []);

  useEffect(() => {
    sync();
    const interval = setInterval(sync, 30000);
    window.addEventListener('focus', sync);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', sync);
    };
  }, [sync]);

  // Maintain a real-time socket connection while signed in. Keyed on the user
  // id (stable) so the periodic token refresh doesn't churn the connection.
  const userId = user && user._id;
  useEffect(() => {
    if (userId) {
      connectSocket();
      return () => disconnectSocket();
    }
  }, [userId]);

  return (
    <main className="App">
      <ToastHost />
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          <div className="app-content">
            <Routes>
              <Route path="/complaints" element={<ComplaintPage />}/>
              <Route path="/tasks" element={<TaskPage />}/>
              <Route path="/notes" element={<NotePage/>}/>
              <Route path="/concierge" element={<ConciergePage/>}/>
              <Route path="/hotels" element={<HotelPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ai-concierge" element={<AiConciergePage />} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/guest-profiles" element={<GuestProfilesPage />} />
              <Route path="/lost-and-found" element={<LostAndFoundPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/restaurant-management" element={<RestaurantsPage />} />
              <Route path="/restaurant-reservations" element={<RestaurantReservationsPage />} />
              <Route path="/" element={<Home user={user} setUser={setUser} />} />
            </Routes>
          </div>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );

}
