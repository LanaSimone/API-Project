import {useNavigate } from "react-router-dom";
import { fetchCurrentUserSpots } from "../../store/spots/spotActions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import ConfirmSpotDelete from "../ConfirmModals/ConfirmSpotDelete";
import { useModal } from "../../context/Modal";
import '../HomePage/HomePage.css'
// import UpdateSpot from "../UpdateSpot/UpdateSpot";



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

    const handleUpdateButtonClick = (spotId) => {
  navigate(`/update-spots/${spotId}`); // Update the path to '/update-spots'
  }

  const handleSpotClick = async (spotId) => {
    navigate(`/details/${spotId}`);
  };

  const handleButtonClick = (event) => {
  // This prevents the click event from propagating to the parent li element
  event.stopPropagation();
};

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
    <div className="homePage">
      <h1 className="manageSpot">Manage Spots</h1>
      <button onClick={handleCreateButtonClick} className="createSpotBtn">Create a New Spot </button>
          <ul className="homePageSpotList">
              {currentUserSpots.map((spot) => (
                <li key={spot.id} onClick={() => handleSpotClick(spot.id)} className="spotListItem">
                  <div className="spotDetails">

                  <img src={spot.previewImage} alt={spot.name} className="spotImage" title={spot.name} />
                    <div className="textDetails">
                      <div>

                        <p className="locations">{`${spot.city}, ${spot.state}`}</p>
                        <p className="price">{`$ ${spot.price}`}/ night</p>
                      </div>


                      <p>
                        <div className="manageStar">

                  <FontAwesomeIcon icon={solidStar} className="review-icon" /> {`${spot.avgRating}`}
                  </div>
                  </p>
                  </div>
                  <div className="manageButtons">

                    <button onClick={(e) => { handleButtonClick(e); handleUpdateButtonClick(spot.id); }} className="manageBttn">Update</button>
                    <button onClick={(e) => { handleButtonClick(e); openDeleteSpotModal(spot.id, spot.name); }}>Delete</button>

                  </div>

                  </div>



                  </li>
              ))}
          </ul>
    </div>
  );
}

export default ManageSpots
