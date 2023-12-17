import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import LoginFormModal from '../LoginFormModal/LoginFormModal';
// import SignupFormModal from '../SignupFormModal/SignupFromModal';
import img1 from '../images/img1.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const handleImageClick = () => {
    // Navigate back to the home page
    navigate('/');
  };

  return (
    <div className='navLinkContainer'>
      <img src={img1} alt='logo image' className='smaller-image' onClick={handleImageClick} />
      <ul className='NavBar'>
        <li className='navLink'>
          <NavLink exact to='/'>
            Home
          </NavLink>
        </li>
        {sessionUser && (
          <li>
            <NavLink to='/create-spot' className='createSpotLink'>
              Create a New Spot
            </NavLink>
          </li>
        )}
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
