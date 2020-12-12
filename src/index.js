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

currentTime.innerHTML = `${hours}h${minutes}`;

let temperature = document.querySelector("#current-temperature");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let pressure = document.querySelector("#pressure");
let maxTemp = document.querySelector("#max-temp");
let minTemp = document.querySelector("#min-temp");

let typedLocation = document.querySelector("#text");
let currentLocation = document.querySelector("#current-location");
let descriptionElement = document.querySelector("#description");
let iconElement = document.querySelector("#main-icon");
iconElement.setAttribute("src", "");

function showWeather(response) {
  temperature.innerHTML = Math.round(response.data.main.temp);
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = response.data.wind.speed;
  pressure.innerHTML = response.data.main.pressure;
  currentLocation.innerHTML = response.data.name;
  maxTemp.innerHTML = Math.round(response.data.main.temp_max);
  minTemp.innerHTML = Math.round(response.data.main.temp_min);
  descriptionElement.innerHTML = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

function checkTheWeather(event) {
  event.preventDefault();
  if (typedLocation.value) {
    currentLocation.innerHTML = typedLocation.value;
    let apiKey = "b40b1170719118f550e945ff17d55d7a";
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${typedLocation.value}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(showWeather);
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
}

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrieveLocation);
}
let buttonCurrently = document.querySelector("#current-button");
buttonCurrently.addEventListener("click", getPosition);

function changeToImperial(event) {
  event.preventDefault();
}

let imperialButton = document.querySelector("#imperial");
imperialButton.addEventListener("click", changeToImperial);
