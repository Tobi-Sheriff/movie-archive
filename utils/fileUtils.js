const fs = require('fs');

async function _read_file (filePath) {
    const emptyListJson = JSON.stringify([]);
    try {
      // If the file exists, read its content
      const content = await fs.promises.readFile(filePath, 'utf8');

      // Check if the file is empty
      if (content.trim() === '') {
        // console.log('File is empty, returning an empty list');
        await fs.promises.writeFile(filePath, emptyListJson);
        return emptyListJson;
      }

      // File exists and is not empty, return the content
      return content;
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File does not exist, create it
        // console.log('File does not exist, creating a new one');
        await fs.promises.writeFile(filePath, emptyListJson);
        return emptyListJson;
      } else if (err.code === 'EPERM') {
        console.error('Error accessing file:', err);
        throw err;
      } else {
        // Other errors
        console.error('Error accessing file:', err);
        console.error(err.stack)
        throw err;
      }
    }
  }

  module.exports.readJson = async (filePath) => {
    const data = await _read_file(filePath);
    return JSON.parse(data);
  }