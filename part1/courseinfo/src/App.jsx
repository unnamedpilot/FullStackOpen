// Header takes care of rendering the name of the course
const Header = (props) => {
  return (
  <>
    <h1>{props.title}</h1>
  </>
  )
}

const Part = (props) => {
  return (
    <>
    <p>{props.part_name} {props.exercises_amount}</p>
    </>
  )
}

// Content renders the parts and their number of exercises
const Content = (props) => {
  return(
    <>
      {props.content.map((part) => (
        <Part part_name={part.part_name} exercises_amount={part.exercises_amount} />)
      )}
    </>
  )
}

// Total renders the total number of exercises.
const Total = (props) => {
  return(
    <>
      <p>
        Number of exercises {props.content.reduce((accumulator, current) => accumulator + current.exercises_amount, 0)}
      </p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const content = [
    {part_name : "Fundamentals of React", exercises_amount : 10},
    {part_name : "Using props to pass data", exercises_amount : 7},
    {part_name : "State of a component", exercises_amount : 14}
  ]

  return (
    <div>
      <Header title={course}/>
      <Content content={content}/>
      <Total content={content}/>
    </div>
  )
}

export default App