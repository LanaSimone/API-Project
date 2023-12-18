import {  useEffect,  useState} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
// import { openModal } from '../../store/modal.js/modal';
import { PostReviewModal } from '../CreateReviews/CreateReviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faCircle } from '@fortawesome/free-solid-svg-icons';
// import { faStar } from '@fortawesome/free-regular-svg-icons';
import { fetchSpotDetails, fetchReviews } from '../../store/spots/spotActions';
import DeleteReview from '../CreateReviews/CreateReviewDeleteModal';
import './SpotDetails.css';


function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [numReviews, setNumReviews] = useState(0)
  // const [reviewsStateLocal, setReviewsStateLocal] = useState([]);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviews(spotId));
  }, [spotId, dispatch]);

  const spotDetailsState = useSelector((state) => state.spot.spotDetails);
  const reviewsState = useSelector((state) => state.spot.reviews);
  const loggedInUser = useSelector((state) => state.session.user);
  const loggedInUserId = loggedInUser ? loggedInUser.id : null;


  console.log(loggedInUser, '!!!!!@#!@#!@#!@3spitDetailstate')

  useEffect(() => {
    if (Array.isArray(reviewsState)) {
      setNumReviews(reviewsState.length);
    }
  }, [reviewsState]);

  const openPostReviewModal = () => {
    setModalContent(<PostReviewModal spotId={spotId} onClose={() => setModalContent(null)} />);
  };

  if (!spotDetailsState) {
    return <div>Loading...</div>;
  }
  { console.log('Reviews State:', reviewsState); }

const handleDeleteReview = (reviewId) => {
  if (reviewId !== undefined && reviewId !== null) {
    console.log('Deleting review with ID:', reviewId);
    setModalContent(<DeleteReview reviewId={reviewId} onCancel={() => setModalContent(null)} />);
  } else {
    console.error('Review ID is undefined or null.');
  }
};



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
                title={spotDetailsState.name}
                alt="Large Spot Image"
                className="large-image"
              />
              <img
                src={spotDetailsState.SpotImages[1]?.url}
                title={spotDetailsState.name}
                className="small-image"
              />
              <img
                src={spotDetailsState.SpotImages[2]?.url}
                title={spotDetailsState.name}
                className="small-image"
              />
              <img
                src={spotDetailsState.SpotImages[3]?.url}
                title={spotDetailsState.name}
                className="small-image"
              />
              <img
                src={spotDetailsState.SpotImages[4]?.url}
                title={spotDetailsState.name} 
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
            <div className="star-rating-box">
            <p className="spot-price">${spotDetailsState.price}/night</p>
              <FontAwesomeIcon icon={solidStar} className="review-icon" />
              <p className="spot-rating">{spotDetailsState.avgStarRating}</p>
              <FontAwesomeIcon icon={faCircle} className="circle" />
              <p className="spot-reviews">{numReviews} reviews</p>
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
      </div>
        <p className="reviews-title">{numReviews} reviews</p>
      {loggedInUser && (
        <button onClick={openPostReviewModal}>Post Your Review</button>
      )}
      {reviewsState && Array.isArray(reviewsState) ? (
          reviewsState.map((review, index) => (
            <div key={index}>

              <p>First Name: {review.firstName || 'N/A'}</p>


              <p>Review Text: {review.reviewText || review.review || 'N/A'}</p>

              <p>Created At: {review.createdAt || review.updatedAt || 'N/A'}</p>


              {loggedInUserId && loggedInUserId === review.userId && (
    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
)}
            </div>


  ))
) : (
  reviewsState ? (
    <div>
      <p>First Name: {reviewsState[0]?.firstName || 'N/A'}</p>
      <p>Review Text: {reviewsState[0]?.reviewText || reviewsState[0]?.review || 'N/A'}</p>
      <p>Created At: {reviewsState[0]?.createdAt || reviewsState[0]?.updatedAt || 'N/A'}</p>


{loggedInUserId && loggedInUserId === reviewsState.userId && (
  <button >Delete</button>
)}
    </div>
  ) : (
    <p>No reviews available.</p>
  )
)}
    </div>
  );
}

export default SpotDetails;
