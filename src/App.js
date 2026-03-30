import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Header from './components/Header/Header';
import AuthPanel from './components/AuthPanel/AuthPanel';
import HomeContent from './components/HomeContent/HomeContent';
import { selectCurrentUser } from './features/auth/authSlice';
import { increment } from './features/counter/counterSlice';

function App() {
  const currentUser = useSelector(selectCurrentUser);
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        {currentUser ? (
          <>
            <section className="counter">
              <div>
                <p className="counter__caption">Тестовый Redux-счётчик</p>
                <div className="counter__value">{value}</div>
              </div>
              <button className="counter__button" onClick={() => dispatch(increment())}>
                Увеличить
              </button>
            </section>
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
