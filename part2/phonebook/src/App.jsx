import { useEffect, useState } from 'react'
import Forms from './components/Forms'
import ListDisplay from './components/ListDisplay'
import SearchField from './components/SearchField'
import phonebookService from './services/phonebookService'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchValue, setSearchValue ] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState(null)
  const [ errorState, setErrorState] = useState(false)


  useEffect(() => {    
    phonebookService
      .getAll()
      .then(data => setPersons(data))
  },
  [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const showNotification = (message, errorStatus) => {
    
    setNotificationMessage(message)
    setErrorState(errorStatus)
    setTimeout(() => setNotificationMessage(null), 5000)
  }

  const addPerson = (personObject) => {
    phonebookService
        .create(personObject)
        .then(data => {
          setPersons(persons.concat(data))
          showNotification(`The person "${data.name}" was added successfully`, false)
        })

      setNewName("")
      setNewNumber("")

  }

  const handleExistingPerson = (submittedPerson, currentPerson) => {
    const confirm_message = `${currentPerson.name} already exists, but the number you registered is different. Do you want to replace the number?`
    
    if(currentPerson.number != submittedPerson.number && window.confirm(confirm_message)) {
          const id = currentPerson.id
          phonebookService
            .update(id, submittedPerson)
            .then(data => { 
              setPersons(persons.map(person => person.id === data.id ? data : person))
              showNotification(`The person ${data.name} was replaced successfully`, false)})
            .catch(() => showNotification(`The person you are trying to modify doesn't exist`, true))
      }
  }


  const handleSubmitPerson = () => {
    const personObject = {
      name: newName, 
      number: newNumber,
    }

    const found = persons.find((person) => person.name === newName)
    
    if (!found) {
      addPerson(personObject)
    }
    else {
      handleExistingPerson(personObject, found)
    }
    
  }


  const handleSearchPerson = (event) => {
    setSearchValue(event.target.value)
  }


  const deleteObject = (object) => {
    const id = object.id
    if(window.confirm(`Are you sure you want to delete "${object.name}"`)) {
      phonebookService
        .remove(id)
        .then(() => showNotification(`The person "${object.name}" with id ${id} was removed correctly`), false)
        .catch(() => showNotification(`The person with id ${id} doesn't exist`), true)
        .finally(setPersons(persons.filter(person => person.id != id)))
    }
    
  }
  

  const filteredPersons = searchValue.length > 0
    ? persons.filter((person) => person.name.includes(searchValue))
    : persons

  

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} errorStatus={errorState} />

      <SearchField 
      searchValue={searchValue}
      onSearchChange={handleSearchPerson}
      />
      <Forms
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmitPerson={handleSubmitPerson} 
      />
      
      <ListDisplay persons={filteredPersons} deleteObject={deleteObject}/>
      
    </div>
  )
}

export default App