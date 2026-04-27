import { useEffect, useState } from "react"
import axios from "axios"
import CountriesList from "./components/CountriesList"
import CountryProfile from "./components/CountryProfile"


/**
 * 1. Get all the data in the use Effect, change the countriesList component to get only the names in the list
 * 2. Make a call to the API once we get only one country in the list.
 */

const App = () => {
  const [ countriesField, setCountriesField ] = useState("")
  const [ countriesList, setCountriesList] = useState([])

  useEffect(() => {
    console.log("Entered in useEffect")
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      const newCountryList = response.data.map(country => ({
          name: country.name.common,
          capital: country.capital === undefined ? [] : country.capital,
          area: country.area,
          languages: Object.values(country.languages === undefined ? {} : country.languages),
          flagImg: country.flags.png
        }))
      setCountriesList(newCountryList)
    })
    
    
  }, [])

  const handleFieldChange = (event) => {
    setCountriesField(event.target.value)
  } 


  const countriesListFiltered = countriesField.length > 0 
    ? countriesList.filter(country => 
      country
        .name
        .toLowerCase()
        .includes(countriesField.toLowerCase()))
    : []

  const countriesListNames = countriesListFiltered.map(country => country.name)


  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>
          find countries
          <input type="text" value={countriesField} onChange={handleFieldChange}/>
        </label>
      </form>
      {countriesListFiltered.length === 1
      ? <CountryProfile countryInfo={countriesListFiltered[0]}/>
      : <CountriesList countriesList={countriesListNames}/> 
      }
             
    </div>
    

  )
}

export default App