import React from 'react';

function InstrumentDropdown({ selectedInstrument, onSelectInstrument }) {
  const handleChange = (e) => {
    onSelectInstrument(e.target.value);
  };

  return (
    <div>
      <label htmlFor="instrument-dropdown">Choose Instrument: </label>
      <select id="instrument-dropdown" value={selectedInstrument} onChange={handleChange}>
        <option value="guitar">Guitar (6 strings)</option>
        <option value="bass">Bass (4 strings)</option>
      </select>
    </div>
  );
}

export default InstrumentDropdown;
