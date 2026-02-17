// Header takes care of rendering the name of the course
const Header = ({title}) => {
  return (
  <>
    <h1>{title}</h1>
  </>
  )
}

const Part = ({part_name, exercises_amount}) => {
  const increaseExerciseAmount = () => exercises_amount+=1

  return (
    <>
    <li>{part_name} {exercises_amount}</li>
    <button onClick={increaseExerciseAmount}>Increase</button>
    </>
  )
}

// Content renders the parts and their number of exercises
const Content = ({content}) => {
  return(
    <>
      <ul>
        {content.map(({part_name, exercises_amount}) => 
        <Part 
          part_name={part_name} 
          exercises_amount={exercises_amount}/>)}
      </ul>
    </>
  )
}

// Total renders the total number of exercises.
const Total = ({content}) => {
  const total_num = content.reduce((accumulator, {exercises_amount}) => accumulator+exercises_amount, 0)

  return (
    <>
    <p>Number of exercises {total_num}</p>
    </>
  )
}

const App = () => {
  const course = {
    name : 'Half Stack application development',
    parts : [
      {
        part_name : "Fundamentals of React", 
        exercises_amount : 10
      },
      {
        part_name : "Using props to pass data", 
        exercises_amount : 7
      },
      {
        part_name : "State of a component", 
        exercises_amount : 14
      },
      
    ]
  }

  return (
    <div>
      <Header title={course.name}/>
      <Content content={course.parts}/>
      <Total content={course.parts}/>
    </div>
  )
}

export default App