import { useEffect, useState, useCallback } from "react";
import * as userService from "../../utilities/users-service";
import { isAdmin } from "../../utilities/users-service";
import * as notificationsAPI from "../../utilities/notifications-api";
import { Navbar, Nav, NavDropdown, Container, Badge, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import './NavBar.css';


export default function NavBar({ user, setUser }) {
  const [notifications, setNotifications] = useState([]);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsAPI.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      console.log('Failed to load notifications', err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  async function handleMarkRead(notificationId) {
    await notificationsAPI.markNotificationRead(notificationId);
    setNotifications(notifications.map(n => (n._id === notificationId ? { ...n, read: true } : n)));
  }

  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  const initials = (user.name || '?')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Navbar className="app-navbar" expand="lg" sticky="top">
      <Container fluid className="app-navbar-inner">
        <Navbar.Brand as={NavLink} to="/" className="brand">
          <span className="brand-mark">MS</span>
          <span className="brand-text">Mama Shelter <span className="brand-accent">LA</span></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto main-links">
            <Nav.Link as={NavLink} to="/" end>Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/reservations">Reservations</Nav.Link>
            <Nav.Link as={NavLink} to="/rooms">Rooms</Nav.Link>
            <Nav.Link as={NavLink} to="/tasks">Tasks</Nav.Link>
            <Nav.Link as={NavLink} to="/complaints">Complaints</Nav.Link>
            <Nav.Link as={NavLink} to="/notes">Notes</Nav.Link>
            <Nav.Link as={NavLink} to="/concierge">Concierge</Nav.Link>
            <Nav.Link as={NavLink} to="/chat">Chat</Nav.Link>
            <Nav.Link as={NavLink} to="/hotels">Hotels</Nav.Link>
            {isAdmin(user) && <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>}
          </Nav>

          <div className="nav-right">
            <span className="nav-clock">{clock}</span>

            <NavDropdown
              id="notifications-nav-dropdown"
              align="end"
              className="notif-dropdown"
              title={
                <span className="notif-toggle" title="Notifications">
                  <span className="notif-bell">🔔</span>
                  {unreadCount > 0 && <Badge bg="danger" className="notif-badge">{unreadCount}</Badge>}
                </span>
              }
            >
              <div className="notif-header">Notifications</div>
              {notifications.length === 0 ? (
                <NavDropdown.Item disabled>No notifications</NavDropdown.Item>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <NavDropdown.ItemText key={n._id} className="notification-item">
                    <div className={`notif-msg ${n.read ? '' : 'unread'}`}>{n.message}</div>
                    {!n.read && (
                      <Button size="sm" variant="link" className="p-0 notif-mark" onClick={() => handleMarkRead(n._id)}>
                        Mark read
                      </Button>
                    )}
                  </NavDropdown.ItemText>
                ))
              )}
            </NavDropdown>

            <NavDropdown
              align="end"
              className="user-dropdown"
              title={
                <span className="user-chip">
                  {user.avatar ? (
                    <Image src={user.avatar} roundedCircle width={30} height={30} alt="avatar" className="user-avatar" />
                  ) : (
                    <span className="user-initials">{initials}</span>
                  )}
                  <span className="user-name">{user.name}</span>
                </span>
              }
            >
              <div className="user-menu-meta">
                <span className={`role-badge role-${user.role || 'staff'}`}>{user.role || 'staff'}</span>
                {user.department && <span className="user-dept">{user.department}</span>}
              </div>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="/">Profile & Dashboard</NavDropdown.Item>
              {isAdmin(user) && <NavDropdown.Item as={NavLink} to="/admin">User Management</NavDropdown.Item>}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
