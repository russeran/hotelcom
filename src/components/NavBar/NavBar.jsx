import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";



export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    // Delegate to the users-service
    userService.logOut();
    setUser(null);
  }


  return (
    <nav className="nav-bar">
      <span>Welcome, {user.name}</span>
      &nbsp; | &nbsp;
      <Link to="" onClick={handleLogOut}>
        Log Out
      </Link>
      &nbsp; | &nbsp;
      <Link to="" >Tasks</Link>
      &nbsp; | &nbsp;
      <Link to="/complaints" >Complaints</Link>
      &nbsp; | &nbsp;
      <Link to="">Notes</Link>
      &nbsp; | &nbsp;
      <Link to="/concierge">Concierges</Link>
    </nav>
  );
}
