
import * as userService from "../../utilities/users-service";
import { Navbar, Nav, NavDropdown, Container  } from "react-bootstrap";
import './NavBar.css';



export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    // Delegate to the users-service
    userService.logOut();
    setUser(null);
  }


  return (
    <Navbar className="navbar"  expand="lg">
      <Container>
        <Navbar.Brand className="mama-name" href="#home">MAMA SHELTER LA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="#home">Home</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="https://all.accor.com/hotel/9919/index.en.shtml?partner_id=mamashelter">Book A Room</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="#home">Other Hotels</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <NavDropdown title="MENU" id="basic-nav-dropdown">
              <NavDropdown.Item href="/complaints">Complaints</NavDropdown.Item>
              <NavDropdown.Item href="/notes">
                Notes
              </NavDropdown.Item>
              <NavDropdown.Item href="/tasks">Tasks</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/concierge">
                Concierge
              </NavDropdown.Item>
            </NavDropdown>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="/" onClick={handleLogOut} >Log Out</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <h5 className="user-welcome" >Welcome, {user.name}</h5>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  // (
  //   <nav className="nav-bar">
  //     <span>Welcome, {user.name}</span>
  //     &nbsp; | &nbsp;
  //     <Link to="" onClick={handleLogOut}>
  //       Log Out
  //     </Link>
  //     &nbsp; | &nbsp;
  //     <Link to="" >Tasks</Link>
  //     &nbsp; | &nbsp;
  //     <Link to="/complaints" >Complaints</Link>
  //     &nbsp; | &nbsp;
  //     <Link to="">Notes</Link>
  //     &nbsp; | &nbsp;
  //     <Link to="/concierge">Concierges</Link>
  //   </nav>
  // );
}
