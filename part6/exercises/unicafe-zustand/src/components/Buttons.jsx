import { useFeedbackActions } from "../State";

const Buttons = () => {
  const { incrementGood, incrementNeutral, incrementBad } =
    useFeedbackActions();
  return (
    <div>
      <h2>give feedback</h2>
      <button type="button" onClick={incrementGood}>
        good
      </button>
      <button type="button" onClick={incrementNeutral}>
        neutral
      </button>
      <button type="button" onClick={incrementBad}>
        bad
      </button>
    </div>
  );
};

export default Buttons;
