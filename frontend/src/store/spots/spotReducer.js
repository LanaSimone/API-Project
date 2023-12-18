import { FETCH_SPOT_SUCCESS, UPDATE_REVIEWS_AFTER_DELETE, FETCH_SPOT_DETAILS_SUCCESS, FETCH_REVIEWS_SUCCESS, UPDATE_SPOTS_SUCCESS, FETCH_CURRENT_USER_SPOTS_SUCCESS ,DELETE_REVIEW_SUCCESS, POST_REVIEWS_SUCCESS, DELETE_SPOTS_SUCCESS } from './spotActions';

const initialState = {
  spotDetails: null,
  reviews: [],
  spots: [],
  currentUserSpots: []

};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REVIEWS_AFTER_DELETE: {
      const reviewIdToDelete = action.payload;
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== reviewIdToDelete),
      };
    }
    case FETCH_SPOT_SUCCESS:
      return {
        ...state,
        spots: action.payload
      };
    case FETCH_SPOT_DETAILS_SUCCESS:
      return {
        ...state,
        spotDetails: action.payload
      };
    case FETCH_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: action.payload,
      };
    case UPDATE_SPOTS_SUCCESS:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        ),
      };
    case FETCH_CURRENT_USER_SPOTS_SUCCESS:
      return {
        ...state,
        currentUserSpots: action.payload
      };
    case DELETE_REVIEW_SUCCESS: {
      const deletedReviewId = action.payload;
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== deletedReviewId),
      };
    }
    case DELETE_SPOTS_SUCCESS: {
  const deletedSpotId = action.payload;
  const updatedUserSpots = state.currentUserSpots.Spots.filter(
    (spot) => spot.id !== deletedSpotId
  );

  return {
    ...state,
    currentUserSpots: {
      ...state.currentUserSpots,
      Spots: updatedUserSpots,
    },
  };
}
    case POST_REVIEWS_SUCCESS:
      return {
        ...state,
        reviews: [action.payload, ...state.reviews]
      };
    default:
      return state;
  }
};

export default spotReducer;
