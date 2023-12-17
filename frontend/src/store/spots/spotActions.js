import {createSlice } from "@reduxjs/toolkit";

import { csrfFetch } from "../csrf";



export const FETCH_SPOT_DETAILS_SUCCESS = 'FETCH_SPOT_DETAILS_SUCCESS';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';
export const POST_REVIEWS_SUCCESS = 'POST_REVIEWS_SUCCESS';
export const DELETE_REVIEW_SUCCESS = 'DELETE_REVIEW_SUCCESS';

export const fetchSpotDetailsSuccess = (spotDetails) => ({
  type: FETCH_SPOT_DETAILS_SUCCESS,
  payload: spotDetails,
});

export const fetchReviewsSuccess = (reviews) => {
  return {
    type: FETCH_REVIEWS_SUCCESS,
    payload: reviews,
  };
};

export const deleteReviewSuccess = (reviewId) => ({
  type: DELETE_REVIEW_SUCCESS,
  payload: reviewId,
});

export const postReviewSuccess = (reviews) => ({
  type: POST_REVIEWS_SUCCESS,
  payload: reviews,
});


export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch spot details (${response.status})`);
    }
    const data = await response.json();

    // Assuming spotImages is correctly set in the server response
    const spotDetails = {
  ...data,
  SpotImages: Array.isArray(data.SpotImages)
    ? data.SpotImages.map(image => ({ ...image, url: `${image.url}` }))
    : [],
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

export const postReviews = (spotId, reviewText, stars) => async (dispatch) => {
   try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            review: reviewText,
            stars
         })
      });

      console.log('Response from backend:', response);
      if (!response.ok) {
        const responseData = await response.json();
        console.log(`Error posting review: ${responseData.message}`);
        return { ok: false, error: responseData.message };
      } else {
        const data = await response.json();
        const allReviews = Array.isArray(data.payload) ? data.payload : [];
        dispatch({ type: POST_REVIEWS_SUCCESS, payload: data });
         return { ok: true, payload: allReviews };
      }
   } catch (error) {
      console.error("An unexpected error occurred:", error);
      throw error;
   }
};



export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete review (${response.status})`);
    }

    const data = await response.json();
    dispatch(deleteReviewSuccess(reviewId));

    // Return the response to handle it in the component
    return { ok: true, payload: data };
  } catch (error) {
    console.error('Error deleting review:', error.message);
    // Throw the error to be caught in the component
    throw error;
  }
};

const spotSlice = createSlice({
  name: 'spot',
  initialState: {
    spotDetails: null,
    reviews: [],
  },
  reducers: {
    DELETE_REVIEW_SUCCESS: (state, action) => {
      console.log('action payload:', action.payload)
      const updatedReviews = action.payload;
      return { ...state, reviews: updatedReviews };
    },

  },
  extraReducers: (builder) => {
    builder
  .addCase(postReviews.fulfilled, (state, action) => {
    if (action.payload.ok) {
      const { review } = action.payload.payload;

      state.reviews = [review, ...state.reviews];
    }
  });
  },
});
export default spotSlice.reducer;
