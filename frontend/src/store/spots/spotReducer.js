import { FETCH_SPOT_DETAILS_SUCCESS, FETCH_REVIEWS_SUCCESS, DELETE_REVIEW_SUCCESS, POST_REVIEWS_SUCCESS } from './spotActions';

const initialState = {
  spotDetails: null,
  reviews: [],
};

const spotReducer = (state = initialState, action) => {
  let deletedReviewId; // Move the variable declaration outside of the case block

  switch (action.type) {
    case FETCH_SPOT_DETAILS_SUCCESS:
      return { ...state, spotDetails: action.payload };
    case FETCH_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: action.payload,
      };
    case DELETE_REVIEW_SUCCESS:
      deletedReviewId = action.payload; // Now you can use the variable inside the case block
      const updatedReviews = state.reviews.filter((review) => review.id !== deletedReviewId);
      return { ...state, reviews: updatedReviews };
    case POST_REVIEWS_SUCCESS:
      return { ...state, reviews: [action.payload, ...state.reviews] };
    default:
      return state;
  }
};

export default spotReducer;
