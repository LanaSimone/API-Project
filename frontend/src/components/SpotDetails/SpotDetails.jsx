import {  useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useModal} from '../../context/Modal';
import { PostReviewModal } from '../CreateReviews/CreateReviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faCircle } from '@fortawesome/free-solid-svg-icons';
// import { faStar } from '@fortawesome/free-regular-svg-icons';
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
          <div className="spot-details-container">
            <div className="spot-info-container">
              <h2 className="spot-name">{spotDetailsState.name}</h2>
              <p className="location">
                {spotDetailsState.city}, {spotDetailsState.state}, {spotDetailsState.country}
              </p>
            </div>
            <div className="spot-images">
              <img
                src={spotDetailsState.SpotImages[0]?.url}
                alt="Large Spot Image"
                className="large-image"
              />
              <img
                src={spotDetailsState.SpotImages[1]?.url}
                className="small-image"
              />
              <img
                src={spotDetailsState.SpotImages[2]?.url}
                className="small-image"
              />
              <img
                src={spotDetailsState.SpotImages[3]?.url}
                className="small-image"
              />
              <img
                src={spotDetailsState.SpotImages[4]?.url}
                alt="Small Spot Image"
                className="small-image"
              />
            </div>
          </div>
           <div className='spot-details-container'>
             <h3>Hosted by {spotDetailsState.Owner.firstName} {spotDetailsState.Owner.lastName}</h3>
             <p>{spotDetailsState.description}</p>

          <div className="reviews-container">
          </div>
          </div>
          <div className="price-rating-reviews-box">
            <p className="spot-price">${spotDetailsState.price}/night</p>
            <div className="star-rating-box">
              <FontAwesomeIcon icon={solidStar} className="review-icon" />
              <p className="spot-rating">{spotDetailsState.avgStarRating}</p>
              <FontAwesomeIcon icon={faCircle} className="circle" />
              <p className="spot-reviews">{spotDetailsState.numReviews} reviews</p>
            </div>
            <button className="reserve-button" onClick={() => alert('Feature Coming Soon...')}>
              Reserve
            </button>
          </div>
        </div>
      )}
            <div className="reviews-header">
              <FontAwesomeIcon icon={solidStar} className="review-icon" />
         <p className="review-text">{spotDetailsState.avgStarRating}</p>
         <FontAwesomeIcon icon={faCircle} className="circle" />
              <p className="reviews-title">{spotDetailsState.numReviews} reviews</p>
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
  );
}

export default SpotDetails;
