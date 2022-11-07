import "./Counter.css";

const Counter = ({ value, label, onCount, initial, watch }) => {
  return (
    <div className="counter">
      <div className="icons-counter" id={label}>
        <button
          onClick={onCount}
          id="increment"
          disabled={!watch ? false : true}
        >
          <i className="fa-sharp fa-solid fa-circle-arrow-up"></i>
        </button>
        <h3>{!initial ? value : initial}</h3>
        <button
          onClick={onCount}
          id="decrement"
          disabled={!watch ? false : true}
        >
          <i className="fa-sharp fa-solid fa-circle-arrow-down"></i>
        </button>
      </div>
      <h2>{label} length</h2>
    </div>
  );
};

export default Counter;
