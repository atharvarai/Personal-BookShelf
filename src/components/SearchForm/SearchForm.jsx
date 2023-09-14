import React, { useRef, useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import './SearchForm.css';

const SearchForm = () => {
  const { setSearchTerm, setResultTitle, searchResults, setSearchResults } = useGlobalContext();
  const searchText = useRef('');
  const navigate = useNavigate();
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    // Add event listener to document for clicks
    const handleClickOutside = (e) => {
      if (searchText.current && !searchText.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempSearchTerm = searchText.current.value.trim();
    if (tempSearchTerm.replace(/[^\w\s]/gi, '').length === 0) {
      setSearchTerm('Harry Potter');
      setResultTitle('Please Enter Something ...');
    } else {
      setSearchTerm(tempSearchTerm);
    }
    navigate('/book');
  };

  const handleInputChange = (e) => {
    const query = e.target.value.trim();
    if (query) {
      // Update search query in context
      setSearchTerm(query);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleResultClick = (id) => {
    // Handle clicking on a search result item
    navigate(`/book/${id.replace("/works/", "")}`);
    setShowSearchResults(false); // Close the dropdown after clicking
  };

  return (
    <div className="search-form">
      <div className="container">
        <div className="search-form-content">
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-form-elem flex flex-sb bg-white">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Book Name"
                ref={searchText}
                onChange={handleInputChange}
              />
              <button type="submit" className="flex flex-c" onClick={handleSubmit}>
                <FaSearch className="text-mint" size={32} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Display real-time search results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="real-time-results">
          <ul className="real-time-list">
            {searchResults.slice(0, 4).map((result) => (
              <li key={result.id} onClick={() => handleResultClick(result.id)}>
                <Link to={`/book/${result.id.replace("/works/", "")}`}>{result.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
