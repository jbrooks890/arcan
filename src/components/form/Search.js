const Search = ({ className, handleChange }) => {
  return (
    <div className={`search-bar flex middle ${className}`}>
      <div>
        <svg>
          <use href="#search-icon" />
        </svg>
      </div>
      <input />
    </div>
  );
};

export default Search;
