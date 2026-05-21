import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchJobs,
  selectJobsLoaded,
  selectJobsLoading,
} from '../redux/slices/jobsSlice';
import {
  fetchCompanies,
  selectCompaniesLoaded,
  selectCompaniesLoading,
} from '../redux/slices/companiesSlice';

export function useInitialData() {
  const dispatch = useAppDispatch();
  const jobsLoaded = useAppSelector(selectJobsLoaded);
  const jobsLoading = useAppSelector(selectJobsLoading);
  const companiesLoaded = useAppSelector(selectCompaniesLoaded);
  const companiesLoading = useAppSelector(selectCompaniesLoading);

  useEffect(() => {
    if (!jobsLoaded && !jobsLoading) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobsLoaded, jobsLoading]);

  useEffect(() => {
    if (!companiesLoaded && !companiesLoading) {
      dispatch(fetchCompanies());
    }
  }, [dispatch, companiesLoaded, companiesLoading]);
}
