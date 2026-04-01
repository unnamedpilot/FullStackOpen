const ListDisplay = ({ persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>{person.name} - {person.number}</li>
        ))}
      </ul>
    </div>
  )
}

export default ListDisplay