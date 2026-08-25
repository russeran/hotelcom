
import { useEffect, useState, useCallback } from "react";
import * as userService from "../../utilities/users-service";
import * as notificationsAPI from "../../utilities/notifications-api";
import { Navbar, Nav, NavDropdown, Container, Badge, Button, Image } from "react-bootstrap";
import './NavBar.css';



export default function NavBar({ user, setUser }) {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsAPI.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      // Non-fatal: leave notifications empty if the request fails.
      console.log('Failed to load notifications', err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    // Poll periodically so notifications from other users/actions show up.
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  async function handleMarkRead(notificationId) {
    await notificationsAPI.markNotificationRead(notificationId);
    setNotifications(notifications.map(n => (n._id === notificationId ? { ...n, read: true } : n)));
  }

  function handleLogOut() {
    // Delegate to the users-service
    userService.logOut();
    setUser(null);
  }


  return (
    <Navbar className="navbar"  expand="lg">
      <Container>
        <Navbar.Brand className="mama-name" href="/">MAMA SHELTER LA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link target="_blank" href="https://all.accor.com/hotel/9919/index.en.shtml?partner_id=mamashelter">Book A Room</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="/hotels">Other Hotels</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="/chat">Chat</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <NavDropdown title="FRONT DESK" id="basic-nav-dropdown">
              <NavDropdown.Item href="/complaints">Complaints</NavDropdown.Item>
              <NavDropdown.Item href="/notes">
                SHO
              </NavDropdown.Item>
              <NavDropdown.Item href="/tasks">Tasks</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/concierge">
                Concierge
              </NavDropdown.Item>
            </NavDropdown>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <NavDropdown
              id="notifications-nav-dropdown"
              title={
                <span>
                  Notifications{' '}
                  {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
                </span>
              }
              align="end"
            >
              {notifications.length === 0 ? (
                <NavDropdown.Item disabled>No notifications</NavDropdown.Item>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <NavDropdown.ItemText key={n._id} className="notification-item">
                    <div style={{ fontWeight: n.read ? 'normal' : 'bold', maxWidth: '320px' }}>
                      {n.message}
                    </div>
                    {!n.read && (
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0"
                        onClick={() => handleMarkRead(n._id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </NavDropdown.ItemText>
                ))
              )}
            </NavDropdown>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            <Nav.Link href="/" onClick={handleLogOut} >Log Out</Nav.Link>
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;
            {user.avatar && (
              <Image src={user.avatar} roundedCircle width={32} height={32} alt="avatar" style={{ objectFit: 'cover' }} />
            )}
            &nbsp;
            <h5 className="user-welcome" >Welcome, {user.name}</h5>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
