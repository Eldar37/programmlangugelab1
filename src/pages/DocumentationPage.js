import PageHeader from '../components/PageHeader';

function DocumentationPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Documentation"
        title="Project explanation"
        text="This page is a short in-app reference. The printable five-page documentation is stored in docs/project-documentation.md."
      />

      <section className="panel docs">
        <div>
          <h2>Redux architecture</h2>
          <p>
            The store is configured in src/redux/store.js. Posts and users have separate slices in
            src/redux/slices. Components read data with useSelector and start actions with useDispatch
            through small hooks in src/hooks.
          </p>
        </div>
        <div>
          <h2>Async flow</h2>
          <ul>
            <li>fetchPosts sends GET /posts and fills the post list.</li>
            <li>createPost sends POST /posts and adds a local item to the top of the list.</li>
            <li>updatePost sends PUT /posts/:id for API posts and updates local posts in the same thunk.</li>
            <li>deletePost sends DELETE /posts/:id for API posts and removes the item from Redux.</li>
          </ul>
        </div>
        <div>
          <h2>Application states</h2>
          <p>
            Loading, error, and empty states are displayed on dashboard, posts, create, edit, and authors pages.
            Search and author filters are stored in Redux so UI state is predictable.
          </p>
        </div>
      </section>
    </div>
  );
}

export default DocumentationPage;
