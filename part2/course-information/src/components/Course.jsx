const Header = ({ title }) => {
    return ( <h1>{title}</h1> )
}

const Part = ({ info }) => {
    return (
        <p>{info.name} {info.exercises}</p>
    )
}

const Content = ({ content }) => {
    const total_exercises = content
        .map((part) => part.exercises)
        .reduce((
            (accumulator, currentPart) => accumulator + currentPart
        ), 0)

    return (
        <div>
            {content.map((part) => <Part key={part.id} info = {part}/> )}
            <p>
                <strong>Total of {total_exercises} exercises</strong>
            </p>
        </div>
    )
    
}


const Course = ({ course }) => {
    return(
        <>
        <Header title={course.name} />
        <Content content={course.parts}/>
        </>
    )
}

export default Course