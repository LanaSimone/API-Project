import { csrfFetch } from "../csrf";


export const FETCH_SPOT_DETAILS_SUCCESS = 'FETCH_SPOT_DETAILS_SUCCESS';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';

export const fetchSpotDetailsSuccess = (spotDetails) => ({
  type: FETCH_SPOT_DETAILS_SUCCESS,
  payload: spotDetails,
});

export const fetchReviewsSuccess = (reviews) => ({
  type: FETCH_REVIEWS_SUCCESS,
  payload: reviews,
});

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch spot details (${response.status})`);
    }
    const data = await response.json();

    // Assuming previewImage is correctly set in the server response
    const spotDetails = {
      ...data,
      PreviewImage: data.previewImage
        ? { url: `data:image/jpeg;base64,${data.previewImage}` }
        : null,
    };

    dispatch(fetchSpotDetailsSuccess(spotDetails));
  } catch (error) {
    console.error('Error fetching spot details:', error.message);
  }
};
// Thunk to Fetch Reviews
export const fetchReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews (${response.status})`);
    }
    const data = await response.json();
    dispatch(fetchReviewsSuccess(data.Reviews));
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
  }
};
