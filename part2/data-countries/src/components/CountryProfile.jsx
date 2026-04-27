const CapitalComponent = ({ capitalList }) => {
    return (
        <>
        {capitalList.length > 0
        ? capitalList.length > 1
            ? <>
                Capitals
                <ul>
                    {capitalList.map((capital) => <li key={capital}>{capital}</li>)}
                </ul>
            </>
            : `Capital ${capitalList[0]}`
        : "There is not a defined Capital for this country"}
        </>
    )
}

const CountryProfile = ({ countryInfo }) => {

    const name = countryInfo.name
    const capital = countryInfo.capital
    const area = countryInfo.area
    const languages = countryInfo.languages
    const flagUrl = countryInfo.flagImg
     
    return (
        <div>
            <h1>{name}</h1>
                <CapitalComponent capitalList={capital}/>
                <div>Area {area}</div>
            <h2>Languages</h2>
            <ul>
                {languages.map(lang => <li key={lang}>{lang}</li>)}
            </ul>
            <img src={flagUrl}/>
        </div>
    )
}

export default CountryProfile