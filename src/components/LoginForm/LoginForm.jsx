import { useState } from 'react';
import * as usersService from '../../utilities/users-service';
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";
import "./LoginForm.css"

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
    // Prevent Form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method 
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError('Log In Failed - Try Again');
    }
  }

  return (
    <div>
      <br/>
      <div className="login-form">
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <FormLabel>Email</FormLabel>
          <FormControl type="text" name="email" value={credentials.email} onChange={handleChange} required />
          <FormLabel>Password</FormLabel>
          <FormControl type="password" name="password" value={credentials.password} onChange={handleChange} required />
          <br />
          <Button type="submit">LOG IN</Button>
        </Form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
    </div>
  );
}
