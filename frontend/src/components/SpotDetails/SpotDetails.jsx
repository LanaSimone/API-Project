import { useState, useEffect,useCallback } from 'react';
import { useParams } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from '../../context/Modal';
import { PostReviewModal } from '../CreateReviews/CreateReviews'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
// import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import './SpotDetails.css';


function SpotDetails() {
  const { spotId } = useParams();
  const [spotDetails, setSpotDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { setModalContent } = useModal();
  const [ setReviewError] = useState(null);


const fetchSpotDetailsAndReviews = useCallback(async () => {
  try {
    const detailsResponse = await fetch(`/api/spots/${spotId}`);
    console.log({ spotId }, 'spotId');
    const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);

    if (!detailsResponse.ok || !reviewsResponse.ok) {
      throw new Error('Failed to fetch spot details or reviews');
    }

    const detailsData = await detailsResponse.json();
    const reviewsData = await reviewsResponse.json();

    if (
      detailsData &&
      detailsData.name &&
      detailsData.city &&
      detailsData.state &&
      detailsData.country &&
      detailsData.description &&
      detailsData.price &&
      detailsData.numReviews &&
      reviewsData &&
      reviewsData.Reviews
    ) {
      const formattedSpot = {
        ...detailsData,
        SpotImages: Array.isArray(detailsData.SpotImages)
          ? detailsData.SpotImages.map((image) => {
              // Log each image item for debugging
              console.log('Image item:', image);

              // Extract Base64 data from the image object
              const base64Data =
                typeof image.data === 'string'
                  ? image.data
                  : typeof image.data === 'object' &&
                    (image.data.propertyName || image.data.data);

              if (!base64Data) {
                console.error('Invalid image data:', image.data);
                return null; // Skip rendering this image
              }

              return {
                ...image,
                url: `data:image/jpeg;base64,${base64Data}`,
              };
            })
          : [],
      };

      setSpotDetails(formattedSpot);
      setReviews(reviewsData.Reviews);
    } else {
      console.error('Invalid data format:', detailsData, reviewsData);
    }
  } catch (error) {
    console.error('Error fetching spot details or reviews:', error);
  }
}, [spotId, setSpotDetails, setReviews]);

  const getCookie = (name) => {
    const cookieValue = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${name}=`));

    return cookieValue ? cookieValue.split('=')[1] : null;
  };

  const handlePostReview = async (reviewText, rating) => {
    try {
    const response = await fetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
      },
      body: JSON.stringify({
        review: reviewText,
        stars: rating,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    // Assuming the response is okay, you can return some meaningful data if needed.
    return { success: true, message: 'Review posted successfully' };
  } catch (error) {
    throw new Error(error.message || 'Unexpected error posting review');
  }
};

  useEffect(() => {
    fetchSpotDetailsAndReviews();
  }, [fetchSpotDetailsAndReviews]);

  if (!spotDetails) {
    return <p>Loading...</p>;
  }

  console.log('Spot Details:', spotDetails);

  const openPostReviewModal = () => {
    setModalContent(
      <PostReviewModal
        spotId={spotId}
        onClose={() => setModalContent(null)}
        onReviewPost={handlePostReview}
        onError={(error) => setReviewError(error)} // Pass the onError function
      />
    );
  };

  return (
    <div className="spot-page-container">
      <div className="spot-details-container">
        <div className="spot-info-container">
          <h1 className="spot-name">{spotDetails.name}</h1>
          <p className="location">{`${spotDetails.city}, ${spotDetails.state}, ${spotDetails.country}`}</p>
        </div>
        <div className="spot-images">
         {spotDetails.SpotImages.map((image, index) => {
  console.log('Image Data:', image.data, typeof image.data); // Log the image data and its type for debugging

  if (!image.data || (typeof image.data !== 'string' && !Buffer.isBuffer(image.data))) {
    console.error('Invalid image data:', image.data);
    return null; // Skip rendering this image
  }

  let base64Data;

  if (typeof image.data === 'string') {
    // If it's already a string, use it
    base64Data = image.data;
  } else if (Buffer.isBuffer(image.data)) {
    // If it's a Buffer, convert it to base64
    base64Data = image.data.toString('base64');
  } else {
    console.error('Unsupported image data type:', typeof image.data);
    return null; // Skip rendering this image
  }

  console.log('Base64 Data:', base64Data); // Log the extracted Base64 data

  return (
    <img
      key={index}
      src={`data:image/jpeg;base64,${base64Data}`}
      alt={`Image ${index}`}
      className={index === 0 ? 'large-image' : 'small-image'}
    />
  );
})}
        </div>
      </div>
      <div className="spot-content">
        <div className="description-box">
          <p className="spot-host">{`Hosted By ${spotDetails.Owner.firstName} ${spotDetails.Owner.lastName}`}</p>
          <p className="spot-description">{spotDetails.description}</p>
        </div>
        <div className="price-rating-reviews-box">
          <p className="spot-price">$ {spotDetails.price}/night</p>
          <div className="star-rating-box">
            <FontAwesomeIcon icon={solidStar} className="review-icon" />
            <p>{spotDetails.avgStarRating}</p>
            <FontAwesomeIcon icon={faCircle} className="circle" />
          </div>
          <p className="spot-reviews">{`${spotDetails.numReviews} reviews`}</p>
          <button className="reserve-button" onClick={() => alert('Feature Coming Soon...')}>
            Reserve
          </button>
        </div>
      </div>
      <div className="reviews-container">
        <div className="reviews-header">
          <FontAwesomeIcon icon={solidStar} className="review-icon" />
          <p className="review-text">{spotDetails.avgStarRating}</p>
          <FontAwesomeIcon icon={faCircle} className="circle" />
          <p className="reviews-title">{`${spotDetails.numReviews} reviews`}</p>
        </div>
        <button onClick={() => openPostReviewModal(spotId)}>Post Your Review</button>

        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <h3>{review.firstName}</h3>
            <h4>{review.createdAt}</h4>
            <p>{review.reviewText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotDetails;
