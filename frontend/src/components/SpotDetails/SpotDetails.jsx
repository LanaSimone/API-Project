import {  useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useModal} from '../../context/Modal';
import { PostReviewModal } from '../CreateReviews/CreateReviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { fetchSpotDetails, fetchReviews } from '../../store/spots/spotActions';
import './SpotDetails.css';


function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviews(spotId));
  }, [spotId, dispatch]);

  const spotDetailsState = useSelector((state) => state.spot.spotDetails);
  const reviewsState = useSelector((state) => state.spot.reviews);

  const openPostReviewModal = () => {
    setModalContent(
      <PostReviewModal
        onClose={() => {
          setModalContent(null);
          dispatch(fetchReviews(spotId));
        }}
      />
    );
  };

  console.log('!!!spotDetailsState:', spotDetailsState);
  console.log('reviewsState:', reviewsState);

  if (!spotDetailsState) {
    return <div>Loading...</div>;
  }

 return (
  <div className="spot-page-container">
    {!spotDetailsState.loading && !spotDetailsState.error && (
      <div className="spot-content">
        {spotDetailsState.SpotImages.map((spotImage, index) => (
          
          <img
            key={index}
            src={spotImage.url}
            alt={`Spot Image ${index + 1}`}
            className="spot-image"
          />
        ))}
        <div className="price-rating-reviews-box">
          {spotDetailsState.price !== null && (
            <p className="spot-price">$ {spotDetailsState.price}/night</p>
          )}
          <div className="star-rating-box">
            <FontAwesomeIcon icon={solidStar} className="review-icon" />
            <p>{spotDetailsState.avgStarRating}</p>
            <FontAwesomeIcon icon={faCircle} className="circle" />
          </div>
        </div>
        <p className="spot-reviews">{spotDetailsState.numReviews} reviews</p>
        <button
          className="reserve-button"
          onClick={() => alert('Feature Coming Soon...')}
        >
          Reserve
        </button>
        <div className="reviews-container">
          <div className="reviews-header">
            <FontAwesomeIcon icon={faStar} className="review-icon" />
            <p className="review-text">{spotDetailsState.avgStarRating}</p>
            <p className="reviews-title">
              {spotDetailsState.numReviews} reviews
            </p>
          </div>
          <button onClick={openPostReviewModal}>Post Your Review</button>
          {reviewsState.length > 0 &&
            reviewsState.map((review, index) => (
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

export default SpotDetails;
