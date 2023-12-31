// frontend/src/components/Navigation/ProfileButton.jsx

import { useEffect, useState, useRef } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch} from 'react-redux';
import * as sessionActions from '../../store/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
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
const { showModal, hideModalHandler } = useModal();


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
        <FontAwesomeIcon icon={faBars} className='bars'/>
      </button>
      <ul className={`profile-dropdown ${showMenu ? 'show' : 'hidden'}`} ref={ulRef}>
        {user ? (
          <div className='shown'>
            <li>{user.username}</li>
            <li>Hello,  {user.firstName}</li>
            <li>{user.email}</li>
            <NavLink to={'/manage-spots'} className='manage'>Manage Spots</NavLink>
            <li className='centered'>
              <button onClick={logout} className='logoutButton'>Log Out</button>
            </li>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText='Log In'
              onItemClick={() => {
                closeMenu();
                showModal(); // Show the modal when "Log In" is clicked
              }}
              modalComponent={<LoginFormModal onClose={hideModalHandler} />}
            />
            <OpenModalMenuItem
              itemText='Sign Up'
              onItemClick={() => {
                closeMenu();
                showModal();
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
