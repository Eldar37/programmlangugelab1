import Header from './components/Header/Header';
import HomeContent from './components/HomeContent/HomeContent';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from './features/counter/counterSlice';
import './App.css';

function App() {
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <section className="counter">
          <div className="counter__value">{value}</div>
          <button className="counter__button" onClick={() => dispatch(increment())}>
            Увеличить
          </button>
        </section>
        <HomeContent />
      </main>
    </div>
  );
}

export default App;
