const apiKey = "0f872327d924241d53fe209431d7d256";
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const geocodingUrl = "https://api.openweathermap.org/geo/1.0/direct";

$(document).ready(function () {
  loadHistory();
  $("#search-button").on("click", function () {
    const city = $("#city-input").val();
    if (city) {
      getCoordinates(city);
    }
  });

  $("#history").on("click", "li", function () {
    $("#history .list-group-item").removeClass("selected");
    $(this).addClass('selected');

    const city = $(this).text();
    $(this).addClass("selected");
    getCoordinates(city);
    $(".5day-forecast-head").removeClass("hide");
  });
});

function getCoordinates(city) {
  const url = `${geocodingUrl}?q=${city}&limit=1&appid=${apiKey}`;
  $.getJSON(url, function (data) {
    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      getWeatherData(city, lat, lon);
    }
  });
}

function getWeatherData(city, lat, lon) {
  const url = `${apiBaseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  $.getJSON(url, function (data) {
    displayCurrentWeather(city, data.list[0]);
    displayForecast(data.list);
    updateHistory(city);
  });
}

function displayCurrentWeather(city, weather) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
  const currentHtml = `
        <h2>${city} (${dayjs(weather.dt_txt).format(
    "MM/DD/YYYY"
  )}) <img src="${iconUrl}" alt="weather icon"></h2>
        <p>Temperature: ${weather.main.temp} °F</p>
        <p>Humidity: ${weather.main.humidity} %</p>
        <p>Wind Speed: ${weather.wind.speed} mph</p>
    `;
  $("#current-weather").html(currentHtml);
}

function displayForecast(forecast) {
  $("#forecast").empty();
  for (let i = 0; i < forecast.length; i += 8) {
    const day = forecast[i];
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const forecastHtml = `
            <div class="col-md-2">
                <div class="card">
                    <div class="card-body">
                        <h5>${dayjs(day.dt_txt).format("MM/DD/YYYY")}</h5>
                        <img src="${iconUrl}" alt="weather icon">
                        <p>Temp: ${day.main.temp} °F</p>
                        <p>Wind: ${day.wind.speed} mph</p>
                        <p>Humidity: ${day.main.humidity} %</p>
                    </div>
                </div>
            </div>
        `;
    $("#forecast").append(forecastHtml);
  }
}

function updateHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    loadHistory();
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  $("#history").empty();
  history.forEach((city) => {
    $("#history").append(`<li class="list-group-item">${city}</li>`);
  });
}
