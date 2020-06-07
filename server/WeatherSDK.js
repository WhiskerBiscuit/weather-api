const https = require('https');
const BEARER_TOKEN = 'ADD_APPID_TOKEN';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const BASE_ICON_URL = 'https://openweathermap.org/img/wn/';
const BASE_ICON_SUFFIX = '@2x.png';

/**
 * @typedef {Object} Coordinate
 * @property {Number} lat - City geo location, latitude
 * @property {Number} lon - City geo location, longitude
 * 
 * @typedef {Object} WeatherBase - more info Weather condition codes
 * @property {Number} id - Weather condition id
 * @property {String} main - Group of weather parameters (Rain, Snow, Extreme etc.)
 * @property {String} description - Weather condition within the group. You can get the output in your language.
 * @property {String} icon - Weather icon id
 * 
 * @typedef {Object} WeatherMain
 * @property {Number} temp - Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
 * @property {Number} feels_like - Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
 * @property {Number} temp_min - Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
 * @property {Number} temp_max - Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
 * @property {Number} pressure - Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa
 * @property {Number} humidity - Humidity, %
 * @property {Number} sea_level - Atmospheric pressure on the sea level, hPa
 * @property {Number} grnd_level - Atmospheric pressure on the ground level, hPa
 * 
 * @typedef {Object} WeatherWind
 * @property {Number} deg - Wind direction, degrees (meteorological)
 * @property {Number} speed - Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
 *
 * @typedef {Object} WeatherSys
 * @property {Number} type - Internal parameter
 * @property {Number} id - Internal parameter
 * @property {Number} message - Internal parameter
 * @property {String} country - Country code
 * @property {Number} sunrise - Sunrise time, unix, UTC
 * @property {Number} sunset - Sunset time, unix, UTC
 * 
 * @typedef {Object} Weather
 * @property {Coordinate} coord - Weather location data
 * @property {Array.<WeatherBase>} weather - Basic weather data
 * @property {String} base - Internal parameter
 * @property {WeatherMain} main - Main weather data
 * @property {Number} visibility - Visibility, meter
 * @property {WeatherWind} wind - Wind data
 * @property { { all: Number } } clouds - Cloudiness, %
 * @property { { 1h: Number, 3h: Number } } rain - Rain volume for the last 1/3 hours, mm
 * @property { { 1h: Number, 3h: Number } } snow - Snow volume for the last 1/3 hours, mm
 * @property {Number} dt - Time of data calculation, unix, UTC
 * @property {WeatherSys} sys - Additional weather data
 * @property {Number} timezone - Shift in seconds from UTC
 * @property {Number} id - City ID
 * @property {String} name - City name
 * @property {Number} cod - Internal parameter
 */

/**
 * Gets the current weather for a given set of parameters
 * @param {String} params
 * @returns {Promise.<Weather>}
 */
const getCurrentWeather = (params) => (
	new Promise((resolve, reject) => {
		https.get(`${BASE_URL}?APPID=${BEARER_TOKEN}&units=imperial&${params}`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', (err) => {
            reject(err);
        });
	})
);

/**
 * Requests weather for a given city name
 * @param {String} cityName
 * @param {String} [state]
 * @param {String} [country]
 * @returns {Promise.<Weather>}
 */
const getCurrentWeatherForCityName = (cityName, state, country = 'us') => (
	getCurrentWeather(`q=${cityName}${state ? `,${state}` : ''},${country}`)
);

/**
 * Requests weather for a given city latitude and longitude
 * @param {Number} lat
 * @param {Number} lon
 * @returns {Promise.<Weather>}
 */
const getCurrentWeatherForLatLng = (lat = 0, lon = 0) => (
    getCurrentWeather(`lat=${lat}&lon=${lon}`)
);

/**
 * Requests weather for a given city name
 * @param {String} zip
 * @param {String} [country]
 * @returns {Promise.<Weather>}
 */
const getCurrentWeatherForZip = (zip, country = 'us') => (
    getCurrentWeather(`zip=${zip},${country}`)
);

module.exports = {
    BASE_ICON_URL,
    BASE_ICON_SUFFIX,
    getCurrentWeather,
    getCurrentWeatherForCityName,
    getCurrentWeatherForLatLng,
    getCurrentWeatherForZip,
};
