import { useEffect, useState, useCallback } from "react";
import * as userService from "../../utilities/users-service";
import { isAdmin, canManage } from "../../utilities/users-service";
import { onSocket } from "../../utilities/socket";
import * as notificationsAPI from "../../utilities/notifications-api";
import { Navbar, Nav, NavDropdown, Container, Badge, Button, Image, Form } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import './NavBar.css';


export default function NavBar({ user, setUser }) {
  const [notifications, setNotifications] = useState([]);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

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
    // Real-time: refresh the (server-scoped) feed the moment a notification is
    // created. A slow interval remains as a resilience fallback.
    const off = onSocket('notification:new', loadNotifications);
    const interval = setInterval(loadNotifications, 60000);
    return () => { off(); clearInterval(interval); };
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

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar className="app-navbar" expand="lg" sticky="top" expanded={expanded} onToggle={setExpanded}>
      <Container fluid className="app-navbar-inner">
        <Navbar.Brand as={NavLink} to="/" className="brand" onClick={closeNavbar}>
          <span className="brand-mark">MS</span>
          <span className="brand-text">Mama Shelter <span className="brand-accent">LA</span></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto main-links">
            <Nav.Link as={NavLink} to="/" end onClick={closeNavbar}>Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/reservations" onClick={closeNavbar}>Reservations</Nav.Link>
            <Nav.Link as={NavLink} to="/rooms" onClick={closeNavbar}>Rooms</Nav.Link>
            <Nav.Link as={NavLink} to="/tasks" onClick={closeNavbar}>Tasks</Nav.Link>
            <Nav.Link as={NavLink} to="/complaints" onClick={closeNavbar}>Complaints</Nav.Link>
            <Nav.Link as={NavLink} to="/notes" onClick={closeNavbar}>Notes</Nav.Link>
            <Nav.Link as={NavLink} to="/concierge" onClick={closeNavbar}>Concierge</Nav.Link>
            <Nav.Link as={NavLink} to="/chat" onClick={closeNavbar}>Chat</Nav.Link>
            <Nav.Link as={NavLink} to="/hotels" onClick={closeNavbar}>Hotels</Nav.Link>
            <Nav.Link as={NavLink} to="/guest-profiles" onClick={closeNavbar}>Guest Profiles</Nav.Link>
            <Nav.Link as={NavLink} to="/lost-and-found" onClick={closeNavbar}>Lost & Found</Nav.Link>
            <Nav.Link as={NavLink} to="/packages" onClick={closeNavbar}>Packages</Nav.Link>
            <Nav.Link as={NavLink} to="/restaurant-management" onClick={closeNavbar}>Restaurants</Nav.Link>
            <Nav.Link as={NavLink} to="/restaurant-reservations" onClick={closeNavbar}>Dining</Nav.Link>
            <Nav.Link as={NavLink} to="/waitlist" onClick={closeNavbar}>Waitlist</Nav.Link>
            {canManage(user) && <Nav.Link as={NavLink} to="/reports" onClick={closeNavbar}>Reports</Nav.Link>}
            {isAdmin(user) && <Nav.Link as={NavLink} to="/admin" onClick={closeNavbar}>Admin</Nav.Link>}
          </Nav>

          <div className="nav-right">
            <Form className="nav-search" role="search" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                size="sm"
                placeholder="Search…"
                aria-label="Search across the app"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
            <span className="nav-clock" aria-hidden="true">{clock}</span>

            <NavDropdown
              id="notifications-nav-dropdown"
              align="end"
              className="notif-dropdown"
              title={
                <span className="notif-toggle" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
                  <span className="notif-bell" aria-hidden="true">🔔</span>
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
                    <Image src={user.avatar} roundedCircle width={32} height={32} alt="avatar" className="user-avatar" />
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
              <NavDropdown.Item as={NavLink} to="/" onClick={closeNavbar}>Dashboard</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/profile" onClick={closeNavbar}>Edit Profile Photo</NavDropdown.Item>
              {isAdmin(user) && <NavDropdown.Item as={NavLink} to="/admin" onClick={closeNavbar}>User Management</NavDropdown.Item>}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => { handleLogOut(); closeNavbar(); }}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
