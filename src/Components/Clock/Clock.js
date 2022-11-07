import { useEffect, useState, useRef } from "react";
import Timer from "./Timer/Timer";
import "./Clock.css";
import Counter from "./Counter/Counter";

//default alarm sound
const alarm = new Audio(
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
);

const Clock = () => {
  //rest counter state
  const [rest, setRest] = useState(5);
  //initial rest counter state
  const [initialRest, setInitialRest] = useState(0);
  //session counter state
  const [session, setSession] = useState(25);
  //initial session counter state
  const [initialSession, setInitialSession] = useState(0);
  //counter state (for keeping track of current counter)
  const [counter, setCounter] = useState("session");
  //watch state (for keeping track of counter running)
  const [watch, setWatch] = useState(false);
  //seconds state
  const [seconds, setSeconds] = useState(59);
  //initialized state (for keeping track of timer intialized first time)
  const [initialized, setInitialized] = useState(false);
  //restart state(for keeping track of timeout)
  const [onBreak, setOnBreak] = useState(false);
  //restart state(for keeping track of restart button while on timeout)
  const [restart, setRestart] = useState(false);
  //restart state(for keeping track of pause button while on timeout)
  const [pause, setPause] = useState(true);
  //mute state (for keeping track of alarm sound)
  const [mute, setMute] = useState(false);

  //restart state ref for evaluating current value
  const restartRef = useRef();
  restartRef.current = restart;
  //pause state ref for evaluating current value
  const pauseRef = useRef();
  pauseRef.current = pause;
  //onBreak state ref for evaluating current value
  const onBreakRef = useRef();
  onBreakRef.current = onBreak;
  //seconds state ref for evaluating current value
  const secondsRef = useRef();
  secondsRef.current = seconds;

  //effect that triggers the seconds counter
  useEffect(() => {
    if (!watch) return;
    const secondInterval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(secondInterval);
  }, [watch]);

  //effect that evaluates current second value and updates the counter value
  useEffect(() => {
    if (seconds < 0) {
      setSeconds(59);
      if (watch && counter === "session") {
        setSession((prev) => prev - 1);
      }
      if (watch && counter === "rest") {
        setRest((prev) => prev - 1);
      }
    }
  }, [seconds, watch, counter]);

  //effect for switching between counters
  useEffect(() => {
    if (!watch) return;
    if (counter === "session" && session === 0 && seconds === 0) {
      setOnBreak(true);
      setWatch(false);
      alarm.play();
      if (restartRef.current) return;
      setTimeout(() => {
        if (secondsRef.current !== 0 || restartRef.current) {
          return;
        }
        setCounter("rest");
        setSession(initialSession - 1);
        setSeconds(59);
        if (pauseRef.current) {
          setOnBreak(false);
          return;
        }
        if (!onBreak.current) setWatch(true);
        setOnBreak(false);
      }, 3000);
    }
    if (counter === "rest" && rest === 0 && seconds === 0) {
      setOnBreak(true);
      setWatch(false);
      alarm.play();
      if (restartRef.current) return;
      setTimeout(() => {
        if (secondsRef.current !== 0 || restartRef.current) {
          return;
        }
        setCounter("session");
        setRest(initialRest - 1);
        setSeconds(59);
        if (pauseRef.current) {
          setOnBreak(false);
          return;
        }
        if (!onBreak.current) setWatch(true);
        setOnBreak(false);
      }, 3000);
    }
  }, [
    session,
    rest,
    counter,
    seconds,
    initialSession,
    initialRest,
    watch,
    restart,
    onBreak,
  ]);

  //effect that updates alarm volume
  useEffect(() => {
    alarm.volume = mute ? 0 : 1;
  }, [watch, mute]);

  //handle function for handleCount
  const handleBtn = (btn, count, counterSetter) => {
    if (btn === "increment") {
      if (count === 60) return;
      counterSetter((prev) => prev + 1);
      return;
    }
    if (btn === "decrement") {
      if (count === 1) return;
      counterSetter((prev) => prev - 1);
      return;
    }
  };
  //initialized state handler function
  const watchInitialized = (
    e,
    counter,
    counterSetter,
    otherCounter,
    initialValue,
    otherInitial
  ) => {
    if (!initialized) return;
    setInitialized(false);
    setCounter("session");
    setInitialSession(0);
    setInitialRest(0);
    if (e.target.id === "increment") {
      if (initialValue === 60) {
        counterSetter(60);
        otherCounter(otherInitial);
        return;
      }
      counterSetter(initialValue + 1);
      otherCounter(otherInitial);
      return;
    }
    if (e.target.id === "decrement") {
      if (counter === 0) {
        counterSetter(1);
        otherCounter(otherInitial);
        return;
      }
      counterSetter(initialValue - 1);
      otherCounter(otherInitial);
      return;
    }
  };

  //handle function for handle arrow buttons
  const handleCount = (e) => {
    const counter = e.target.parentNode.id;
    const btn = e.target.id;
    switch (counter) {
      case "session":
        if (initialized) {
          if (initialSession) setSeconds(59);
          watchInitialized(
            e,
            session,
            setSession,
            setRest,
            initialSession,
            initialRest
          );
          return;
        }
        handleBtn(btn, session, setSession);
        break;
      case "rest":
        if (initialized) {
          if (initialRest) setSeconds(59);
          watchInitialized(
            e,
            rest,
            setRest,
            setSession,
            initialRest,
            initialSession
          );
        }
        handleBtn(btn, rest, setRest);
        break;
      default:
        return;
    }
  };

  //handle function for play button
  const handlePlay = () => {
    setRestart(false);
    setPause(!pause);
    if (onBreak) return;
    setWatch(!watch);
    setInitialized(true);
    if (initialSession) return;
    setInitialSession(session);
    setInitialRest(rest);
    setSession((prev) => prev - 1);
    setRest((prev) => prev - 1);
  };

  //handle function for restart button
  const handleRestart = () => {
    alarm.volume = 0;
    alarm.pause();
    alarm.currentTime = 0;
    setOnBreak(false);
    setRestart(true);
    setPause(true);
    setWatch(false);
    setInitialized(false);
    setSession(25);
    setRest(5);
    setInitialSession(0);
    setInitialRest(0);
    setSeconds(59);
    setCounter("session");
  };

  //handle function for mute button
  const handleMute = () => setMute(!mute);

  return (
    <div className="clock">
      <div className="counters">
        <Counter
          value={rest}
          label="rest"
          onCount={handleCount}
          initial={initialRest}
          watch={watch}
        />
        <Counter
          value={session}
          label="session"
          onCount={handleCount}
          watcher={watchInitialized}
          initial={initialSession}
          watch={watch}
        />
      </div>
      <Timer
        session={session}
        rest={rest}
        seconds={seconds}
        counter={counter}
        onPlay={handlePlay}
        onRestart={handleRestart}
        watch={watch}
        pause={pause}
        initialSession={initialSession}
        initialRest={initialRest}
        mute={mute}
        onMute={handleMute}
      />
    </div>
  );
};

export default Clock;
