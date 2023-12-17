// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormModal/LoginFormModal';
import SignupFormPage from './components/SignupFormModal/SignupFromModal';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import HomePage from './components/HomePage/HomePageComponent';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpot from './components/ManageSpots/UpdateSpot/UpdateSpot';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: "signup",
        element: <SignupFormPage />
      },
      {
        path: '/details/:spotId',
        element: <SpotDetails  />
      },
      {
        path: '/create-spot',
        element: <CreateSpot />
      },
      {
        path: '/manage-spots',
        element: <ManageSpots />
      },
      {
        path: '/update-spot',
        element: <UpdateSpot />
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
