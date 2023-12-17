import { FETCH_SPOT_DETAILS_SUCCESS, FETCH_REVIEWS_SUCCESS, DELETE_REVIEW_SUCCESS, POST_REVIEWS_SUCCESS } from './spotActions';

const initialState = {
  spotDetails: null,
  reviews: [],
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPOT_DETAILS_SUCCESS:
      return { ...state, spotDetails: action.payload };
    case FETCH_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: action.payload,
      };
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.payload),
      };
    case POST_REVIEWS_SUCCESS:
      return { ...state, reviews: [action.payload, ...state.reviews] };
    default:
      return state;
  }
};

export default spotReducer;
