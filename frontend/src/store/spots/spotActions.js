import {createSlice } from "@reduxjs/toolkit";

import { csrfFetch } from "../csrf";



export const FETCH_SPOT_SUCCESS = 'FETCH_SPOT_SUCCESS'
export const FETCH_SPOT_DETAILS_SUCCESS = 'FETCH_SPOT_DETAILS_SUCCESS';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';
export const FETCH_CURRENT_USER_SPOTS_SUCCESS = 'FETCH_CURRENT_USER_SPOTS_SUCCESS';
export const UPDATE_SPOTS_SUCCESS = 'UPDATE_SPOTS_SUCCESS'
export const POST_REVIEWS_SUCCESS = 'POST_REVIEWS_SUCCESS';
export const DELETE_REVIEW_SUCCESS = 'DELETE_REVIEW_SUCCESS';
export const DELETE_SPOTS_SUCCESS = 'DELETE_SPOTS_SUCCESS'

export const fetchSpotsSuccess = (data) => {
  const spots = data && data.Spots ? data.Spots : [];
  return {
    type: FETCH_SPOT_SUCCESS,
    payload: spots,
  };
};

export const updateSpotsSuccess = (data) => ({
  type: UPDATE_SPOTS_SUCCESS,
  payload: data,
})

export const fetchSpotDetailsSuccess = (spotDetails) => ({
  type: FETCH_SPOT_DETAILS_SUCCESS,
  payload: spotDetails,
});

export const fetchCurrentUserSpotsSuccess = (userSpots) => ({
  type: FETCH_CURRENT_USER_SPOTS_SUCCESS,
  payload: userSpots
})

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

export const deleteSpotsSuccess = (spotId) => ({
  type: DELETE_SPOTS_SUCCESS,
  payload: spotId,
})


export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots')

    if (!response.ok) {
      throw new Error(`Failed to fetch spots (${response.status})`);
    }
    const data = await response.json();

    console.log('API Response for fetchSpots:', data); // Add this line

    dispatch(fetchSpotsSuccess(data));
  } catch (error) {
    console.log('Error fetching spots:', error.message);
  }
}

export const fetchCurrentUserSpots = () =>async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots/current');

    if (!response.ok) {
      throw new Error(`Failed to fetch current users spots (${response.status})`);
    }
    const data = await response.json()

    console.log('Response for fetch current user spots', data)

    dispatch(fetchCurrentUserSpotsSuccess(data));
  }
  catch (error) {
    console.log('Error fetching spots:', error.message)

  }
}

export const updateSpots = (spotId, address, city, state, country, lat, lng, name, description, price) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      }),
    });

    console.log('Response from backend:', response);
    if (!response.ok) {
      const responseData = await response.json();
      console.log(`Error updating spot: ${responseData.message}`);
      return { ok: false, error: responseData.message };
    } else {
      const data = await response.json();

      dispatch(updateSpotsSuccess(data));
      return { ok: true, payload: data };
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw error;
  }
};

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

export const deleteSpots = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete spot (${response.status})`);
    }

    const data = await response.json();
    dispatch(deleteSpotsSuccess(spotId));

    // Return the response to handle it in the component
    return { ok: true, payload: data };
  } catch (error) {
    console.error('Error deleting spot:', error.message);
    // Throw the error to be caught in the component
    throw error;
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
    spots: []

  },
  reducers: {
    DELETE_REVIEW_SUCCESS: (state, action) => {
      console.log('action payload:', action.payload)
      const updatedReviews = action.payload;
      return {
        ...state,
        reviews: updatedReviews
      };
    },
    DELETE_SPOT_SUCCESS: (state, action) => {
      console.log('action payload', action.payload)
      const updatedSpots = action.payload;
      return {
        ...state,
        spots: updatedSpots
      }
    }

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
