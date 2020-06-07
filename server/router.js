// Import dependencies
const url = require('url');
const WeatherSDK = require('./WeatherSDK');
const generateHTML = require('./generateHTML');

// Create method to send a json response
const sendJson = (data, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

// Create method to send an error response
const sendError = (err, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(JSON.stringify(err));
}

/**
 * Filters weather data for basic data points
 * @param {Array.<Weather>} weather
 * @returns {Promise.<Object>}
 */
const processWeather = (weather, state = '') => {
    let weatherData = {};

    if (weather.cod === '404' || (weather.cod && weather.message)) {
        weatherData = {
            description: 'City not found.',
            error: '404',
        };
    }
    else if (weather.weather && weather.weather.length) {
        const {
            description,
            icon,
            main,
        } = weather.weather[0];
        weatherData = {
            city: weather.name,
            description,
            error: null,
            iconUrl: `${WeatherSDK.BASE_ICON_URL}${icon}${WeatherSDK.BASE_ICON_SUFFIX}`,
            main,
            state,
            timestamp: weather.dt,
            ...weather.main,
        };
    }

    return weatherData;
};

// Create route handlers
module.exports = {
    getHomePage: (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(generateHTML());
    },

    getWeatherForCityName: (req, res) => {
        const { query } = url.parse(req.url, true);
        const { cityName } = query;
        const [
            city,
            state,
        ] = cityName.split(',');
        WeatherSDK.getCurrentWeatherForCityName(city, state, 'us')
            .then((weather) => (processWeather(weather, state) ))
            .then((data) => { sendJson(data, res); })
            .catch((err) => { sendError(err, res); });
    },

    getWeatherForLatLon: (req, res) => {
        const { query } = url.parse(req.url, true);
        const { lat, lon } = query;
        WeatherSDK.getCurrentWeatherForLatLng(lat, lon)
            .then(processWeather)
            .then((data) => { sendJson(data, res); })
            .catch((err) => { sendError(err, res); });
    },

    getWeatherForZip: (req, res) => {
        const { query } = url.parse(req.url, true);
        const { zip, country = 'us' } = query;
        WeatherSDK.getCurrentWeatherForZip(zip, country)
            .then(processWeather)
            .then((data) => { sendJson(data, res); })
            .catch((err) => { sendError(err, res); });
    },
};
