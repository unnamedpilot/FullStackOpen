import LoginForm from './LoginForm'
import { useState, useImperativeHandle } from 'react'

const Togglable = ({ ref, buttonLabel, children }) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const hideWhenVisible = { display: isVisible ? 'none' : '' }
  const showWhenVisible = { display: isVisible ? '' : 'none' }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      <button type="button" onClick={toggleVisibility} style={hideWhenVisible}>
        {buttonLabel}
      </button>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </>
  )
  /*
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
  )*/
}

export default Togglable
