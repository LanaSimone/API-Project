// frontend/src/components/Navigation/ProfileButton.jsx

import { useEffect, useState, useRef } from 'react';
import { useDispatch} from 'react-redux';
import * as sessionActions from '../../store/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFromModal';
import { NavLink } from 'react-router-dom';
// import ManageSpots from '../ManageSpots/ManageSpots';
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  // const loggedInUser = useSelector((state) => state.session.user);


  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
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

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='navButtonContainer profile-button'> {/* New container */}
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
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              />
          </>
        )}
      </ul>
    </div>
  );
}
export default ProfileButton;
