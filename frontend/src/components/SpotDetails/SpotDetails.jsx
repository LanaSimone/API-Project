import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
   const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviews(spotId));
  }, [spotId, dispatch]);

  const spotDetailsState = useSelector((state) => state.spot.spotDetails);
    const reviewsState = useSelector((state) => state.spot.reviews);
    const loggedInUser = useSelector((state) => state.session.user);
    const loggedInUserId = loggedInUser ? loggedInUser.id : null;

    useEffect(() => {
    if (Array.isArray(reviewsState)) {
      // Calculate the average rating when reviews change
      const totalRating = reviewsState.reduce((sum, review) => sum + review.stars, 0);
      const newNumReviews = reviewsState.length;
      const newAverageRating = newNumReviews > 0 ? totalRating / newNumReviews : 0;

      setNumReviews(newNumReviews);
      setAverageRating(newAverageRating);
    }
  }, [reviewsState]);


  const openPostReviewModal = () => {
    setModalContent(<PostReviewModal spotId={spotId} onClose={() => setModalContent(null)} />);
  };

      const handleDeleteReview = (reviewId) => {
        if (reviewId !== undefined && reviewId !== null) {


        setModalContent(<DeleteReview reviewId={reviewId} onCancel={() => setModalContent(null)} />);
      } else {
        console.error('Review ID is undefined or null.');
      }
      };
      if (!spotDetailsState) {
        return <div>Loading...</div>;
  }

  const reversedReviews = reviewsState ? [...reviewsState].reverse() : [];
      // const isNewReview = reviewsState && Array.isArray(reviewsState) && reviewsState.length === 0 && loggedInUserId && loggedInUserId !== spotDetailsState.Owner.id;

     return (
    <div className="spot-page-container">
      {!spotDetailsState.loading && !spotDetailsState.error && (
        <div className="spot-content">
          <div className="spot-details-container">
            <div className="spot-info-container">
              <h2 className="spot-name">{spotDetailsState.name}</h2>
              <p className="locations">
                {' '}
                {spotDetailsState.city}, {spotDetailsState.state}, {spotDetailsState.country}{' '}
              </p>
            </div>
            <div className="spot-images">
              <img src={spotDetailsState.SpotImages[0]?.url} title={spotDetailsState.name} className="large-image" />
              <div className="smallImgContainer ">
                <img src={spotDetailsState.SpotImages[1]?.url} className="small-image" />
                <img src={spotDetailsState.SpotImages[2]?.url} className="small-image" />
                <img src={spotDetailsState.SpotImages[3]?.url} className="small-image" />
                <img src={spotDetailsState.SpotImages[4]?.url} className="small-image" />
              </div>
            </div>
          </div>
          <div className="spot-details-container">
            <h3>Hosted by {spotDetailsState.Owner.firstName} {spotDetailsState.Owner.lastName}</h3>
            <p>{spotDetailsState.description}</p>
          </div>
          <div className="price-rating-reviews-box">
            <div className="star-rating-box">
              <p className="spot-price">${spotDetailsState.price} /night</p>
              <div className="starText">
                <FontAwesomeIcon icon={solidStar} className="review-icon" />
                {numReviews === 0 ? (
                  <>
                    <p>New</p>
                  </>
                ) : (
                  <>
                    <p className="spot-rating">{averageRating.toFixed(1)}</p>
                    <FontAwesomeIcon icon={faCircle} className="circle" />
                    <p className="spot-reviews">{numReviews} review{numReviews !== 1 ? 's' : ''}</p>
                  </>
                )}
              </div>
            </div>
            <button className="reserve-button" onClick={() => alert('Feature Coming Soon...')}>
              {' '}
              Reserve{' '}
            </button>
          </div>
        </div>
      )}

      <div className="reviews-header">
        {numReviews > 0 && (
          <>
            <FontAwesomeIcon icon={solidStar} className="review-icon" />
            <p className="spot-rating">{averageRating.toFixed(1)}</p>
            <FontAwesomeIcon icon={faCircle} className="circles" />
            <p className="reviews-title">{numReviews} review{numReviews !== 1 ? 's' : ''}</p>
          </>
        )}
      </div>
      {loggedInUser &&
  loggedInUserId !== null &&  // Ensure loggedInUserId is not null
  loggedInUserId !== spotDetailsState.Owner.id &&
  reviewsState &&
  Array.isArray(reviewsState) &&
  reviewsState.length > 0 &&
  !reviewsState.some(review => review.userId === loggedInUserId) && (
    <button onClick={openPostReviewModal} className='postreviewButton'>Post Your Review</button>
)}
      <div className="reviews-container">
        {reviewsState && Array.isArray(reviewsState) && reviewsState.length > 0 ? (
          reversedReviews.map((review, index) => (
            <div key={index} className="reviewTexts">
              <h2>{review.firstName || 'N/A'}</h2>
              <h3>{review.createdAt || review.updatedAt || 'N/A'}</h3>
              <p>{review.reviewText || review.review || 'N/A'}</p>
              {loggedInUserId && loggedInUserId === review.userId && (
                <div className="buttons">
                  <button onClick={() => handleDeleteReview(review.id)} className="deleteButton">Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>
            <div className="idk1">
              <FontAwesomeIcon icon={solidStar} className="review-icon" />
              {reviewsState.length === 0 && <p>New</p>}
            </div>
            {loggedInUser &&
  loggedInUserId !== spotDetailsState.Owner.id &&
  reviewsState.length === 0 && (
    <>
      <button onClick={openPostReviewModal} className='postreviewButton1'>Post Your Review</button>
      <p>Be the first to review!</p>
    </>
)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotDetails;
