import { useState, useImperativeHandle } from 'react'

export default function Toggable ({ buttonLabel, children, ref }) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return(<>
    {!isVisible && (
      <button type="button" onClick={toggleVisibility}>{buttonLabel}</button>
    )}
    {isVisible && (
      <div>
        {children}
        <button type="button" onClick={toggleVisibility}>cancel</button>
      </div>
    )}
  </>)
}