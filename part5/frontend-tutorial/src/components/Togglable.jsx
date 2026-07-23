import LoginForm from './LoginForm'
import { useState, useImperativeHandle } from 'react'

const Togglable = ( { ref, buttonLabel, children } ) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      {!isVisible && (
        <button type="button" onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      )}
      {isVisible && (
        <div>
          {children}
          <button type="button" onClick={toggleVisibility}>
            cancel
          </button>
        </div>
      )}
    </>
  )
}

export default Togglable
