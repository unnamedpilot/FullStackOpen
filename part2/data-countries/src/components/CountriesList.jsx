const CountriesList = ({ countriesList }) => {
    return(
        <div>
            {countriesList.length > 10 
            ? "Too many matches, specify another filter"
            : <ul>{countriesList.map((country) => <li key={country}>{country}</li>)}</ul>
            }
        </div>
    )
}

export default CountriesList