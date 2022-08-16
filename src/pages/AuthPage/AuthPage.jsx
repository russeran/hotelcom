import { useState } from 'react';
import './AuthPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';


export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="AuthPage">
      <div>
<br />
        <button  onClick={() => setShowLogin(!showLogin)}>{showLogin ? '>SIGN UP FORM' : '>LOG IN FORM'}</button>
      </div>
      {showLogin ? <LoginForm setUser={setUser} /> : <SignUpForm setUser={setUser} />}
      
    </main>
  );
}