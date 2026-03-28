import { useState } from "react"

const History = ({allClicks}) => {
  return (
    <p>
      {allClicks.length === 0 ? "the app is used by pressing buttons" : allClicks.join(' ')}
    </p>
  )
}

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>{text}</button>
  )
}


const App = () => {
  const [ left, setLeft ] = useState(0)
  const [ right, setRight ] = useState(0)
  const [ allClicks, setAllClicks ] = useState([])
  const [ total, setTotal ] = useState(0)

  const handleRightClick = () => {
    const updatedRight = right+1
    setRight(updatedRight)
    setAllClicks(allClicks.concat('R'))
    setTotal(updatedRight + left)
  }

  const handleLeftClick = () => {
    const updatedLeft = left+1
    setLeft(updatedLeft)
    setAllClicks(allClicks.concat('L'))
    setTotal(right + updatedLeft)
  }
  return (
    <>
      {left}
      <Button handleClick={handleLeftClick} text="left"/>
      <Button handleClick={handleRightClick} text="right"/>
      {right}
      <p>{total}</p>
      <History allClicks = {allClicks}/>
    </>
  )

}

export default App
