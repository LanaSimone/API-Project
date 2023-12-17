import {useNavigate } from "react-router-dom";
import { fetchCurrentUserSpots } from "../../store/spots/spotActions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import ConfirmSpotDelete from "../ConfirmModals/ConfirmSpotDelete";
import { useModal } from "../../context/Modal";



function ManageSpots() {
    const {setModalContent} = useModal()
  const navigate = useNavigate();
  const dispatch = useDispatch();

const currentUserSpots = useSelector((state) => state.spot.currentUserSpots?.Spots || []);
console.log('!!!!!!!!!!userSpot', currentUserSpots);


  useEffect(() => {
    const fetchUserSpots = async () => {
      try {
        await dispatch(fetchCurrentUserSpots());
      } catch (error) {
        console.log('Error fetching user spots:', error);
      }
    };

    fetchUserSpots();
  }, [dispatch]);


    const handleCreateButtonClick = () => {
      navigate('/create-spot');
    }

    const handleUpdateButtonClick = () => {
        navigate('/update-spot');
    }


 const openDeleteSpotModal = (spotId, spotName) => {
    // Set the modal content to ConfirmSpotDelete component
    setModalContent(
      <ConfirmSpotDelete
        spotId={spotId}
        spotName={spotName}
            onCancel={() => setModalContent(null)}
            onClose={() => setModalContent(null)}
      />
    );
  };


  return (
    <div>
      <h1>Manage Your Spots</h1>
          <button onClick={handleCreateButtonClick}>Create a New Spot </button>
          <ul>
              {currentUserSpots.map((spot) => (
                  <li key={spot.id}>{spot.name}
                      <img src={spot.previewImage} alt={spot.name} className="spotImage" title={spot.name} />
                      <p>{spot.city}</p>
                      <p>{spot.state}</p>
                      <FontAwesomeIcon icon={solidStar} className="review-icon" /> {`${spot.avgRating}`}

                      <p>$ {spot.price}</p>
                      <button onClick={handleUpdateButtonClick}>Update</button>
                      <button onClick={() => openDeleteSpotModal(spot.id, spot.name)}>Delete</button>
                  </li>
              ))}
          </ul>
    </div>
  );
}

export default ManageSpots;
