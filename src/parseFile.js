export const parseFile = async (file, numStrings) => {  // Added numStrings parameter
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const lines = fileContent.split("\n");
      const tablatureArray = [];
      let subarray = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          subarray.push(line);

          // Adjust condition based on the number of strings
          if (subarray.length === numStrings || i === lines.length - 1) {
            const tablatureLine = subarray.map((subLine) => {
              const chars = subLine.split("");
              const tablatureChars = [];

              for (let j = 0; j < chars.length; j++) {
                const char = chars[j];

                if (/[0-9]/.test(char)) {
                  let combinedDigits = char;
                  let nextChar = chars[j + 1];

                  while (/[0-9]/.test(nextChar)) {
                    combinedDigits += nextChar;
                    j++;
                    nextChar = chars[j + 1];
                  }

                  const parsedNumber = parseInt(combinedDigits);
                  if (parsedNumber >= 10 && parsedNumber <= 22) {
                    tablatureChars.push(parsedNumber.toString());
                    continue;
                  }
                }
                tablatureChars.push(char);
              }

              return tablatureChars.join("");
            });

            tablatureArray.push(tablatureLine);
            subarray = [];
          }
        }
      }

      resolve(tablatureArray);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

