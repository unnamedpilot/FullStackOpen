const SearchField = ({ searchValue, onSearchChange }) => {
  
  return(
    <div>
      <h3>Search Filter</h3>
      <input type="text" value={searchValue} onChange={onSearchChange}/>
    </div>
  )
}

export default SearchField