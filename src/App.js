import Header from './components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { increment } from './features/counter/counterSlice';
import './App.css';

function App() {
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="app">
      <Header />
      <main className="counter">
        <div className="counter__value">{value}</div>
        <button className="counter__button" onClick={() => dispatch(increment())}>
          Увеличить
        </button>
      </main>
    </div>
  );
}

export default App;
