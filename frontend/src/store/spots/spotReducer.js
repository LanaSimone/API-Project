// spotReducer.js

import { FETCH_SPOT_DETAILS_SUCCESS, FETCH_REVIEWS_SUCCESS } from './spotActions';

const initialState = {
  spotDetails: null,
  reviews: [],
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SPOT_DETAILS_SUCCESS:
      return { ...state, spotDetails: action.payload };
    case FETCH_REVIEWS_SUCCESS:
      return { ...state, reviews: action.payload };
    default:
      return state;
  }
};

export default spotReducer;
