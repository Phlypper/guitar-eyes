import React, { useState, useRef, useEffect } from "react";
import Upload from "./Upload";
import { parseFile } from "./parseFile";
import DataGrid from "./DataGrid";
import ColumnDropdown from "./ColumnDropdown";
import InfoSection from "./InfoSection";
import InstrumentDropdown from "./InstrumentDropdown";

function App() {
  const [tablature, setTablature] = useState([]);
  const [numColumns, setNumColumns] = useState(1);
  const [isMultiColumnNav, setIsMultiColumnNav] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState("guitar");
  const gridRefs = useRef([]);

  useEffect(() => {
    if (gridRefs.current.length > 0) {
      gridRefs.current[0].focus();
    }
  }, [tablature]);

  const handleFileUpload = async (file) => {
    const numStrings = selectedInstrument === "guitar" ? 6 : 4;  // Determine number of strings based on selected instrument
    try {
      const tablatureArray = await parseFile(file, numStrings);  // Pass numStrings to parseFile
      setTablature(tablatureArray);
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  const handleDropdownChange = (value) => setNumColumns(value);
  const handleCheckboxChange = () => setIsMultiColumnNav(!isMultiColumnNav);
  const toggleInfoSection = () => setIsInfoOpen(!isInfoOpen);
  const handleInstrumentChange = (instrument) => setSelectedInstrument(instrument);

  const handleKeyDown = (e, gridIndex) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const nextIndex = e.shiftKey ? (gridIndex - 1 + gridRefs.current.length) % gridRefs.current.length : (gridIndex + 1) % gridRefs.current.length;
      gridRefs.current[nextIndex].focus();
    }
  };

  return (
    <div>
      <h1><strong>Guitar Eyes for Mac - The Guitar Tablature reader for the Visually Impaired Guitarist</strong></h1>
      <section>
        <button onClick={toggleInfoSection} aria-label={isInfoOpen ? "Close info section" : "Open info section"}>
          {isInfoOpen ? "Close info section" : "Open info section"}
        </button>
        {isInfoOpen && <InfoSection />}
      </section>
      <Upload onFileUpload={handleFileUpload} />
      <InstrumentDropdown selectedInstrument={selectedInstrument} onSelectInstrument={handleInstrumentChange} />
      <div>
        <input type="checkbox" checked={isMultiColumnNav} onChange={handleCheckboxChange} />
        <label htmlFor="multi-column">Multi-Column Navigation</label>
      </div>
      <ColumnDropdown 
        value={numColumns} 
        numOptions={tablature.length > 0 ? tablature[0][0].length : 1} 
        onChange={handleDropdownChange} 
      />
      {tablature.map((subarray, index) => (
        <div key={index} ref={(el) => (gridRefs.current[index] = el)} tabIndex={index === 0 ? 0 : -1} onKeyDown={(e) => handleKeyDown(e, index)}>
          <h2>Tablature {index + 1}</h2>
          <DataGrid data={subarray} numColumns={numColumns} isMultiColumnNav={isMultiColumnNav} setNumColumns={setNumColumns} selectedInstrument={selectedInstrument} />
        </div>
      ))}
    </div>
  );
}

export default App;
