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
let pressureElemet = document.querySelector("#pressure");
let maxTempElement = document.querySelector("#max-temp");
let minTempElement = document.querySelector("#min-temp");

let typedLocation = document.querySelector("#text");
let currentLocation = document.querySelector("#current-location");
let descriptionElement = document.querySelector("#description");
let iconElement = document.querySelector("#main-icon");

function showWeather(response) {
  celsiusTemp = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  pressureElemet.innerHTML = response.data.main.pressure;
  currentLocation.innerHTML = response.data.name;
  maxTempElement.innerHTML = Math.round(response.data.main.temp_max);
  minTempElement.innerHTML = Math.round(response.data.main.temp_min);
  descriptionElement.innerHTML = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 0; index < 6; index++) {
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
                <strong>${Math.round(
                  forecast.main.temp_max
                )}°</strong> ${Math.round(forecast.main.temp_min)}°</div>
              </div>`;
  }
}

function checkTheWeather(event) {
  event.preventDefault();
  if (typedLocation.value) {
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
}

function getPosition(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(retrieveLocation);
}
let buttonCurrently = document.querySelector("#current-button");
buttonCurrently.addEventListener("click", getPosition);

function showImperial(event) {
  event.preventDefault();
  let farenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemp);
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
}
function showMetric(event) {
  event.preventDefault();
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
}
let celsiusTemp = null;

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", showImperial);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showMetric);
