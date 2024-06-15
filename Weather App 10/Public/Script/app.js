const apiKey = "e10b4cad4103670f15d89a3a90a61dfe";
const apiKeyAirVisual = "505cdcce-5a22-4d47-b1b3-8a2841de741c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const airQualityUrl = "https://api.openweathermap.org/data/2.5/air_pollution";
const apiUrlAirVisual = "https://api.airvisual.com/v2/nearest_city?key=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const hourlyContainer = document.querySelector(".hourly-container");
const languageSelector = document.getElementById("language");
const voiceBtn = document.getElementById("voice-btn");
const voiceStatus = document.getElementById("voice-status");

// Pop-up elements
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close-btn");
const microphoneIcon = document.querySelector(".microphone-icon");
const waveAnimation = document.querySelector(".wave-animation");
const audio = new Audio('music/हमें आपके शहर का नाम (1).m4a'); // Audio for the popup


// Set fixed times for sunrise and sunset for testing purposes
const sunriseTime = 6; // 6:00 AM
const sunsetTime = 18; // 6:00 PM


const translations = {
    en: {
        chooseLanguage: "Choose Language:",
        invalidCity: "Invalid City Name",
        humidity: "Humidity",
        windSpeed: "Wind Speed",
        pressure: "Pressure",
        uvIndex: "UV Index",
        visibility: "Visibility",
        sunrise: "Sunrise",
        sunset: "Sunset",
        hourlyForecast: "Hourly Forecast",
        forecast: "5-Day Forecast"
    },
    // Additional language translations
    // ...
};

function updateLanguage(lang) {
    document.querySelector(".language-selector label").textContent = translations[lang].chooseLanguage;
    document.querySelector(".error p").textContent = `${translations[lang].invalidCity} \u{1F917}`;
    document.querySelector(".details .col:nth-child(1) p").textContent = translations[lang].humidity;
    document.querySelector(".details .col:nth-child(2) p").textContent = translations[lang].windSpeed;
    document.querySelector(".details .col:nth-child(3) p").textContent = translations[lang].pressure;
    document.querySelector(".details .col:nth-child(4) p").textContent = translations[lang].uvIndex;
    document.querySelector(".details .col:nth-child(5) p").textContent = translations[lang].visibility;
    document.querySelector(".details .col:nth-child(6) p").textContent = translations[lang].sunrise;
    document.querySelector(".details .col:nth-child(7) p").textContent = translations[lang].sunset;
    document.querySelector(".hourly-forecast h3").textContent = translations[lang].hourlyForecast;
    document.querySelector(".forecast h2").textContent = translations[lang].forecast;
}

async function checkWeather(city, lang) {
    try {
        // Fetch weather data
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}&lang=${lang}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        // Fetch AQI data
        const airQualityResponse = await fetch(`${airQualityUrl}?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`);
        if (!airQualityResponse.ok) throw new Error(`Error: ${airQualityResponse.status}`);
        const airQualityData = await airQualityResponse.json();
        const aqi = airQualityData.list[0].main.aqi;
        
        

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/H";
        document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
        document.querySelector(".visibility").innerHTML = data.visibility / 1000 + " km";
        document.querySelector(".aqi").innerHTML = `AQI: ${aqi}`;

        // Fetch sunrise and sunset times
        const sunResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        if (!sunResponse.ok) throw new Error(`Error: ${sunResponse.status}`);

        const sunData = await sunResponse.json();
        const sunriseTime = new Date(sunData.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(sunData.sys.sunset * 1000).toLocaleTimeString();
        document.querySelector(".sunrise").innerHTML = sunriseTime;
        document.querySelector(".sunset").innerHTML = sunsetTime;

        const uvResponse = await fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`);
        if (!uvResponse.ok) throw new Error(`Error: ${uvResponse.status}`);

        const uvData = await uvResponse.json();
        document.querySelector(".uv-index").innerHTML = uvData.value;

        let weatherCondition = data.weather[0].main.toLowerCase();
        switch (weatherCondition) {
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

        getForecast(city, lang);
        // Add heatmap layer
        addHeatmapLayer(city);

        // Add pop-ups and tooltips
        addPopupsAndTooltips(city);
    } catch (error) {
        console.error(error);
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".forecast").style.display = "none";
        document.querySelector(".hourly-forecast").style.display = "none";
    }
}


async function getForecast(city, lang) {
    try {
        const response = await fetch(`${forecastUrl}${city}&appid=${apiKey}&lang=${lang}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        const forecastContainer = document.querySelector(".forecast-container");
        forecastContainer.innerHTML = ""; // Clear existing forecast

        const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        forecastList.forEach(forecast => {
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

languageSelector.addEventListener("change", () => {
    const lang = languageSelector.value;
    updateLanguage(lang);

    const city = searchBox.value;
    if (city) {
        checkWeather(city, lang);
    }
});

searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    const lang = languageSelector.value;
    checkWeather(city, lang);
});

// Check if the Web Speech API is supported
if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    alert("Sorry, your browser doesn't support the Web Speech API. Please try using a supported browser such as Chrome.");
} else {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let isVoiceEnabled = false;

    function startRecognition() {
        recognition.start();
        voiceStatus.style.display = "block";
        voiceStatus.textContent = "Listening...";
        isVoiceEnabled = true;
    }

    function openPopup() {
        popup.style.display = "block";
        audio.play().catch(error => {
            console.error('Audio playback failed:', error);
        });

        audio.addEventListener("ended", () => {
            showWaveAnimation();
        });
    }

    function showWaveAnimation() {
        waveAnimation.style.display = "block";
        startRecognition();
    }

    function closePopup() {
        popup.style.display = "none";
        audio.pause();
        audio.currentTime = 0;
        waveAnimation.style.display = "none";
    }

    closeBtn.addEventListener("click", closePopup);

    recognition.addEventListener("result", (event) => {
        let transcript = event.results[0][0].transcript.toLowerCase().trim();
        transcript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // Remove trailing punctuation
        console.log(transcript);
    
        if (transcript) {
            document.getElementById("voice-btn").value = transcript; // Update voice input field
            waveAnimation.style.display = "none"; // Stop wave animation
            searchBox.value = transcript;
            const lang = languageSelector.value || "en";
            checkWeather(transcript, lang); // Check weather for the city
            addWeatherOverlay(transcript); // Add weather overlay to the map
            closePopup(); // Close popup after recognizing city name
        }
    });

    recognition.addEventListener("end", () => {
        voiceStatus.style.display = "none";
        if (isVoiceEnabled && popup.style.display === "block") {
            recognition.start(); // Restart recognition if popup is still open
        }
    });

    recognition.addEventListener("error", (event) => {
        console.error(event.error);
        voiceStatus.textContent = "Error occurred in recognition: " + event.error;
        isVoiceEnabled = false;
    });

    // voiceBtn.addEventListener("click", openPopup);
}


// Function to toggle between light and dark themes based on local time
function toggleThemeBasedOnTime() {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= sunriseTime && currentHour < sunsetTime) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
}

// Function to apply theme based on system preference
function applySystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
}

// Function to toggle theme manually
function toggleThemeManually() {
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    });
}

// Initial theme setup based on system preference and time of day
applySystemThemePreference();
toggleThemeBasedOnTime();
toggleThemeManually();

// Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemThemePreference);

// Listen for changes in time (every hour) to reapply the time-based theme
setInterval(toggleThemeBasedOnTime, 60 * 60 * 1000); // Check every hour


const map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function addWeatherOverlay(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        // Set map view to the city coordinates
        map.setView([lat, lon], 10);

        // Clear existing layers before adding a new one
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });

        L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
            opacity: 0.5
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${data.name}</b><br>${Math.round(data.main.temp)}°C`)
            .openPopup();
    } catch (error) {
        console.error(error);
        document.querySelector(".error").style.display = "block";
    }
}



// Call addWeatherOverlay when the user searches for a city
searchBtn.addEventListener("click", () => {
    const city = getCityName(); // Retrieve the city name from input
    const lang = languageSelector.value;
    checkWeather(city, lang); // Check weather for the city
    addWeatherOverlay(city); // Add weather overlay to the map
    animateWeatherOverTime(city); // Call the time-lapse animation function with the desired city name
    enableDrawingAndMeasurementTools(); // Call the drawing and measurement tools function
});
voiceBtn.addEventListener("click", openPopup);

languageSelector.addEventListener("change", () => {
    const city = searchBox.value;
    if (city) {
        addWeatherOverlay(city);
    }
});

const baseLayers = {
    "Streets": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satellite": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    // Add other base layers here...
};

const weatherLayers = {
    "Temperature": L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        opacity: 0.5
    }),
    "Precipitation": L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        opacity: 0.5
    }),
    // Add other weather layers here...
};

L.control.layers(baseLayers, weatherLayers).addTo(map);

map.locate({ setView: true, maxZoom: 16 });

function onLocationFound(e) {
    const radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup(`You are within ${radius} meters from this point`).openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Function to add heatmap layer
function addHeatmapLayer(city) {
    fetch(`${forecastUrl}${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const heatmapData = data.list.map(entry => {
                return [entry.coord.lat, entry.coord.lon, entry.main.temp]; // Adjust data as per your API response
            });

            const heatmapLayer = L.heatLayer(heatmapData, { radius: 20 }).addTo(map);
        })
        .catch(error => {
            console.error(error);
        });
}

// Function to add pop-ups and tooltips
function addPopupsAndTooltips(city) {
    fetch(`${forecastUrl}${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.list.forEach(entry => {
                const marker = L.marker([entry.coord.lat, entry.coord.lon]).addTo(map);
                const popupContent = `<b>${entry.name}</b><br>Temperature: ${entry.main.temp}°C<br>Humidity: ${entry.main.humidity}%`;
                marker.bindPopup(popupContent);

                const tooltipContent = `Temperature: ${entry.main.temp}°C`;
                marker.bindTooltip(tooltipContent);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

// Function to get the city name from the user input field
function getCityName() {
    const manualInput = document.querySelector(".search input").value.trim();
    const voiceInput = document.getElementById("voice-btn").value.trim();
    return manualInput || voiceInput;
}

