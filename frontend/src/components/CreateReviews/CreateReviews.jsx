import { useState } from "react";
// import { useModal } from "../../context/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { useDispatch} from "react-redux";
import { postReviews, fetchReviews} from "../../store/spots/spotActions";
import './CreateReview.css'

function CreateReviews() {
  // const dispatch = useDispatch();
  // const { setModalContent } = useModal();
  // const loggedInUser = useSelector((state) => state.auth.user);
  // const modalContent = useSelector((state) => state.modal.modalContent);



  return (
    <div>
      <h1>How was your stay</h1>
      <button onClick={PostReviewModal}>Post Your Review</button>
    </div>
  );
}

export { CreateReviews };

function PostReviewModal({ spotId,onClose}) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  // const { setModalContent } = useModal();
  const [error, setError] = useState(null);
  const dispatch = useDispatch()
  //  const [reviewsState, setReviewsState] = useState([]);

  const handleStarHover = (hoveredIndex) => {
    setHoveredRating(hoveredIndex);
  };

  const handleStarClick = (clickedIndex) => {
    setRating(parseInt(clickedIndex, 10));
    setHoveredRating(0);
  };

  const starIcons = Array.from({ length: 5 }, (_, index) => (
    <FontAwesomeIcon
      key={index}
      icon={index < (hoveredRating || rating) ? solidStar : regularStar}
      className="star-icon"
      onMouseEnter={() => handleStarHover(index + 1)}
      onClick={() => handleStarClick(index + 1)}
    />
  ));

const isButtonDisabled = reviewText.length < 10 || rating === 0;

const handlePostReview = async () => {
  try {
    const response = await dispatch(postReviews(spotId, reviewText, rating));

    if (response.ok) {
      // Fetch the updated reviews after posting
      dispatch(fetchReviews(spotId));

      // Close the modal on success
      onClose();
    } else {
      // Handle other error cases
      const errorMessage = response.error?.message || 'Error posting review';
      console.error('Error posting review:', errorMessage);
      console.log('Error response:', response.error);

      // Set the error state to display in the modal
      setError(errorMessage);
    }
  } catch (error) {
    console.error('Error posting review:', error.message);
    // Set the error state to display in the modal
    setError('Review already exists for this spot');
  }
};

  return (
    <div className="review-modal">
      <h2>How was your stay?</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error in the modal */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Leave your review here..."
      />
      <div>{starIcons} Stars</div>
      <button
        onClick={handlePostReview}
        disabled={isButtonDisabled}
        className={isButtonDisabled ? 'disabled-button' : 'enabled-button'}
      >
        Submit your review
      </button>
    </div>
  );
}

export { PostReviewModal };
