import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  activeItemId: '',
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.items = action.payload;

      if (!state.items.some((item) => item.id === state.activeItemId)) {
        state.activeItemId = state.items[0]?.id ?? '';
      }
    },
    setActiveService: (state, action) => {
      state.activeItemId = action.payload;
    },
    addService: (state, action) => {
      state.items.push(action.payload);
      state.activeItemId = action.payload.id;
    },
    updateService: (state, action) => {
      const { id, changes } = action.payload;
      const item = state.items.find((service) => service.id === id);

      if (item) {
        Object.assign(item, changes);
      }
    },
    deleteService: (state, action) => {
      const deletedId = action.payload;
      state.items = state.items.filter((service) => service.id !== deletedId);

      if (state.activeItemId === deletedId) {
        state.activeItemId = state.items[0]?.id ?? '';
      }
    },
  },
});

export const {
  setServices,
  setActiveService,
  addService,
  updateService,
  deleteService,
} = servicesSlice.actions;

export const selectServices = (state) => state.services.items;
export const selectActiveServiceId = (state) => state.services.activeItemId;

export default servicesSlice.reducer;
