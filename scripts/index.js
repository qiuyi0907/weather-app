// Functions for css styling
const previousWeatherToggle = document.querySelector(".show-previous-weather");

const previousWeather = document.querySelector(".previous-weather");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

//Get Element from html
const currentTempElement = document.querySelector('[data-current-temperature]');
const currentWeatherDescription = document.querySelector('[data-weather-description]');
const currentDateElement = document.querySelector('[data-current-date]');
const currentHighTempElement = document.querySelector('[data-temp-high]');
const currentLowTempElement = document.querySelector('[data-temp-low]');
const windSpeedElement = document.querySelector('[data-wind-speed]');
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const currentCityElement = document.querySelector('[data-current-city]');

// Apply API
const API_KEY = "3461d822f8f225e31a3e2cace0cd1d6e";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const urlToFetch = `${API_URL}?q=toronto&appid=${API_KEY}`;

const getWeather = async () => {
  return fetch(urlToFetch)
    .then(
      (response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request failed!");
      },
      (networkError) => {
        console.log(networkError.message);
      }
    )
    .then((data) => {
      const info = {
          city: data.name,
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          main_weather: data.weather[0].main,
          weather_description: data.weather[0].description,
          wind_speed: data.wind.speed,
          wind_degree: data.wind.deg,
          date: new Date(data.dt * 1000)
      }
      return info;
    });
};

getWeather().then(info => {
    displayWeather(info)
});

function displayWeather(info) {
    currentCityElement.innerText = info.city;
    currentTempElement.innerText = displayCelsiusTemp(info.temp);
    currentWeatherDescription.innerText = info.weather_description;
    currentHighTempElement.innerText = displayCelsiusTemp(info.temp_max);
    currentLowTempElement.innerText = displayCelsiusTemp(info.temp_min);
    currentDateElement.innerText = displayDate(info.date);
    windSpeedElement.innerText = info.wind_speed;
    windDirectionText.innerText = info.wind_degree + ' deg';
    windDirectionArrow.style.setProperty('--direction', `${info.wind_degree}deg`)
    console.log(windDirectionText.innerText)
}

function displayDate(date) {
    const options = {
        weekday: 'short', 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
        hour: 'numeric', 
        minute: 'numeric',
    }
    return date.toLocaleString('en-CA', options)
}

function displayCelsiusTemp(temp) {
    return Math.round(temp - 272.15);
}