import React from 'react';
import styles from './SearchBar.module.css';

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Cement',  label: 'Cement & Concrete' },
  { value: 'Sand',    label: 'Sand & Fill' },
  { value: 'Granite', label: 'Granite & Stone' },
  { value: 'Blocks',  label: 'Blocks & Masonry' },
  { value: 'Iron',    label: 'Iron & Steel' },
  { value: 'Tiles',   label: 'Tiles & Flooring' },
  { value: 'Timber',  label: 'Timber & Wood' },
  { value: 'Roofing', label: 'Roofing' },
  { value: 'Paint',   label: 'Paints' },
];

function SearchBar({ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter }) {
  return (
    <div className={styles.bar}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search cement, iron rods, tiles, timber..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <select
        className={styles.select}
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
      >
        {categoryOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button className={styles.btn}>Search</button>
    </div>
  );
}

export default SearchBar;
