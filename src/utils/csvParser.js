const fs = require('fs');
const { parse } = require('csv-parse');
const { promisify } = require('util');

const parseFile = promisify(parse);

async function parseAndValidate(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = await parseFile(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map((record, index) => {
    if (!record['Product Name'] || !record['Input Image Urls']) {
      throw new Error(`Invalid data in row ${index + 1}`);
    }

    return {
      serialNumber: index + 1,
      productName: record['Product Name'],
      inputImageUrls: record['Input Image Urls']
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0)
    };
  });
}

module.exports = { parseAndValidate };