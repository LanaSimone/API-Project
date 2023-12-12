import { csrfFetch } from "../csrf";

// Action Types
export const FETCH_SPOT_DETAILS_SUCCESS = 'FETCH_SPOT_DETAILS_SUCCESS';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';

// Action Creators
export const fetchSpotDetailsSuccess = (spotDetails) => ({
  type: FETCH_SPOT_DETAILS_SUCCESS,
  payload: spotDetails,
});

export const fetchReviewsSuccess = (reviews) => ({
  type: FETCH_REVIEWS_SUCCESS,
  payload: reviews,
});

// Thunk to Fetch Spot Details
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch spot details (${response.status})`);
    }
    const data = await response.json();
    dispatch(fetchSpotDetailsSuccess(data));
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
