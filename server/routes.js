const {
    getHomePage,
    getWeatherForCityName,
    getWeatherForLatLon,
    getWeatherForZip,
} = require('./router');

module.exports = {
    '/': getHomePage,
    '/weather/city-name': getWeatherForCityName,
    '/weather/lat-lon': getWeatherForLatLon,
    '/weather/zip': getWeatherForZip,
};
