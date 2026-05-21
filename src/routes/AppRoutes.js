import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import CompaniesPage from '../pages/CompaniesPage';
import CreateJobPage from '../pages/CreateJobPage';
import DashboardPage from '../pages/DashboardPage';
import DocumentationPage from '../pages/DocumentationPage';
import EditJobPage from '../pages/EditJobPage';
import JobsPage from '../pages/JobsPage';
import NotFoundPage from '../pages/NotFoundPage';
import SavedJobsPage from '../pages/SavedJobsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/new" element={<CreateJobPage />} />
        <Route path="jobs/:jobId/edit" element={<EditJobPage />} />
        <Route path="saved" element={<SavedJobsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="documentation" element={<DocumentationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
