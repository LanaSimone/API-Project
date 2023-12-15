import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    content: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.content = action.payload.content;
    },
    closeModal: (state) => {
      state.content = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
