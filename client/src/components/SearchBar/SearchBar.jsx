import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import styles from './SearchBar.module.css';

const SearchBar = ({ role, placeholder = 'Поиск по пациентам...', onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const url = role === 'admin' ? '/admin/search' : '/doctor/search';
      const response = await axiosInstance.get(`${url}?q=${encodeURIComponent(trimmed)}`);
      if (response.data.success) {
        setResults(response.data.patients || []);
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (patient) => {
    if (onSelect) {
      onSelect(patient);
    }
  };

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>
      {results.length > 0 && (
        <div className={styles.results}>
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.resultItem}
              onClick={() => handleSelect(p)}
            >
              <span className={styles.petName}>{p.name}</span>
              <span className={styles.owner}>
                {p.ownerName} {p.ownerPhone && `(${p.ownerPhone})`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

