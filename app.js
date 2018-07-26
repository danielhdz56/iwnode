const request = require('request');
const path = require('path');
const fs = require('fs');

const listOfAddresses = [
  'SW SCHOLLS FERRY RD, # 102, 97007',
  '15112,SW CANYON WREN WAY, 97007',
  '15114,SW CANYON WREN WAY,97007',
  '15116,SW CANYON WREN WAY,97007',
  '15118,SW CANYON WREN WAY,97007',
  '15120,SW CANYON WREN WAY,97007',
  '14932,SW SCHOLLS FERRY RD,# 301,97007',
  '14754,SW SCHOLLS FERRY RD,# 1017,97007',
  '14339,SW BARROWS RD,97007',
  '45.4336087,14932,SW SCHOLLS FERRY RD,# 201,97007',
  '11950,SW HORIZON BLVD,97007'
];

(async function app() {
  try {
    const allData = await Promise.all(listOfAddresses.map(async (address)  => {
      const request = await makeRequest(address);
      console.log(request);
      return request;
    }));
    console.log('Finished logging all addresses');
    console.log(await writeToJson(allData));
  } catch (err) {
    console.log(err.message);
  }
})()

function makeRequest(address) {
  const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDtVbli-DqEY984NnMwLOyl2zh0ZaQZBRQ';
  return new Promise((resolve, reject) => {
    request(`${GOOGLE_API}&address=${address}`, { json: true }, (err, res, body) => {
      if (err) { reject(err); }
      const { formatted_address, geometry } = body.results[0];
      resolve({ formatted_address, ...geometry.location });
    });
  });
}

function writeToJson(data) {
  const location = path.resolve(__dirname, './address.json');
  return new Promise((resolve, reject) => {
    fs.writeFile(location, JSON.stringify(data), (err) => {
      err ? reject(err) : resolve(`Finished writing json file`);
    });
  });
}
