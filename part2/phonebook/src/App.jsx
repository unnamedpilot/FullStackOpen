import { useState } from 'react'
import Forms from './components/Forms'
import ListDisplay from './components/ListDisplay'
import SearchField from './components/SearchField'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchValue, setSearchValue ] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = () => {
    const personObject = {
      name: newName, 
      number: newNumber,
      id: persons.length+1
    }
    const found = persons.find((person) => person.name === newName)
    
    if (!found) {
      setPersons((prevPersons) => prevPersons.concat(personObject))
      setNewName("")
      setNewNumber("")

    }
    else {
      window.alert("This thing already exists, fuck off")
    }
    
  }  

  const handleSearchPerson = (event) => {
    setSearchValue(event.target.value)
  }

  const filteredPersons = searchValue.length > 0
    ? persons.filter((person) => person.name.includes(searchValue))
    : persons

  

  return (
    <div>
      <h2>Phonebook</h2>

      <SearchField 
      searchValue={searchValue}
      onSearchChange={handleSearchPerson}
      />

      <Forms
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmitPerson={addName} 
      />
      <ListDisplay persons={filteredPersons}/>
      
    </div>
  )
}

export default App