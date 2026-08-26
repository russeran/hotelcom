import { useState } from 'react';
import * as usersService from '../../utilities/users-service';
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";

export default function LoginForm({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError('Log In Failed - Try Again');
    }
  }

  return (
    <Form autoComplete="off" onSubmit={handleSubmit} className="auth-form">
      <FormLabel>Email</FormLabel>
      <FormControl type="email" name="email" placeholder="you@hotel.com" value={credentials.email} onChange={handleChange} required />
      <FormLabel>Password</FormLabel>
      <FormControl type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
      <Button type="submit" variant="primary">Log In</Button>
      <p className="auth-error">{error}</p>
    </Form>
  );
}
