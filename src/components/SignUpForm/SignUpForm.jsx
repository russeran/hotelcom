import { Component } from 'react'
import { signUp } from '../../utilities/users-service'
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";

export default class SignUpForm extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirm: '',
        error: ''
    }

    handleChange = (evt) => {
      this.setState({
          [evt.target.name]: evt.target.value,
          error: ''
      })
    }

    handleSubmit = async (evt) => {
      evt.preventDefault();
      try {
        const formData = { ...this.state }
        delete formData.error
        delete formData.confirm
        const user = await signUp(formData)
        this.props.setUser(user)
      } catch (err) {
        console.log(err)
        this.setState({ error: 'Sign Up Failed - Try Again' })
      }
    }

    render() {
        const disable = this.state.password !== this.state.confirm;
        return (
          <Form autoComplete="off" onSubmit={this.handleSubmit} className="auth-form">
            <FormLabel>Name</FormLabel>
            <FormControl type="text" name="name" placeholder="Jordan Rivera" value={this.state.name} onChange={this.handleChange} required />
            <FormLabel>Email</FormLabel>
            <FormControl type="email" name="email" placeholder="you@hotel.com" value={this.state.email} onChange={this.handleChange} required />
            <FormLabel>Password</FormLabel>
            <FormControl type="password" name="password" placeholder="At least 3 characters" value={this.state.password} onChange={this.handleChange} required />
            <FormLabel>Confirm Password</FormLabel>
            <FormControl type="password" name="confirm" placeholder="Re-enter password" value={this.state.confirm} onChange={this.handleChange} required />
            <Button type="submit" variant="primary" disabled={disable}>Create Account</Button>
            <p className="auth-error">{this.state.error}</p>
          </Form>
        );
    }
}
