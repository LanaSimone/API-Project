// frontend/src/components/LoginFormPage/LoginFormPage.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { useModal } from '../../context/Modal';
import './LoginForm.css';


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal(); // Assuming closeModal is part of your context
  const isButtonDisabled = credential.length < 4 || password.length < 6;
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError(null);

    try {
      if (isButtonDisabled) {
        return;
      }

      const response = await dispatch(sessionActions.login({ credential, password }));

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 401) {
          setLoginError('The provided credentials were invalid.');
        } else if (data.errors) {
          setErrors(data.errors);
        }
      } else {
        // Close the modal only in the case of a successful login
        closeModal(); // Use closeModal here
      }
    } catch (error) {
      setLoginError('The provided credentials were invalid.');
      console.error("An error occurred during login:", error);
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setCredential('demo@user.io');
    setPassword('password');
    await handleSubmit(e);
  };

 return (
    <div className='login-form'>
      <h1>Log In</h1>
      {loginError && (
        <p className="error-message">{loginError}</p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className="error-message">{errors.credential}</p>
        )}
        <label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className={`login-form-button ${isButtonDisabled ? 'disabled' : 'enabled'}`}
          disabled={isButtonDisabled}
        >
          Log In
        </button>
      </form>
      <div className="demo-link">
        <p>
          {' '}
          <a href="#" className="demo-user-link" onClick={handleDemoLogin}>
            Demo User
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginFormModal;
