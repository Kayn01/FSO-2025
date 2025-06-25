import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good * 100) / all;

  if (all > 0) {
    return (
      <div>
        <table>
          <tr>
            <StatisticLine text="good" value={good} />
          </tr>
          <tr>
            <StatisticLine text="neutral" value={neutral} />
          </tr>
          <tr>
            <StatisticLine text="bad" value={bad} />
          </tr>
          <tr>
            <StatisticLine text="all" value={all} />
          </tr>
          <tr>
            <StatisticLine text="average" value={average} />
          </tr>
          <tr>
            <StatisticLine text="positive" value={positive} />
          </tr>
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    );
  }
};

const StatisticLine = ({ text, value }) => {
  if (text == "positive") {
    return (
      <>
        <td>{text}</td>
        <td>{value} %</td>
      </>
    );
  } else {
    return (
      <>
        <td>{text}</td>
        <td>{value}</td>
      </>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClick = (value) => {
    const handler = () => {
      if (value == "good") {
        setGood(good + 1);
      } else if (value == "neutral") {
        setNeutral(neutral + 1);
      } else {
        setBad(bad + 1);
      }
    };
    return handler;
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleClick("good")} text={"good"} />
      <Button onClick={handleClick("neutral")} text={"neutral"} />
      <Button onClick={handleClick("bad")} text={"bad"} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
