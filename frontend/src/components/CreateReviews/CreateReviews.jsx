import { useState } from "react";
// import { useModal } from "../../context/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import './CreateReview.css'

function CreateReviews({ openPostReviewModal }) {
  return (
    <div>
      <h1>How was your stay</h1>
      <button onClick={openPostReviewModal}>Post Your Review</button>
    </div>
  );
}

export{CreateReviews};


function PostReviewModal({ onReviewPost, onError }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  // const { setModalContent } = useModal();
  const [error, setError] = useState(null);

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
    await onReviewPost(reviewText, rating);
    // If onReviewPost resolves without throwing an error, close the modal
    // onClose();
  } catch (error) {
    console.error('Error posting review:', error.message);
    onError(error.message);
    setError(error.message); // Set the error state
  }
};

  return (
  <div className="review-modal">
    <h2>How was your stay?</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <textarea
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      placeholder="Leave your review here..."
    />
    <div>{starIcons} Stars</div>
      <button onClick={handlePostReview}
        disabled={isButtonDisabled}
        className={isButtonDisabled ? 'disabled-button' : 'enabled-button'}
      >
        Submit your review
      </button>
  </div>
);
}

export { PostReviewModal };
