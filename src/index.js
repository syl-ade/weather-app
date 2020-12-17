// Indicating current date and time
let currentDate = document.querySelector("#current-date");
let now = new Date();
let year = now.getFullYear();
let date = now.getDate();
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
currentDate.innerHTML = `${day}, ${date} ${month} ${year}`;
let currentTime = document.querySelector("#current-time");
let hours = now.getHours();
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}
currentTime.innerHTML = `${hours}h${minutes}`;

let temperatureElement = document.querySelector("#current-temperature");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let pressureElement = document.querySelector("#pressure");
let maxTempElement = document.querySelector("#max-temp");
let minTempElement = document.querySelector("#min-temp");

let typedLocation = document.querySelector("#text");
let currentLocation = document.querySelector("#current-location");
let descriptionElement = document.querySelector("#description");
let iconElement = document.querySelector("#main-icon");
let windUnit = document.querySelector("#wind-unit");
let pressureUnit = document.querySelector("#pressure-unit");
let unitTempMax = document.querySelector("#unit-max");
let unitTempMin = document.querySelector("#unit-min");

let celsiusTemp = null;
let windSpeed = null;
let pressure = null;
let maxTemp = null;
let minTemp = null;

let searchbar = document.querySelector("input.form-control");

function showWeather(response) {
  celsiusTemp = response.data.main.temp;
  windSpeed = response.data.wind.speed;
  pressure = response.data.main.pressure;
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(windSpeed);
  pressureElement.innerHTML = pressure;
  currentLocation.innerHTML = response.data.name;
  maxTemp = response.data.main.temp_max;
  maxTempElement.innerHTML = Math.round(maxTemp);
  unitTempMax.innerHTML = "°C";
  minTemp = response.data.main.temp_min;
  minTempElement.innerHTML = Math.round(minTemp);
  unitTempMin.innerHTML = "°C";
  descriptionElement.innerHTML = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
}
function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 1; index < 7; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
                <div class="col-2">
                <h3>
                ${formatHours(forecast.dt * 1000)}
                </h3>
                <img src="https://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png" alt="${forecast.weather[0].description}"/>
                <div class="weather-forecast-temp">
                <strong><span class="forecast-max-temp">${Math.round(
                  forecast.main.temp_max
                )}</span>°</strong> <span class="forecast-min-temp">${Math.round(
      forecast.main.temp_min
    )}</span>°</div>
              </div>`;
  }
}

function checkTheWeather(event) {
  event.preventDefault();
  if (typedLocation.value) {
    farenheitLink.addEventListener("click", showImperial);
    farenheitLink.classList.remove("active");
    farenheitLink.classList.add("active");
    currentLocation.innerHTML = typedLocation.value;
    let apiKey = "b40b1170719118f550e945ff17d55d7a";
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${typedLocation.value}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showWeather);

    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${typedLocation.value}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showForecast);
  } else {
    alert(`Type a location`);
  }
}
let form = document.querySelector("form");
form.addEventListener("submit", checkTheWeather);

function retrieveLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "b40b1170719118f550e945ff17d55d7a";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showForecast);

  farenheitLink.addEventListener("click", showImperial);
}

function getPosition(event) {
  event.preventDefault();
  searchbar.placeholder = `Type a location...`;
  navigator.geolocation.getCurrentPosition(retrieveLocation);
}
let buttonCurrently = document.querySelector("#current-button");
buttonCurrently.addEventListener("click", getPosition);

let farenheitLink = document.querySelector("#farenheit-link");
let celsiusLink = document.querySelector("#celsius-link");

function showImperial(event) {
  event.preventDefault();
  let farenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemp);
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  windElement.innerHTML = Math.round(windSpeed / 1.609344);
  windUnit.innerHTML = " mph";
  pressureElement.innerHTML = Math.round(pressure * 0.02953);
  pressureUnit.innerHTML = " inHg";
  maxTempElement.innerHTML = Math.round((maxTemp * 9) / 5 + 32);
  minTempElement.innerHTML = Math.round((minTemp * 9) / 5 + 32);
  unitTempMax.innerHTML = "°F";
  unitTempMin.innerHTML = "°F";

  let forecastMaxTempElement = document.querySelectorAll(".forecast-max-temp");
  forecastMaxTempElement.forEach(function (item) {
    let currentValue = item.innerHTML;
    item.innerHTML = Math.round((currentValue * 9) / 5 + 32);
  });
  let forecastMinTempElement = document.querySelectorAll(".forecast-min-temp");
  forecastMinTempElement.forEach(function (item) {
    let currentValue = item.innerHTML;
    item.innerHTML = Math.round((currentValue * 9) / 5 + 32);
  });
  farenheitLink.removeEventListener("click", showImperial);
  celsiusLink.addEventListener("click", showMetric);
}
function showMetric(event) {
  event.preventDefault();
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  windElement.innerHTML = Math.round(windSpeed);
  windUnit.innerHTML = " km/h";
  pressureElement.innerHTML = pressure;
  pressureUnit.innerHTML = " hPa";
  maxTempElement.innerHTML = Math.round(maxTemp);
  minTempElement.innerHTML = Math.round(minTemp);
  unitTempMax.innerHTML = "°C";
  unitTempMin.innerHTML = "°C";

  let forecastMaxTempElement = document.querySelectorAll(".forecast-max-temp");
  forecastMaxTempElement.forEach(function (item) {
    let currentValue = item.innerHTML;
    item.innerHTML = Math.round(((currentValue - 32) * 5) / 9);
  });
  let forecastMinTempElement = document.querySelectorAll(".forecast-min-temp");
  forecastMinTempElement.forEach(function (item) {
    let currentValue = item.innerHTML;
    item.innerHTML = Math.round(((currentValue - 32) * 5) / 9);
  });
  farenheitLink.addEventListener("click", showImperial);
  celsiusLink.removeEventListener("click", showMetric);
}
