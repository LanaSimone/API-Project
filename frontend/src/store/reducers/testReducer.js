// Example: frontend/src/store/reducers/testReducer.js
const initialState = {
  message: 'Initial message',
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};

export default testReducer;
