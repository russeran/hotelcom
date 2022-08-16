import { Component} from 'react'
import { signUp } from '../../utilities/users-service'
import './SignUpForm.css'
import { Form, FormControl, FormLabel, Table, Button } from "react-bootstrap";

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
        // We don't want to send the 'error' or 'confirm' property,
        //  so let's make a copy of the state object, then delete them
        const formData = {...this.state}
        delete formData.error
        delete formData.confirm
        // The promise returned by the signUp service method 
        // will resolve to the user object included in the
        // payload of the JSON Web Token (JWT)
        const user = await signUp(formData)
        this.props.setUser(user)
      } catch(err) {
        // An error occurred
        console.log(err)
        this.setState({error: 'Sign Up Failed - Try Again'})
      }
    }

    render() {
        const disable = this.state.password !== this.state.confirm;
        return (
          
          <div>
            <div className="form-container">
              <Form autoComplete="off" onSubmit={this.handleSubmit}>
                <FormLabel>Name</FormLabel>
                <FormControl type="text" name="name" value={this.state.name} onChange={this.handleChange} required />
                <br /><FormLabel>Email</FormLabel>
                <FormControl type="email" name="email" value={this.state.email} onChange={this.handleChange} required />
                <br /><FormLabel>Password</FormLabel>
                <FormControl type="password" name="password" value={this.state.password} onChange={this.handleChange} required />
                <br /><FormLabel>Confirm</FormLabel>
                <FormControl type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} required />
                <br /><Button type="submit" disabled={disable}>SIGN UP</Button>
              </Form>
            </div>
            <p className="error-message">&nbsp;{this.state.error}</p>
          </div>
         
        );
    }
      
}

// export default function SignUpForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirm: '',
//     error: ''
//   })
//   const disable = formData.password !== formData.confirm;

//   function handleChange(evt) {
//     setFormData({
//       ...formData,
//       [evt.target.name]: evt.target.value,
//       error: ''
//     })
//   }

//   function handleSubmit(evt) {
//     evt.preventDefault();
//     alert(JSON.stringify(formData));
//   }


//   return (
//     <div>
//       <div className="form-container">
//         <form autoComplete="off" onSubmit={handleSubmit}>
//           <FormLabel>Name</FormLabel>
//           <FormControl type="text" name="name" value={formData.name} onChange={handleChange} required />
//           <FormLabel>Email</FormLabel>
//           <FormControl type="email" name="email" value={formData.email} onChange={handleChange} required />
//           <FormLabel>Password</FormLabel>
//           <FormControl type="password" name="password" value={formData.password} onChange={handleChange} required />
//           <FormLabel>Confirm</FormLabel>
//           <FormControl type="password" name="confirm" value={formData.confirm} onChange={handleChange} required />
//           <Button type="submit" disabled={disable}>SIGN UP</Button>
//         </form>
//       </div>
//       <p className="error-message">&nbsp;{formData.error}</p>
//     </div>
//   );
// }