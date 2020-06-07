# Open Weather Map API Results
This project is designed to showcase an OpenWeatherMap.org search API call and display some of the resulting data.
The application will query for the user location permission to get local conditions.
There are also inputs to query the weather API in various ways.

## Prerequisites
- It is assumed that a recent version of Node.js is installed on your machine.
- A valid OpenWeatherMap.org API `APPID` token will be required.

## Setup and Execution
- Clone this repo to a folder on your local machine.
- Run `npm install` from the project root to install necessary dependencies.
- Run the `build` NPM script to build a production bundle to the `./build` folder.
- Open `./server/WeatherSDK.js` and on line `2` replace `ADD_APPID_TOKEN` with a valid OpenWeatherMap.org API APPID token string.
  - See https://openweathermap.org/appid for more information on creating a token.
- Run `node server.js` from the project root to start the web server.  This will serve the static production files in the `./build` folder.
- Open a web browser to `http://localhost:8080` to load the application which will automatically call out to get local weather conditions if the permission is allowed.

## Browser Support
Tested on Chrome, Edge and Firefox (sorry Safari).

## Tests
Run the `test` NPM script to execute unit tests.
