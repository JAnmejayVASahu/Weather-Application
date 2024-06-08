const apiKey = "e7298e92cdb18c0f86aea032308d06d2";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".forecast").style.display = "none"; // Hide the forecast on error
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/H";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        } else {
            weatherIcon.src = "images/snow.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".forecast").style.display = "block"; // Display the forecast on success

        getForecast(city); // Call getForecast after successful weather fetch
    }
}


async function getForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    const forecastContainer = document.querySelector(".forecast-container");

    forecastContainer.innerHTML = ""; // Clear any existing forecast

    const forecastList = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
    );

    forecastList.forEach((forecast) => {
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        const temp = Math.round(forecast.main.temp) + "°C";
        const icon = `images/${forecast.weather[0].main.toLowerCase()}.png`;

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");

        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="${icon}" alt="${forecast.weather[0].description}">
            <p>${temp}</p>
            <p>${forecast.weather[0].description}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

document.getElementById('theme-toggle').addEventListener('change', function () {
    const body = document.body;
    body.classList.toggle('dark-theme');
});
