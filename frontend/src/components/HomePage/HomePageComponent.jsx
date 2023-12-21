import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import {  fetchSpots, fetchReviews, fetchReviewsSuccess } from '../../store/spots/spotActions';

import './HomePage.css'

function HomePage() {
  // const [spots, setSpots] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spotsState = useSelector((state) => state.spot.spots);
  const reviewsState = useSelector((state) => state.spot.reviews);
  console.log(reviewsState, '@@@@@@')

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpots());
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchData();
  }, [dispatch]);




useEffect(() => {
  const fetchReviewsForSpot = async (spotId) => {
    try {
      const response = await dispatch(fetchReviews(spotId));

      // if (!response || !response.ok) {
      //   throw new Error(`Failed to fetch reviews (${response ? response.status : 'unknown status'})`);
      // }

      const data = await response.json();
      dispatch(fetchReviewsSuccess(data.reviews));
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  // Fetch reviews for each spot
  spotsState.forEach((spot) => fetchReviewsForSpot(spot.id));
}, [dispatch, spotsState]);

  const handleSpotClick = async (spotId) => {
    navigate(`/details/${spotId}`);
  };

 return (
  <div className='homePage'>
    <ul className='homePageSpotList'>
      {spotsState.map((spot) => (
        <li key={spot.id} className="spotListItem" onClick={() => handleSpotClick(spot.id)}>
          <div className="spotDetails">
            <img src={spot.previewImage} alt={spot.name} className="spotImage" title={spot.name} />
            <div className="textDetails">
              <div>
                <p className="locations">{`${spot.city}, ${spot.state}`}</p>
                <p className="price">{`$ ${spot.price}`}/night</p>
              </div>

              {reviewsState.length  === '0' ? (
                <p className="new-review-label">New</p>
              ) : (
                <p>
                  <FontAwesomeIcon icon={solidStar} className="review-icon" /> {`${spot.avgRating}`}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
}

export default HomePage;
