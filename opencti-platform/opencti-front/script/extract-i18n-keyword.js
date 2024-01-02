const fs = require('fs');
const util = require('util');
const path = require('path');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const srcDirectory = 'src';
const englishTranslationFiles = 'lang/en.json';
const searchPattern = /\{t\('[^']+'\)}/g;
const extractedValues = {};
const jsxTsxFileExtensions = ['.jsx', '.tsx'];

function extractValueFromPattern(pattern) {
  const match = /\{t\('([^']+)'\)\}/.exec(pattern);
  return match ? match[1] : null;
}

async function extractI18nValues(directory) {
  try {
    const files = await readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        await extractI18nValues(filePath); // Recursively call the function for directories
      } else if (stats.isFile() && jsxTsxFileExtensions.includes(path.extname(filePath))) {
        const data = await readFile(filePath, 'utf8');
        const matches = data.match(searchPattern);
        
        console.log(filePath);
        console.log(matches);
        
        if (matches) {
          matches.forEach(match => {
            const value = extractValueFromPattern(match);
            if (value) {
              extractedValues[value] = value;
            }
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function main() {
  await extractI18nValues(srcDirectory);
  
  try {
    await writeFile(englishTranslationFiles, JSON.stringify(extractedValues, null, 2));
    console.log('File written successfully');
  } catch (error) {
    console.error(`Error writing to en.json: ${error.message}`);
  }
}

main();
