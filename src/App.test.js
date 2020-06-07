import React from 'react';
import { render, screen, waitForElementToBeRemoved, waitForElement } from '@testing-library/react';
import App, { getGeolocation } from './App';

it('handles geolocation success', async () => {
    // Setup
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce(
            (onSuccess) => (Promise.resolve(onSuccess({ coords: { latitude: 111, longitude: 222 } })))
        ),
    };
    expect.assertions(1);

    // Assertions
    await expect(getGeolocation()).resolves.toEqual({ lat: 111, lon: 222 });
});

it('handles geolocation failure', async () => {
    // Setup
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce(
            (onSuccess, onError) => (Promise.resolve(onError({ error: 'msg' })))
        ),
    };
    expect.assertions(1);

    // Assertions
    try { await getGeolocation(); }
    catch (e) { expect(e).toEqual({ error: 'msg' }); }
});

it('renders with no weather', async () => {
    // Setup
    const data = { error: '404' };
    global.fetch = jest.fn().mockImplementationOnce(
        () => (Promise.resolve({ json: () => (Promise.resolve(data)) }))
    );
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce(
            (onSuccess, onError) => (Promise.resolve(onError({ error: '404' })))
        ),
    };
    render(<App/>);

    // Assertions
    expect(screen.queryByText('Searching for weather data...')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => (screen.queryByText('Searching for weather data...')));
    await waitForElement(() => (screen.queryByText('City not found.')));
});

it('renders with weather', async () => {
    // Setup
    const data = {
        city: 'test-city',
        error: null,
        iconUrl: 'https://openweathermap.org/img/wn/04d@2x.png',
        main: 'Cloudy',
        state: 'test-state',
        temp: 998.99,
        timestamp: 1560350645,
    };
    global.fetch = jest.fn().mockImplementationOnce(
        () => (Promise.resolve({ json: () => (Promise.resolve(data)) }))
    );
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce(
            (onSuccess) => (Promise.resolve(onSuccess({ coords: { latitude: 111, longitude: 222 } })))
        ),
    };
    render(<App/>);

    // Assertions
    expect(screen.queryByText('Searching for weather data...')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => (screen.queryByText('Searching for weather data...')));
    await waitForElement(() => (screen.queryByText('test-city, TEST-STATE')));
    expect(screen.queryByText('999')).toBeInTheDocument();
    expect(screen.queryByText('Wednesday 10:44 AM')).toBeInTheDocument();
});


// TODO: add more tests for the inputs