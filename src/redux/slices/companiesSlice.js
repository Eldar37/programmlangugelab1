import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { companiesApi } from '../../services/companiesApi';
import { normalizeCompany } from '../../utils/companies';

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const getMessage = (error) => error?.message || 'Не удалось загрузить компании.';

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const companies = await companiesApi.getCompanies();
      return companies.map((company) => normalizeCompany(company));
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearCompaniesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || getMessage(action.error);
      });
  },
});

export const { clearCompaniesError } = companiesSlice.actions;

export const selectCompanies = (state) => state.companies.items;
export const selectCompaniesLoading = (state) => state.companies.loading;
export const selectCompaniesLoaded = (state) => state.companies.loaded;
export const selectCompaniesError = (state) => state.companies.error;
export const selectCompanyById = (state, id) =>
  state.companies.items.find((company) => Number(company.id) === Number(id)) || null;

export default companiesSlice.reducer;
