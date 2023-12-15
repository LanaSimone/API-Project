// modal.js (reducer)
import { OPEN_MODAL } from '../actions/modal'; // Ensure the correct path

const initialState = {
  modalContent: null,
  // ... other modal-related state
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        modalContent: action.payload.modalContent,
      };
    // ... handle other actions if needed
    default:
      return state;
  }
};

export default modalReducer;
