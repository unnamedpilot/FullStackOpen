import { useCounterControls } from "../State";

const Controls = () => {
  const { increment, decrement, reset } = useCounterControls()

  return (
    <div>
      <button type="button" onClick={increment}>
        plus
      </button>
      <button type="button" onClick={decrement}>
        minus
      </button>
      <button type="button" onClick={reset}>
        zero
      </button>
    </div>
  );
};

export default Controls;
