function formatDate(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let months = [
    "Jan",
    "Feb",
    "Mar",
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

  let currentDay = days[date.getDay()];
  let currentMonth = months[date.getMonth()];
  let currentDate = date.getDate();

  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  return `${currentDay} ${currentMonth} ${currentDate} ︱ ${currentHours}:${currentMinutes}`;
}
let h2 = document.querySelector("h2");
h2.innerHTML = formatDate(new Date());

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let hourlyForecast = response.data.hourly;

  let forecastElement = document.querySelector("#forecast");

  let hourlyForecastElement = document.querySelector("today-hourly-forecast");

  let forecastHTML = `<div class="row align-items-start">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 4) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
              <div class="day">${formatDay(forecastDay.dt)}</div>
              <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="" id="icon"/></div>
              <div><span class="temps">${Math.round(
                forecastDay.temp.max
              )}°</span>  <span class="lowest-temp">${Math.round(
          forecastDay.temp.min
        )}°</span></div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  let hourlyForecastHTML = `<div class="row align-itmes-start">`;
  hourlyForecast.forEach(function (forecastHour, index) {
    if (index < 2) {
      hourlyForecastHTML =
        hourlyForecastHTML +
        `<div class="col">
              <div class="time">${formatHour(forecastHour.dt)}</div>
              <div><img src="http://openweathermap.org/img/wn/${
                forecastHour.weather[0].icon
              }@2x.png" alt="" class="weather-icon" id="icon"/></div>
              <div class="temps">${Math.round(forecastHour.temp)}°</div>
            </div>`;
    }
  });
  hourlyForecastHTML = hourlyForecastHTML + `</div>`;
  hourlyForecastElement.innerHTML = hourlyForecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "080f779f80a6c07172dd57953e33b195";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusTemp = response.data.main.temp;
  document.querySelector("#temp-current").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "080f779f80a6c07172dd57953e33b195";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#searchCity-input").value;
  searchCity(city);
}

function showCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = "metric";
  let apiKey = "080f779f80a6c07172dd57953e33b195";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function retrieveLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp-current");
  temp.innerHTML = Math.round(celsiusTemp);
  let apiKey = "080f779f80a6c07172dd57953e33b195";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temp = document.querySelector("#temp-current");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temp.innerHTML = Math.round(fahrenheitTemp);
  let apiKey = "080f779f80a6c07172dd57953e33b195";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

let celsiusTemp = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let searchCityform = document.querySelector("#searchCity-form");
searchCityform.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", retrieveLocation);

searchCity("Portland");
