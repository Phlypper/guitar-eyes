import React from 'react';

function ColumnDropdown({ value, numOptions, onChange }) {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <label htmlFor="column-dropdown">Number of Columns: </label>
      <select id="column-dropdown" value={value} onChange={handleChange}>
        {[...Array(numOptions)].map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ColumnDropdown;
