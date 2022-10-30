// Functions for css styling
const previousWeatherToggle = document.querySelector(".show-previous-weather");
const previousWeather = document.querySelector(".previous-weather");
const hiddenWeather = document.querySelectorAll(".display-hide");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

hiddenWeather.forEach((hidenElement) => {
  previousWeatherToggle.addEventListener("click", () => {
    if (hidenElement.classList.contains("display-hide")) {
      hidenElement.classList.remove("display-hide");
    } else {
      hidenElement.classList.add("display-hide");
    }
  });
});

// Get Element from html
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
const API_URL_PRE = "https://api.openweathermap.org/data/2.5/forecast";

const mainTitle = document.querySelector(".main-title");
const cityChangeBtn = document.querySelector(".city-change-btn");

const getWeather = async () => {
  const urlToFetch = `${API_URL}?q=toronto&appid=${API_KEY}`;
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

const getCity = () => {
  const city = document.querySelector("#city").value;
  mainTitle.innerHTML = `Latest weather at ${city}`;
  return city.toLowerCase();
};

const updateWeather = async () => {
  const city = getCity();
  const urlToFetch = `${API_URL}?q=${city}&appid=${API_KEY}`;
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

const displayWeatherInfoProcess = (info) => {
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
};

getWeather().then((info) => {
  displayWeatherInfoProcess(info);
});


const getPreviousWeather = async () => {
  const urlToFetchPre = `${API_URL_PRE}?q=toronto&appid=${API_KEY}`;
  return await fetch(urlToFetchPre)
    .then(
      (response) => {
        if (response.ok) {
          // console.log(response.json());
          return response.json();
        }
        throw new Error("Request failed!");
      },
      (networkError) => {
        console.log(networkError.message);
      }
    )
    .then((data) => {
      // eslint-disable-next-line no-unused-vars
      const list = data.list;
      const previousWeather = [];
      var tempSum = 0;
      var minTemp = list[0].main.temp_min;
      var maxTemp = list[0].main.temp_max;
      var windDegree = 0;
      var windSpeed = 0;
      for (var i = 0; i < list.length; i++) {
        const object = list[i];
        const temp = {};
        tempSum += object.main.temp;
        minTemp = Math.min(minTemp, object.main.temp_min);
        maxTemp = Math.max(maxTemp, object.main.temp_max);
        windDegree += object.wind.deg;
        windSpeed += object.wind.speed;
        if (i % 8 == 7) {
          temp.temp = tempSum / 8;
          tempSum = 0;
          temp.temp_max = maxTemp;
          temp.temp_min = minTemp;
          temp.main_weather = object.weather[0].main;
          temp.weather_description = object.weather[0].description;
          temp.date = new Date(object.dt * 1000);
          temp.wind_degree = windDegree / 8;
          windDegree = 0;
          temp.wind_speed = windSpeed / 8;
          windSpeed = 0;
          previousWeather.push(temp);
        }
      }
      return previousWeather.splice(0, 5);
    });
};

const updatePreviousWeather = async () => {
  const city = getCity();
  const urlToFetchPre = `${API_URL_PRE}?q=${city}&appid=${API_KEY}`;
  return await fetch(urlToFetchPre)
    .then(
      (response) => {
        if (response.ok) {
          // console.log(response.json());
          return response.json();
        }
        throw new Error("Request failed!");
      },
      (networkError) => {
        console.log(networkError.message);
      }
    )
    .then((data) => {
      // eslint-disable-next-line no-unused-vars
      const list = data.list;
      const previousWeather = [];
      var tempSum = 0;
      var minTemp = list[0].main.temp_min;
      var maxTemp = list[0].main.temp_max;
      var windDegree = 0;
      var windSpeed = 0;
      for (var i = 0; i < list.length; i++) {
        const object = list[i];
        const temp = {};
        tempSum += object.main.temp;
        minTemp = Math.min(minTemp, object.main.temp_min);
        maxTemp = Math.max(maxTemp, object.main.temp_max);
        windDegree += object.wind.deg;
        windSpeed += object.wind.speed;
        if (i % 8 == 7) {
          temp.temp = tempSum / 8;
          tempSum = 0;
          temp.temp_max = maxTemp;
          temp.temp_min = minTemp;
          temp.main_weather = object.weather[0].main;
          temp.weather_description = object.weather[0].description;
          temp.date = new Date(object.dt * 1000);
          temp.wind_degree = windDegree / 8;
          windDegree = 0;
          temp.wind_speed = windSpeed / 8;
          windSpeed = 0;
          previousWeather.push(temp);
        }
      }
      return previousWeather.splice(0, 5);
    });
};

const getPreviousWeatherProcess = (data) => {
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
};


getPreviousWeather().then((data) => {
  getPreviousWeatherProcess(data);
});


const updateWeatherInfo = () => {
  updateWeather().then((info) => {
    displayWeatherInfoProcess(info);
  });

  updatePreviousWeather().then((data) => {
    getPreviousWeatherProcess(data);
  });
};
cityChangeBtn.addEventListener("click", updateWeatherInfo);


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
    dataContainer.querySelector("[data-pre-temp-high]").innerText = displayTemp(
      dailyData.temp_max
    );
    dataContainer.querySelector("[data-pre-temp-low]").innerText = displayTemp(
      dailyData.temp_min
    );
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
