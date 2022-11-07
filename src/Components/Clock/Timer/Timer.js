import "./Timer.css";

const styles = {
  session: "#a7c957",
  rest: "#e76f51",
};

const Timer = ({
  session,
  rest,
  seconds,
  counter,
  onPlay,
  onRestart,
  watch,
  pause,
  initialSession,
  initialRest,
  mute,
  onMute,
}) => {
  return (
    <div className="timer">
      <div className="display" style={{ borderColor: styles[counter] }}>
        <h3 style={{ color: styles[counter] }}>
          {!watch
            ? counter === "session"
              ? session <= 0 && seconds === 0
                ? "Session Ended"
                : "Session"
              : rest <= 0 && seconds === 0
              ? "Rest Ended"
              : "Rest"
            : counter === "session"
            ? "Session Running"
            : "Rest Running"}
        </h3>
        <div className="spans" style={{ color: styles[counter] }}>
          <span>
            {counter === "session"
              ? pause && session === initialSession - 1 && seconds === 59
                ? initialSession
                : session < 1
                ? "00"
                : session < 10
                ? `0${session}`
                : session
              : pause && rest === initialRest - 1 && seconds === 59
              ? initialRest
              : rest < 1
              ? "00"
              : rest < 10
              ? `0${rest}`
              : rest}
          </span>
          <span>:</span>
          <span>
            {watch
              ? seconds < 10
                ? `0${seconds}`
                : seconds
              : seconds !== 59
              ? seconds < 10
                ? `0${seconds}`
                : seconds
              : "00"}
          </span>
        </div>
      </div>
      <div className="buttons">
        <button onClick={onPlay}>
          {pause ? (
            <i className="fa-solid fa-play"></i>
          ) : (
            <i className="fa-solid fa-pause"></i>
          )}
        </button>
        <button onClick={onRestart}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
        <button onClick={onMute}>
          <i
            className="fa-solid fa-volume-xmark"
            style={{ color: !mute ? "#fefae025" : "#fefae0" }}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default Timer;
