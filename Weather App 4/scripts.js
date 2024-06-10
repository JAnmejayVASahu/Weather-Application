const apiKey = "e10b4cad4103670f15d89a3a90a61dfe"; // Ensure this is your valid free API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const hourlyContainer = document.querySelector(".hourly-container");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/H";
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        document.querySelector(".visibility").innerHTML = data.visibility / 1000 + " km";
        
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        document.querySelector(".sunrise").innerHTML = sunriseTime;
        document.querySelector(".sunset").innerHTML = sunsetTime;

        // Get UV Index
        const uvResponse = await fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`);
        const uvData = await uvResponse.json();
        document.querySelector(".uv-index").innerHTML = uvData.value;

        let weatherCondition = data.weather[0].main.toLowerCase();
        switch(weatherCondition) {
            case "clouds":
                weatherIcon.src = "images/clouds.png";
                document.body.style.backgroundImage = "url('images/clouds-bg.jpg')";
                break;
            case "clear":
                weatherIcon.src = "images/clear.png";
                document.body.style.backgroundImage = "url('images/clear-bg.jpg')";
                break;
            case "rain":
                weatherIcon.src = "images/rain.png";
                document.body.style.backgroundImage = "url('images/rain-bg.jpg')";
                break;
            case "drizzle":
                weatherIcon.src = "images/drizzle.png";
                document.body.style.backgroundImage = "url('images/drizzle-bg.jpg')";
                break;
            case "mist":
                weatherIcon.src = "images/mist.png";
                document.body.style.backgroundImage = "url('images/mist-bg.jpg')";
                break;
            default:
                weatherIcon.src = "images/snow.png";
                document.body.style.backgroundImage = "url('images/snow-bg.jpg')";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".forecast").style.display = "block";
        document.querySelector(".hourly-forecast").style.display = "block";

        getForecast(city);
    } catch (error) {
        console.error(error);
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".forecast").style.display = "none";
        document.querySelector(".hourly-forecast").style.display = "none";
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

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

        // Call to get hourly forecast using filtered data
        getHourlyForecast(data.list);
    } catch (error) {
        console.error(error);
        document.querySelector(".forecast").style.display = "none";
    }
}

function getHourlyForecast(forecastList) {
    hourlyContainer.innerHTML = "";

    forecastList.slice(0, 12).forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;
        const hourBlock = document.createElement("div");
        hourBlock.className = "hourly";
        hourBlock.innerHTML = `
            <div class="hour">${formattedHour} ${ampm}</div>
            <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="Weather Icon">
            <div class="temp">${Math.round(hour.main.temp)}°C</div>
        `;
        hourlyContainer.appendChild(hourBlock);
    });
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

document.getElementById('theme-toggle').addEventListener('change', function () {
    const body = document.body;
    body.classList.toggle('dark-theme');
});
