import { useState } from 'react';
import './AuthPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';


export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="auth-page">
      <div className="auth-card surface-card">
        <div className="auth-brand">
          <span className="auth-mark">MS</span>
          <div>
            <h1 className="auth-title">Mama Shelter <span className="brand-accent">LA</span></h1>
            <p className="auth-tagline">Department Communication Hub</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${showLogin ? 'active' : ''}`}
            onClick={() => setShowLogin(true)}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${!showLogin ? 'active' : ''}`}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {showLogin ? <LoginForm setUser={setUser} /> : <SignUpForm setUser={setUser} />}
      </div>
      <p className="auth-footnote">Connecting hotel departments, one shift at a time.</p>
    </main>
  );
}
