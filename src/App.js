import React, { useEffect, useState } from 'react';
import './App.css';

const BASE_WEATHER_URL = 'http://localhost:8080/weather';
const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

/**
 * Gets the browser geolocation
 * @returns {Promise.<{lat: Number, lon: Number}>}
 */
const getGeolocation = () => (
    new Promise((resolve, reject) => {
        // If allowed to query for device location
        if (navigator.geolocation) {
            // Try to get user geolocation
            navigator.geolocation.getCurrentPosition(
                // SUCCESS callback
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },

                // ERROR callback
                (error) => {
                    reject(error);
                }
            );
        }
    })
);

function App() {
    // Create containers for weather and location data
    const [
        weather,
        setWeather,
    ] = useState(null);
    const [
        city,
        setCity,
    ] = useState('Atlanta, GA');
    const [
        latLon,
        setLatLon,
    ] = useState([34, -84.46]);
    const [
        zip,
        setZip,
    ] = useState(10101);

    // Create common handler for weather fetch errors
    const handleFetchError = (e) => {
        setWeather({ error: '404' });
    };

    // Create common handler for weather fetch requests
    const fetchWeather = (url) => {
        fetch(url)
            .then((data) => (data.json()))
            .then((data) => { setWeather(data); })
            .catch(handleFetchError);
    };

    // Make a call to get local weather on component 'mount'
    useEffect(() => {
        // Get user geolocation
        getGeolocation()
            // Handle successful geolocation
            .then(({ lat, lon }) => {
                // Get weather for geolocation
                fetchWeather(`${BASE_WEATHER_URL}/lat-lon?lat=${lat}&lon=${lon}`);
            })
            // Handle geolocation permission denied
            .catch(handleFetchError);
    }, []);

    // Create container to hold display date
    let displayDate = '';

    // When the weather data has been loaded
    if (weather) {
        // Generate and set date display parts
        const date = weather && new Date(weather.timestamp * 1000);
        const dow = daysOfWeek[date.getDay()];
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${hours <= 12 ? hours : hours - 12}:${minutes < 10 ? `0${minutes}` : minutes}`;
        const ampm = `${hours < 12 ? 'A' : 'P'}M`;
        displayDate = `${dow} ${time} ${ampm}`;
    }

    return (
        <section className="app">
            <h2 className="c-heading">Weather Conditions</h2>

            <div>
                <p>By City Name (and State or Country)</p>
                <input
                    onChange={ (e) => {
                        setCity(e.target.value);
                    } }
                    type="text"
                    value={ city } />
                <button
                    onClick={ () => {
                        fetchWeather(`${BASE_WEATHER_URL}/city-name?cityName=${encodeURIComponent(city)}`);
                    } }>
                    Get Weather
                </button>
            </div>

            <div>
                <p>By Lat/Lon</p>
                <input
                    onChange={ (e) => {
                        setLatLon([e.target.value, latLon[1]]);
                    } }
                    placeholder="latitude"
                    type="number"
                    value={ latLon[0] } />
                <input
                    onChange={ (e) => {
                        setLatLon([latLon[0], e.target.value]);
                    } }
                    placeholder="longitude"
                    type="number"
                    value={ latLon[1] } />
                <button
                    onClick={ () => {
                        fetchWeather(`${BASE_WEATHER_URL}/lat-lon?lat=${encodeURIComponent(latLon[0])}&lon=${encodeURIComponent(latLon[1])}`);
                    } }>
                    Get Weather
                </button>
            </div>

            <div>
                <p>By Zip Code</p>
                <input
                    onChange={ (e) => {
                        setZip(e.target.value);
                    } }
                    type="number"
                    value={ zip } />
                <button
                    onClick={ () => {
                        fetchWeather(`${BASE_WEATHER_URL}/zip?zip=${encodeURIComponent(zip)}`);
                    } }>
                    Get Weather
                </button>
            </div>

            { !weather &&
                <p className="c-message">Searching for weather data...</p>
            }
            { (weather && weather.error === '404') &&
                <p className="c-message">City not found.</p>
            }
            { (weather && !weather.error) &&
                <div className="c-weather-area">
                    <div className="c-weather-bug">
                        { (weather.city || weather.state) &&
                            <p>{ `${weather.city}${(weather.city && weather.state) ? ', ' : ''}${weather.state ? weather.state.toUpperCase() : ''}` }</p>
                        }
                        { displayDate &&
                            <p>{ displayDate }</p>
                        }
                        { weather.main &&
                            <p>{ weather.main }</p>
                        }
                        <div className="c-weather-bug__content">
                            { weather.iconUrl &&
                                <img
                                    alt={ weather.description || weather.main }
                                    src={ weather.iconUrl } />
                            }
                            <span>
                                <span className="c-weather-bug__temp">
                                    { (!!weather.temp && Math.round(weather.temp)) || 0 }
                                </span>
                                <span className="is-top-aligned">
                                    <span className="is-top-aligned">&deg;</span>
                                    <sup>F</sup>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            }
        </section>
    );
}

export default App;
export {
    getGeolocation,
};
