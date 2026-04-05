const ListDisplay = ({ persons, deleteObject }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} - {person.number}
            <button onClick={() => deleteObject(person)}>delete</button>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default ListDisplay