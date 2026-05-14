import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import CreatePostPage from '../pages/CreatePostPage';
import DashboardPage from '../pages/DashboardPage';
import DocumentationPage from '../pages/DocumentationPage';
import EditPostPage from '../pages/EditPostPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostsPage from '../pages/PostsPage';
import UsersPage from '../pages/UsersPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/new" element={<CreatePostPage />} />
        <Route path="posts/:postId/edit" element={<EditPostPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="documentation" element={<DocumentationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
