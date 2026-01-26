import { useDispatch, useSelector } from 'react-redux';
import { increment } from './features/counter/counterSlice';

function App() {
  const value = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>{value}</div>
      <button onClick={() => dispatch(increment())}>Увеличить</button>
    </div>
  );
}

export default App;