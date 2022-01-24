// Functions for css styling
const previousWeatherToggle = document.querySelector(".show-previous-weather");
const previousWeather = document.querySelector(".previous-weather");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

//Get Element from html
const currentTempElement = document.querySelector("[data-current-temperature]");
const currentWeatherDescription = document.querySelector(
  "[data-weather-description]"
);
const currentDateElement = document.querySelector("[data-current-date]");
const currentHighTempElement = document.querySelector("[data-temp-high]");
const currentLowTempElement = document.querySelector("[data-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionArrow = document.querySelector(
  "[data-wind-direction-arrow]"
);
const windDirectionText = document.querySelector("[data-wind-direction-text]");
const currentCityElement = document.querySelector("[data-current-city]");

const previousWeatherTemplate = document.querySelector(
  "[data-previous-template"
);
const previousWeatherContainer = document.querySelector(
  "[data-previous-weather"
);

const unitToggle = document.querySelector("[data-unit-toggle]");
const celRadio = document.getElementById("cel");
const fahRadio = document.getElementById("fah");

// Apply API
const API_KEY = "3461d822f8f225e31a3e2cace0cd1d6e";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const urlToFetch = `${API_URL}?q=toronto&appid=${API_KEY}`;

const API_KEY_PRE = "5bc9d9f36e1a3fece07c7267522b4ca6";
const API_URL_PRE = "https://api.openweathermap.org/data/2.5/onecall";
const urlToFetchPre = `${API_URL_PRE}?lat=44&lon=-80&exclude=hourly,minutely,current,alerts&appid=${API_KEY}`;

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
        temp: data.main.temp,
        temp_max: data.main.temp_max,
        temp_min: data.main.temp_min,
        main_weather: data.weather[0].main,
        weather_description: data.weather[0].description,
        wind_speed: data.wind.speed,
        wind_degree: data.wind.deg,
        date: new Date(data.dt * 1000),
      };
      return info;
    });
};

const getPreviousWeather = async () => {
  return fetch(urlToFetchPre)
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
      const { lat, lon, timezone, timezone_offset, ...dailyData } = data;
      const previousWeather = [];
      dailyData.daily.forEach((object) => {
        const temp = {};
        temp.temp = object.temp.day;
        temp.temp_max = object.temp.max;
        temp.temp_min = object.temp.min;
        temp.main_weather = object.weather[0].main;
        temp.weather_description = object.weather[0].description;
        temp.date = new Date(object.dt * 1000);
        temp.wind_degree = object.wind_deg;
        temp.wind_speed = object.wind_speed;
        previousWeather.push(temp);
      });
      return previousWeather.splice(0, 7);
    });
};

getWeather().then((info) => {
  displayWeather(info);
  updateUnits();

  unitToggle.addEventListener("click", () => {
    let unitChecked = !isCel();
    celRadio.checked = unitChecked;
    fahRadio.checked = !unitChecked;
    updateUnits();
    displayWeather(info);
  });

  celRadio.addEventListener("change", () => {
    updateUnits();
    displayWeather(info);
  });

  fahRadio.addEventListener("change", () => {
    updateUnits();
    displayWeather(info);
  });
});

getPreviousWeather().then((data) => {
  displayPreviousWeather(data);
  updateUnits();

  unitToggle.addEventListener("click", () => {
    displayPreviousWeather(data);
    updateUnits();
  });

  celRadio.addEventListener("change", () => {
    updateUnits();
    displayPreviousWeather(data);
  });

  fahRadio.addEventListener("change", () => {
    updateUnits();
    displayPreviousWeather(data);
  });


  
});

function displayWeather(info) {
  currentTempElement.innerText = displayTemp(info.temp);
  currentWeatherDescription.innerText = info.weather_description;
  currentHighTempElement.innerText = displayTemp(info.temp_max);
  currentLowTempElement.innerText = displayTemp(info.temp_min);
  currentDateElement.innerText = displayDateTime(info.date);
  windSpeedElement.innerText = displaySpeed(info.wind_speed);
  windDirectionText.innerText = info.wind_degree + " deg";
  windDirectionArrow.style.setProperty("--direction", `${info.wind_degree}deg`);
}

function displayPreviousWeather(data) {
  previousWeatherContainer.innerText = "";
  data.forEach((dailyData, index) => {
    const dataContainer = previousWeatherTemplate.content.cloneNode(true);
    dataContainer.querySelector("[data-pre-date]").innerText = displayDate(
      dailyData.date
    );
    dataContainer.querySelector("[data-pre-description]").innerText =
      dailyData.main_weather;
    dataContainer.querySelector("[data-pre-temp-high]").innerText =
      displayTemp(dailyData.temp_max);
    dataContainer.querySelector("[data-pre-temp-low]").innerText =
      displayTemp(dailyData.temp_min);
    dataContainer
      .querySelector("[data-select-button]")
      .addEventListener("click", () => {
        displayWeather(data[index]);
      });
    previousWeatherContainer.appendChild(dataContainer);
  });
}

function displayDateTime(date) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleString("en-CA", options);
}

function displayDate(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleString("en-CA", options);
}

function displayTemp(temp) {
  let celTemp = temp - 273.15;
  let returnTemp = celTemp;
  if (!isCel()) {
    returnTemp = celTemp * (9 / 5) + 32;
  }
  return Math.round(returnTemp);
}

function displaySpeed(speed) {
  let returnSpeed = speed;
  if (!isCel()) {
    returnSpeed = speed / 1.609;
  }
  return returnSpeed.toFixed(2);
}

function updateUnits() {
  const speedUnit = document.querySelectorAll("[data-speed-unit]");
  const tempUnit = document.querySelectorAll("[data-temp-unit]");
  speedUnit.forEach((unit) => {
    unit.innerText = isCel() ? "kph" : "mph";
  });
  tempUnit.forEach((unit) => {
    unit.innerText = isCel() ? "C" : "F";
  });
}

function isCel() {
  return celRadio.checked;
}
