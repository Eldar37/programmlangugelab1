import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { jobsApi } from '../../services/jobsApi';
import {
  createClientId,
  isRemoteJobId,
  normalizeJob,
  normalizeNote,
  wait,
} from '../../utils/jobs';

const initialFilters = {
  search: '',
  companyId: 'all',
  status: 'all',
  workFormat: 'all',
  savedOnly: false,
};

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  submitting: false,
  deletingIds: [],
  error: null,
  filters: initialFilters,
  lastSync: null,
};

const getMessage = (error) => error?.message || 'Запрос не выполнен. Попробуйте еще раз.';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const jobs = await jobsApi.getJobs();
    return jobs.map((job) => normalizeJob(job));
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const createJob = createAsyncThunk('jobs/createJob', async (values, { rejectWithValue }) => {
  try {
    const payload = normalizeJob({
      ...values,
      id: undefined,
      companyId: Number(values.companyId),
      userId: Number(values.companyId),
    });

    const response = await jobsApi.createJob({
      userId: payload.companyId,
      title: payload.title,
      body: payload.description,
    });

    return normalizeJob({
      ...payload,
      ...response,
      id: createClientId(),
      isLocal: true,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, changes }, { getState, rejectWithValue }) => {
    try {
      const currentJob = selectJobById(getState(), id);

      if (!currentJob) {
        return rejectWithValue('Вакансия не найдена.');
      }

      const nextJob = normalizeJob({
        ...currentJob,
        ...changes,
        id,
        companyId: Number(changes.companyId ?? currentJob.companyId),
        updatedAt: new Date().toISOString(),
      });

      if (isRemoteJobId(id)) {
        await jobsApi.updateJob(id, {
          id: Number(id),
          userId: nextJob.companyId,
          title: nextJob.title,
          body: nextJob.description,
        });
      } else {
        await wait(250);
      }

      return nextJob;
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  }
);

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id, { rejectWithValue }) => {
  try {
    if (isRemoteJobId(id)) {
      await jobsApi.deleteJob(id);
    } else {
      await wait(250);
    }

    return id;
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setCompanyFilter: (state, action) => {
      state.filters.companyId = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setWorkFormatFilter: (state, action) => {
      state.filters.workFormat = action.payload;
    },
    setSavedFilter: (state, action) => {
      state.filters.savedOnly = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    clearJobsError: (state) => {
      state.error = null;
    },
    toggleJobSaved: (state, action) => {
      const job = state.items.find((item) => String(item.id) === String(action.payload));

      if (job) {
        job.saved = !job.saved;
        job.updatedAt = new Date().toISOString();
      }
    },
    setJobStatus: (state, action) => {
      const job = state.items.find((item) => String(item.id) === String(action.payload.id));

      if (job) {
        job.status = action.payload.status;
        job.updatedAt = new Date().toISOString();
      }
    },
    addJobNote: (state, action) => {
      const job = state.items.find((item) => String(item.id) === String(action.payload.jobId));

      if (job && action.payload.text.trim()) {
        job.notes.unshift(
          normalizeNote({
            id: createClientId(),
            text: action.payload.text,
            createdAt: new Date().toISOString(),
          })
        );
        job.updatedAt = new Date().toISOString();
      }
    },
    updateJobNote: (state, action) => {
      const job = state.items.find((item) => String(item.id) === String(action.payload.jobId));
      const note = job?.notes.find((item) => String(item.id) === String(action.payload.noteId));

      if (note && action.payload.text.trim()) {
        note.text = action.payload.text.trim();
        note.updatedAt = new Date().toISOString();
        job.updatedAt = new Date().toISOString();
      }
    },
    deleteJobNote: (state, action) => {
      const job = state.items.find((item) => String(item.id) === String(action.payload.jobId));

      if (job) {
        job.notes = job.notes.filter((note) => String(note.id) !== String(action.payload.noteId));
        job.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || getMessage(action.error);
      })
      .addCase(createJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || getMessage(action.error);
      })
      .addCase(updateJob.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.items.findIndex((job) => String(job.id) === String(action.payload.id));

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || getMessage(action.error);
      })
      .addCase(deleteJob.pending, (state, action) => {
        state.error = null;
        state.deletingIds.push(String(action.meta.arg));
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter((item) => item !== String(action.payload));
        state.items = state.items.filter((job) => String(job.id) !== String(action.payload));
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter((item) => item !== String(action.meta.arg));
        state.error = action.payload || getMessage(action.error);
      });
  },
});

export const {
  addJobNote,
  clearJobsError,
  deleteJobNote,
  resetFilters,
  setCompanyFilter,
  setJobStatus,
  setSavedFilter,
  setSearchFilter,
  setStatusFilter,
  setWorkFormatFilter,
  toggleJobSaved,
  updateJobNote,
} = jobsSlice.actions;

export const selectJobsState = (state) => state.jobs;
export const selectJobs = (state) => state.jobs.items;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsLoaded = (state) => state.jobs.loaded;
export const selectJobsSubmitting = (state) => state.jobs.submitting;
export const selectJobsError = (state) => state.jobs.error;
export const selectJobDeletingIds = (state) => state.jobs.deletingIds;
export const selectJobsFilters = (state) => state.jobs.filters;
export const selectJobById = (state, id) =>
  state.jobs.items.find((job) => String(job.id) === String(id)) || null;

export const selectFilteredJobs = createSelector([selectJobs, selectJobsFilters], (jobs, filters) => {
  const search = filters.search.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search) ||
      job.description.toLowerCase().includes(search) ||
      job.stack.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search);
    const matchesCompany =
      filters.companyId === 'all' || Number(job.companyId) === Number(filters.companyId);
    const matchesStatus = filters.status === 'all' || job.status === filters.status;
    const matchesFormat = filters.workFormat === 'all' || job.workFormat === filters.workFormat;
    const matchesSaved = !filters.savedOnly || job.saved;

    return matchesSearch && matchesCompany && matchesStatus && matchesFormat && matchesSaved;
  });
});

export const selectSavedJobs = createSelector([selectJobs], (jobs) => jobs.filter((job) => job.saved));

export const selectJobStats = createSelector([selectJobs], (jobs) => ({
  total: jobs.length,
  saved: jobs.filter((job) => job.saved).length,
  active: jobs.filter((job) => ['applied', 'screening', 'interview'].includes(job.status)).length,
  interviews: jobs.filter((job) => job.status === 'interview').length,
  offers: jobs.filter((job) => job.status === 'offer').length,
  notes: jobs.reduce((count, job) => count + job.notes.length, 0),
}));

export default jobsSlice.reducer;
