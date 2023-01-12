import "../../styles/form/Search.css";

const Search = ({ className, handleChange }) => {
  return (
    <div className={`search-bar flex middle ${className}`}>
      <div className="search-icon flex middle">
        <svg>
          <use href="#search-icon" />
        </svg>
      </div>
      <input placeholder="Search" />
    </div>
  );
};

export default Search;
