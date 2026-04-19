import { createSlice } from '@reduxjs/toolkit';

const normalizeRating = (rating) => {
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return null;
  }

  return numericRating;
};

const normalizeService = (service) => ({
  ...service,
  likes: Number.isFinite(service.likes) ? service.likes : 0,
  isFavorite: Boolean(service.isFavorite),
  ratings: Array.isArray(service.ratings)
    ? service.ratings
        .map(normalizeRating)
        .filter((rating) => rating !== null)
    : [],
});

const initialState = {
  items: [],
  activeItemId: '',
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.items = action.payload.map(normalizeService);

      if (!state.items.some((item) => item.id === state.activeItemId)) {
        state.activeItemId = state.items[0]?.id ?? '';
      }
    },
    setActiveService: (state, action) => {
      state.activeItemId = action.payload;
    },
    addService: (state, action) => {
      const service = normalizeService(action.payload);
      state.items.push(service);
      state.activeItemId = service.id;
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
    addLike: (state, action) => {
      const item = state.items.find((service) => service.id === action.payload);

      if (item) {
        item.likes += 1;
      }
    },
    toggleFavorite: (state, action) => {
      const item = state.items.find((service) => service.id === action.payload);

      if (item) {
        item.isFavorite = !item.isFavorite;
      }
    },
    addRating: (state, action) => {
      const { id, rating } = action.payload;
      const item = state.items.find((service) => service.id === id);
      const normalizedRating = normalizeRating(rating);

      if (item && normalizedRating !== null) {
        item.ratings.push(normalizedRating);
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
  addLike,
  toggleFavorite,
  addRating,
} = servicesSlice.actions;

export const selectServices = (state) => state.services.items;
export const selectActiveServiceId = (state) => state.services.activeItemId;

export default servicesSlice.reducer;
