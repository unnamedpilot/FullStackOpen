const Forms = ({newName, newNumber, onNameChange, onNumberChange, onSubmitPerson}) => {

  return(
    <div>
      <h3>Phonebook Forms</h3>
      <form onSubmit={(event) => event.preventDefault()}>
        <div>
          name: <input value={newName} onChange={onNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={onSubmitPerson}>add</button>
        </div>
      </form>
    </div>
  )
}

export default Forms