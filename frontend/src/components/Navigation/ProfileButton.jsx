// frontend/src/components/Navigation/ProfileButton.jsx

import { useEffect, useState, useRef } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch} from 'react-redux';
import * as sessionActions from '../../store/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFromModal';
import { NavLink, useNavigate } from 'react-router-dom';
// import ManageSpots from '../ManageSpots/ManageSpots';
import './Navigation.css'

function ProfileButton({ user }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const { showModalHandler, hideModalHandler } = useModal(); // Use the useModal hook

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  return (
    <div className='navButtonContainer profile-button'>
      <button onClick={toggleMenu} className='navButtonContainer'>
        <FontAwesomeIcon icon={faUser} />
      </button>
      <ul className={`profile-dropdown ${showMenu ? 'show' : 'hidden'}`} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <NavLink to={'/manage-spots'}>Manage Spots</NavLink>
            <li className='centered'>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText='Log In'
              onItemClick={() => {
                closeMenu();
                showModalHandler(); // Show the modal when "Log In" is clicked
              }}
              modalComponent={<LoginFormModal onClose={hideModalHandler} />}
            />
            <OpenModalMenuItem
              itemText='Sign Up'
              onItemClick={() => {
                closeMenu();
                showModalHandler(); // Show the modal when "Sign Up" is clicked
              }}
              modalComponent={<SignupFormModal onClose={hideModalHandler} />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
