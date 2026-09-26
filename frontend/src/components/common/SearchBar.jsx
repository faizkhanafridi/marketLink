import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import '../../styles/forms.css';

const SearchBar = ({
  placeholder = 'Search...',
  value: externalValue = '',
  onChange,
  onSearch,
  autoFocus = false,
  className = '',
}) => {
  const [term, setTerm] = useState(externalValue);
  const debounced = useDebounce(term, 400);

  useEffect(() => {
    setTerm(externalValue);
  }, [externalValue]);

  useEffect(() => {
    if (onSearch) onSearch(debounced);
    // eslint-disable-next-line
  }, [debounced]);

  const handleChange = (e) => {
    setTerm(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleClear = () => {
    setTerm('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`search-box ${className}`}>
      <i className="fas fa-search"></i>
      <input
        type="text"
        placeholder={placeholder}
        value={term}
        onChange={handleChange}
        autoFocus={autoFocus}
      />
      {term && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;