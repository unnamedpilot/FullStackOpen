import {useState} from 'react'

const Display = ({counter}) => <><p>{counter}</p></>

const Button = ({onClick, text}) => {
  return (
    <>
    <button onClick={onClick}>
      {text}
    </button>
    </>
  )
}



const App = () => {
  const [counter, setCounter] = useState(0)
  const increaseByOne = () => setCounter(counter+1)
  const resetToZero = () => setCounter(0)
  const decreaseByOne = () => setCounter(counter-1)

  return (
    <>
      <Display counter={counter}/>
      <Button onClick={increaseByOne} text="Increase"/>
      <Button onClick={resetToZero} text="Reset"/>
      <Button onClick={decreaseByOne} text="Decrease"/>
    </>
  )
}

export default App