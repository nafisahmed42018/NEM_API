const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
  
    // Optionnal depending of the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBMXTGA2ghpqQhWPpOljx0w35GJUUNDaP8', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
