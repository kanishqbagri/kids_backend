const fs = require('fs');

function loadJSONFromFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    const jsonData = JSON.parse(fileData);
    return jsonData;
  } catch (err) {
    console.error(`Error reading JSON data from file ${filePath}: ${err.message}`);
    return null;
  }
}
