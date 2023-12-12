import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useModal} from '../../context/Modal';
import { PostReviewModal } from '../CreateReviews/CreateReviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
// import setModalContent


import { fetchSpotDetails, fetchReviews } from '../../store/spots/spotActions';

import './SpotDetails.css';

function SpotDetails({ spotDetails, fetchSpotDetails, fetchReviewsAction }) {
  const [reviews] = useState([]);
  const { spotId } = useParams(); // Get spotId from URL params

  useEffect(() => {
    fetchSpotDetails(spotId);
    fetchReviewsAction(spotId);
  }, [spotId, fetchSpotDetails, fetchReviewsAction]);


  // const fetchReviews = useCallback(async () => {
  //   try {
  //     const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch reviews');
  //     }
  //     const data = await response.json();
  //     if (data && data.Reviews) {
  //       setReviews(data.Reviews);
  //     } else {
  //       console.error('Invalid reviews data format:', data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching reviews:', error);
  //   }
  // }, [spotId, setReviews]);


const { setModalContent } = useModal();
  const openPostReviewModal = () => {
  setModalContent(
    <PostReviewModal
      onClose={() => {
        setModalContent(null);
        fetchReviews();
      }}
    />
  );
};

  return (
    <div className='spot-page-container'>
      {spotDetails ? (
        <div className="spot-details-container">
          <div className="spot-info-container">
            <h1 className="spot-name">{spotDetails.name}</h1>
            <p className="location">{`${spotDetails.city}, ${spotDetails.state}, ${spotDetails.country}`}</p>
          </div>
          <div className="spot-images">
            {spotDetails.SpotImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Image ${index}`}
                className={index === 0 ? 'large-image' : 'small-image'}
              />
            ))}
          </div>
        </div>
      ) : null}

      {spotDetails && (
        <div className="spot-content">
          <div className="price-rating-reviews-box">
            <p className="spot-price">$ {spotDetails.price}/night</p>
            <div className="star-rating-box">
              <FontAwesomeIcon icon={solidStar} className="review-icon" />
              <p>{spotDetails.avgStarRating}</p>
              <FontAwesomeIcon icon={faCircle} className='circle' />
            </div>
            <p className="spot-reviews">{spotDetails.numReviews} reviews</p>
            <button className="reserve-button" onClick={() => alert('Feature Coming Soon...')}>Reserve</button>
          </div>
          <div className="reviews-container">
            <div className='reviews-header'>
              <FontAwesomeIcon icon={faStar} className="review-icon" />
              <p className="review-text">{spotDetails.avgStarRating}</p>
              <p className="reviews-title">{spotDetails.numReviews} reviews</p>
            </div>
            <button onClick={openPostReviewModal}>Post Your Review</button>
            {reviews.map((review, index) => (
              <div key={index} className="review-item">
                <p>{review.firstName}</p>
                <p>{review.createdAt}</p>
                <p>{review.reviewText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// SpotDetails.displayName = 'SpotDetails';

const mapStateToProps = (state) => ({
  spotDetails: state.spot.spotDetails,
  reviews: state.spot.reviews,
});


const mapDispatchToProps = {
  fetchSpotDetails,
  fetchReviewsAction: fetchReviews, // Corrected the name here
};

export default connect(mapStateToProps, mapDispatchToProps)(SpotDetails);
