import React, { useState, useRef, useEffect } from "react";
import { Table, Tbody, Tr, Td } from "@chakra-ui/react";

function DataGrid({ data, numColumns, isMultiColumnNav, setNumColumns, selectedInstrument }) {
  const tableRef = useRef(null);
  const cells = useRef([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    cells.current = Array.from(tableRef.current.querySelectorAll("td"));
  }, [data]);

  const handleKeyDown = (e) => {
    if (isMultiColumnNav) {
      handleMultiColumnNavKeyDown(e);
    } else {
      handleSingleColumnNavKeyDown(e);
    }
  };

  const handleSingleColumnNavKeyDown = (e) => {
    if (e.key === "ArrowUp" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateSingleColumnVertical(-1);
    } else if (e.key === "ArrowDown" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateSingleColumnVertical(1);
    } else if (e.key === "ArrowLeft" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateSingleColumnHorizontal(-1);
    } else if (e.key === "ArrowRight" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateSingleColumnHorizontal(1);
    } else if (e.key === "Tab") {
      handleTabKey(e);
    }
  };

  const handleMultiColumnNavKeyDown = (e) => {
    if (e.key === "ArrowUp" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateMultiColumnVertical(-1);
    } else if (e.key === "ArrowDown" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateMultiColumnVertical(1);
    } else if (e.key === "ArrowLeft" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateMultiColumnHorizontal(-1);
    } else if (e.key === "ArrowRight" && e.ctrlKey && e.altKey) {
      e.preventDefault();
      navigateMultiColumnHorizontal(1);
    } else if (e.key === "ArrowLeft" && e.ctrlKey && e.metaKey && e.shiftKey) {
      e.preventDefault();
      navigateMultiColumnGroup(-1);
    } else if (e.key === "ArrowRight" && e.ctrlKey && e.metaKey && e.shiftKey) {
      e.preventDefault();
      navigateMultiColumnGroup(1);
    } else if (e.key === "=" && e.ctrlKey && e.metaKey && e.shiftKey) {
      e.preventDefault();
      extendMultiColumnGroup(1);
    } else if (e.key === "-" && e.ctrlKey && e.metaKey && e.shiftKey) {
      e.preventDefault();
      extendMultiColumnGroup(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      readMultiColumnGroupContents();
    } else if (e.key === "Tab") {
      handleTabKey(e);
    }
  };

  const navigateSingleColumnVertical = (direction) => {
    const currentCell = document.activeElement;
    const currentIndex = cells.current.indexOf(currentCell);
    const numRows = data.length;
    const numColumnsInGroup = Math.min(numColumns, data[0].length);

    const targetIndex = (currentIndex + direction * numColumnsInGroup + numRows * numColumnsInGroup) % (numRows * numColumnsInGroup);
    const targetCell = cells.current[targetIndex];
    if (targetCell) {
      targetCell.focus();
    }
  };

  const navigateSingleColumnHorizontal = (direction) => {
    const currentCell = document.activeElement;
    const currentIndex = cells.current.indexOf(currentCell);
    const numColumnsInGroup = Math.min(numColumns, data[0].length);

    const targetIndex = (currentIndex + direction + numColumnsInGroup) % numColumnsInGroup === 0
      ? currentIndex - numColumnsInGroup + direction
      : currentIndex + direction;

    const targetCell = cells.current[targetIndex];
    if (targetCell) {
      targetCell.focus();
    }
  };

  const navigateMultiColumnVertical = (direction) => {
    const currentCell = document.activeElement;
    const currentIndex = cells.current.indexOf(currentCell);
    const numColumnsInGroup = Math.min(numColumns, data[0].length);

    const currentRow = Math.floor(currentIndex / numColumnsInGroup);
    const currentColumn = currentIndex % numColumnsInGroup;

    const newRow = (currentRow + direction + data.length) % data.length;
    const targetIndex = newRow * numColumnsInGroup + currentColumn;
    const targetCell = cells.current[targetIndex];

    if (targetCell) {
      targetCell.focus();
    }
  };

  const navigateMultiColumnHorizontal = (direction) => {
    const currentCell = document.activeElement;
    const currentIndex = cells.current.indexOf(currentCell);
    const numColumnsInGroup = Math.min(numColumns, data[0].length);

    const currentRow = Math.floor(currentIndex / numColumnsInGroup);
    const newColumn = (currentIndex % numColumnsInGroup + direction + numColumnsInGroup) % numColumnsInGroup;
    const targetIndex = currentRow * numColumnsInGroup + newColumn;
    const targetCell = cells.current[targetIndex];

    if (targetCell) {
      targetCell.focus();
    }
  };

  const navigateMultiColumnGroup = (direction) => {
    const numColumnsInGroup = Math.min(numColumns, data[0].length);
    const numGroups = Math.ceil(data[0].length / numColumnsInGroup);

    const newGroupIndex = (currentGroupIndex + direction + numGroups) % numGroups;
    const targetIndex = newGroupIndex * numColumnsInGroup * data.length; // Adjusted to target the correct group
    const targetCell = cells.current[targetIndex];
    if (targetCell) {
      targetCell.focus();
    }

    setCurrentGroupIndex(newGroupIndex);
  };

  const handleTabKey = (e) => {
    const currentIndex = cells.current.findIndex(
      (cell) => cell === document.activeElement
    );
    const isShiftPressed = e.shiftKey;
    if (isShiftPressed) {
      if (currentIndex === 0) {
        e.preventDefault();
        tableRef.current.focus();
      }
    } else {
      if (currentIndex === cells.current.length - 1) {
        e.preventDefault();
        tableRef.current.focus();
      }
    }
  };

  const combineAdjacentDigits = (line) => {
    const combinedLine = [];

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (/[0-9]/.test(char)) {
        let combinedDigits = char;
        let nextChar = line[i + 1];

        while (/[0-9]/.test(nextChar)) {
          combinedDigits += nextChar;
          i++;
          nextChar = line[i + 1];
        }

        const parsedNumber = parseInt(combinedDigits);
        if (parsedNumber >= 10 && parsedNumber <= 22) {
          combinedLine.push(parsedNumber.toString());
        } else {
          combinedLine.push(combinedDigits);
        }
      } else {
        combinedLine.push(char);
      }
    }

    return combinedLine;
  };

  const getGridData = () => {
    const numRows = selectedInstrument === "bass" ? 4 : 6;
    const dataToDisplay = data.slice(0, numRows);

    if (isMultiColumnNav && numColumns) {
      const gridData = [];
      const rows = dataToDisplay.length;
      const start = currentGroupIndex * numColumns;
      const end = Math.min(start + numColumns, dataToDisplay[0].length);

      for (let i = 0; i < rows; i++) {
        const line = dataToDisplay[i];
        const gridRow = [];

        for (let j = start; j < end; j++) {
          const char = line[j];
          if (/[0-9]/.test(char)) {
            let combinedDigits = char;
            let nextChar = line[j + 1];

            while (j + 1 < end && /[0-9]/.test(nextChar)) {
              combinedDigits += nextChar;
              j++;
              nextChar = line[j + 1];
            }

            const parsedNumber = parseInt(combinedDigits);
            if (parsedNumber >= 10 && parsedNumber <= 22) {
              gridRow.push(parsedNumber.toString());
            } else {
              gridRow.push(combinedDigits);
            }
          } else {
            gridRow.push(char);
          }
        }

        gridData.push(gridRow);
      }

      return gridData;
    } else {
      return dataToDisplay.map((line) => combineAdjacentDigits(line));
    }
  };

  const extendMultiColumnGroup = (direction) => {
    const updatedNumColumns = numColumns + direction;
    setNumColumns(updatedNumColumns);
  };

  const readMultiColumnGroupContents = () => {
    const groupContents = [];
    const gridData = getGridData();

    for (let col = 0; col < gridData[0].length; col++) {
      groupContents.push(`Column ${col + 1}`);
      for (let row = 0; row < gridData.length; row++) {
        const line = gridData[row][col];
        const combinedLine = combineAdjacentDigits(line);
        groupContents.push(...combinedLine);
      }
    }

    let currentIndex = 0;
    let isReading = true;
    const utterance = new SpeechSynthesisUtterance();

    utterance.onend = () => {
      currentIndex++;
      if (isReading && currentIndex < groupContents.length) {
        utterance.text = groupContents[currentIndex];
        synthRef.current.speak(utterance);
      }
    };

    utterance.text = groupContents[currentIndex];
    synthRef.current.speak(utterance);

    const stopReading = () => {
      isReading = false;
      synthRef.current.cancel();
    };

    // Listen for the 'Escape' key to stop reading
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        stopReading();
      }
    });
  };

  return (
    <Table variant="striped" colorScheme="teal" onKeyDown={handleKeyDown} tabIndex={0} ref={tableRef} role="grid">
      <Tbody>
        {getGridData().map((gridRow, rowIndex) => (
          <Tr key={rowIndex} role="row">
            {gridRow.map((line, lineIndex) => {
              const combinedLine = combineAdjacentDigits(line, isMultiColumnNav);

              return (
                <React.Fragment key={lineIndex}>
                  {combinedLine.map((char, colIndex) => (
                    <Td key={colIndex} tabIndex={0} role="gridcell">
                      <span>{char}</span>
                    </Td>
                  ))}
                </React.Fragment>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default DataGrid;
