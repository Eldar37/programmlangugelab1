import { useSelector } from 'react-redux';
import './App.css';
import Header from './components/Header/Header';
import AuthPanel from './components/AuthPanel/AuthPanel';
import HomeContent from './components/HomeContent/HomeContent';
import TodoBoard from './components/TodoBoard/TodoBoard';
import { selectCurrentUser } from './features/auth/authSlice';

function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        {currentUser ? (
          <>
            <TodoBoard />
            <HomeContent />
          </>
        ) : (
          <AuthPanel />
        )}
      </main>
    </div>
  );
}

export default App;
