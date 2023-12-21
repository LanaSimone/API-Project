// frontend/src/components/SignupFormPage/SignupFormPage.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isButtonDisabled = username.length < 4 || password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({});
      dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    } else {
      setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field",
      });
    }
  };

  return (
    <div className='signupContainer'>
      <div className='signUp'>
      <h1>Sign Up</h1>

      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        <div >

        <button className={`signupButton`} disabled={isButtonDisabled}>
        Sign up
      </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
