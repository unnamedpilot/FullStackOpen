import { useState } from "react";

const Button = ({ handleClick, text}) => {
  return (
    <>
    <button onClick={handleClick}>{text}</button>
    </>
  )
}

const StatisticLine = (props) => {
  const text = props.text
  const value = props.value

  return (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
  )
}

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad

  const all = good+neutral+bad
  const average = (good*1 + neutral*0 + bad*(-1))/all
  const percent_positive_feedback = (good/all)*100

    return (
    <>
    <h1>statistics</h1>
      {all === 0 ? (
        <div>No feedback given</div>
      ) : (
        <table>
          <thead>
            <StatisticLine text="good" value={good}/>
            <StatisticLine text="neutral" value={neutral}/>
            <StatisticLine text="bad" value={bad}/>
            <StatisticLine text="all" value={all}/>
            <StatisticLine text="average" value={average}/>
            <StatisticLine text="positive" value={percent_positive_feedback}/>
          </thead>
          
        </table>
      )}      
    </>
    )
}

const App = () => {
  const [ good, setGood ] = useState(0)
  const [ neutral, setNeutral ] = useState(0)
  const [ bad, setBad ] = useState(0)

  return (
    <>
    <h1>give feedback</h1>
    <Button handleClick={() => setGood(good+1)} text="good" />
    <Button handleClick={() => setNeutral(neutral+1)} text="neutral" />
    <Button handleClick={() => setBad(bad+1)} text="bad" />
    <Statistics good={good} neutral={neutral} bad = {bad}/>
    </>
  )

}

export default App