import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { PostReviewModal } from '../CreateReviews/CreateReviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';

import './SpotDetails.css';

function SpotDetails() {
  const  {spotId}  = useParams();
  const [spotDetails, setSpotDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { setModalContent } = useModal();

  // const fetchSpotDetails = useCallback(async () => {
  //   try {
  //     const response = await fetch(`/api/spots/${spotId}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch spot details', {spotId});
  //     }
  //     const data = await response.json();
  //     if (data && data.name && data.city && data.state && data.country && data.description && data.price && data.numReviews) {
  //       const formattedSpot = {
  //         ...data,
  //         SpotImages: Array.isArray(data.SpotImages)
  //           ? data.SpotImages.map(image => ({ ...image, url: `data:image/jpeg;base64,${image.url}` }))
  //           : [],
  //       };
  //       setSpotDetails(formattedSpot);
  //     } else {
  //       console.error('Invalid data format:', data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching spot details:', error.message);
  //   }
  // }, [spotId, setSpotDetails]);

  const fetchSpotDetails = useCallback(async () => {
  try {
    const response = await fetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch spot details (${response.status})`);
    }
    const data = await response.json();

    if (data && data.name && data.city && data.state && data.country && data.description && data.price && data.numReviews) {
      const formattedSpot = {
        ...data,
        SpotImages: Array.isArray(data.SpotImages)
          ? data.SpotImages.map(image => ({ ...image, url: `data:image/jpeg;base64,${image.url}` }))
          : [],
      };
      setSpotDetails(formattedSpot);
    } else {
      console.error('Invalid data format:', data);
    }
  } catch (error) {
    console.error('Error fetching spot details:', error.message);
  }
}, [spotId, setSpotDetails]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      if (data && data.Reviews) {
        setReviews(data.Reviews);
      } else {
        console.error('Invalid reviews data format:', data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [spotId, setReviews]);

  useEffect(() => {
    fetchSpotDetails();
    fetchReviews();
  }, [spotId, fetchSpotDetails, fetchReviews]);

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

export default SpotDetails;
