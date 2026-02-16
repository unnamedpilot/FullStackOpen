const Hello = (props) => {
  console.log(props)
  return (
    <>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </>
  )
}

const App = () => {
  const name = "Antonia"
  const age = 31

  return(
    <>
     <Hello name="Sol Naranja" age="17"/>
     <Hello name={name} age={age} />
    </>
  )
}

export default App