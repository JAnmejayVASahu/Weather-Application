const apiKey = "e10b4cad4103670f15d89a3a90a61dfe";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const hourlyContainer = document.querySelector(".hourly-container");
const languageSelector = document.getElementById("language");

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
    hi: {
        chooseLanguage: "भाषा चुनें:",
        invalidCity: "अमान्य शहर का नाम",
        humidity: "आर्द्रता",
        windSpeed: "हवा की गति",
        pressure: "दबाव",
        uvIndex: "यूवी सूचकांक",
        visibility: "दृश्यता",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त",
        hourlyForecast: "प्रति घंटा पूर्वानुमान",
        forecast: "5-दिवसीय पूर्वानुमान"
    },
    bn: {
        chooseLanguage: "ভাষা নির্বাচন করুন:",
        invalidCity: "অবৈধ শহরের নাম",
        humidity: "আর্দ্রতা",
        windSpeed: "বাতাসের গতি",
        pressure: "চাপ",
        uvIndex: "ইউভি সূচক",
        visibility: "দৃশ্যমানতা",
        sunrise: "সূর্যোদয়",
        sunset: "সূর্যাস্ত",
        hourlyForecast: "প্রতি ঘণ্টার পূর্বাভাস",
        forecast: "৫ দিনের পূর্বাভাস"
    },
    te: {
        chooseLanguage: "భాషను ఎంచుకోండి:",
        invalidCity: "చెల్లని నగర పేరు",
        humidity: "ఆర్ద్రత",
        windSpeed: "గాలి వేగం",
        pressure: "పీడనం",
        uvIndex: "యూవీ సూచిక",
        visibility: "ప్రతిభాసం",
        sunrise: "సూర్యోదయం",
        sunset: "సూర్యాస్తమయం",
        hourlyForecast: "ప్రతి గంటా వాతావరణ నివేదిక",
        forecast: "5-రోజుల వాతావరణ నివేదిక"
    },
    mr: {
        chooseLanguage: "भाषा निवडा:",
        invalidCity: "अवैध शहराचे नाव",
        humidity: "आर्द्रता",
        windSpeed: "वाऱ्याचा वेग",
        pressure: "दबाव",
        uvIndex: "अल्ट्राव्हायोलेट निर्देशांक",
        visibility: "दृश्यमानता",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त",
        hourlyForecast: "तासागणिक अंदाज",
        forecast: "5 दिवसांचा अंदाज"
    },
    ta: {
        chooseLanguage: "மொழியை தேர்ந்தெடுக்கவும்:",
        invalidCity: "தவறான நகர பெயர்",
        humidity: "ஊடுருவல்தன்மை",
        windSpeed: "காற்றின் வேகம்",
        pressure: "மருத்துவம்",
        uvIndex: "யூவி குறியீடு",
        visibility: "பார்வைத்திறன்",
        sunrise: "சூரிய உதயம்",
        sunset: "சூரிய அஸ்தமனம்",
        hourlyForecast: "மணிநேர காலநிலை முன்னறிவு",
        forecast: "5-நாள் காலநிலை முன்னறிவு"
    },
    ur: {
        chooseLanguage: "زبان منتخب کریں:",
        invalidCity: "غلط شہر کا نام",
        humidity: "نمی",
        windSpeed: "ہوا کی رفتار",
        pressure: "دباؤ",
        uvIndex: "یووی انڈیکس",
        visibility: "حد نگاہ",
        sunrise: "طلوع آفتاب",
        sunset: "غروب آفتاب",
        hourlyForecast: "ہر گھنٹے کا موسم",
        forecast: "5 دن کی پیشن گوئی"
    },
    gu: {
        chooseLanguage: "ભાષા પસંદ કરો:",
        invalidCity: "અમાન્ય શહેરનું નામ",
        humidity: "આર્દ્રતા",
        windSpeed: "પવનની ગતિ",
        pressure: "દબાણ",
        uvIndex: "યુવી સૂચક",
        visibility: "દૃશ્યતા",
        sunrise: "સૂર્યોદય",
        sunset: "સૂર્યાસ્ત",
        hourlyForecast: "કલાકવારનો આગાહ",
        forecast: "5-દિવસોની આગાહી"
    },
    kn: {
        chooseLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ:",
        invalidCity: "ಅಮಾನ್ಯ ನಗರ ಹೆಸರು",
        humidity: "ಆದ್ರತೆ",
        windSpeed: "ಗಾಳಿಯ ವೇಗ",
        pressure: "ಒತ್ತಡ",
        uvIndex: "ಯುವಿ ಸೂಚ್ಯಂಕ",
        visibility: "ಕಾಣಿಕೆ",
        sunrise: "ಸೂರ್ಯೋದಯ",
        sunset: "ಸೂರ್ಯಾಸ್ತ",
        hourlyForecast: "ಪ್ರತಿ ಗಂಟೆ ಹವಾಮಾನ",
        forecast: "5-ದಿನಗಳ ಹವಾಮಾನ"
    },
    ml: {
        chooseLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക:",
        invalidCity: "അസാധുവായ നഗരം",
        humidity: "ആർദ്രത",
        windSpeed: "കാറ്റിന്റെ വേഗം",
        pressure: "മർദം",
        uvIndex: "യുവി സൂചിക",
        visibility: "ദൃശ്യത",
        sunrise: "സൂര്യോദയം",
        sunset: "സൂര്യാസ്തമയം",
        hourlyForecast: "മണിക്കൂറിന്റെ കാലാവസ്ഥ",
        forecast: "5-ദിവസം കാലാവസ്ഥ"
    },
    or: {
        chooseLanguage: "ଭାଷା ବାଛନ୍ତୁ:",
        invalidCity: "ଅବୈଧ ସହରର ନାମ",
        humidity: "ଆର୍ଦ୍ରତା",
        windSpeed: "ବାତାସ ଗତି",
        pressure: "ଚାପ",
        uvIndex: "ୟୁଭି ସୂଚକ",
        visibility: "ଦୃଶ୍ୟତା",
        sunrise: "ସୂର୍ଯ୍ୟୋଦୟ",
        sunset: "ସୂର୍ଯ୍ୟାସ୍ତ",
        hourlyForecast: "ପ୍ରତି ଘଣ୍ଟା ଆବହାବିପରିସ୍ଥିତି",
        forecast: "5-ଦିନର ପୂର୍ବାଭାସ"
    },
    pa: {
        chooseLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ:",
        invalidCity: "ਗਲਤ ਸ਼ਹਿਰ ਦਾ ਨਾਮ",
        humidity: "ਨਮੀ",
        windSpeed: "ਹਵਾ ਦੀ ਗਤੀ",
        pressure: "ਦਬਾਅ",
        uvIndex: "ਯੂਵੀ ਸੂਚਕ",
        visibility: "ਵਿਜ਼ੀਬਿਲਟੀ",
        sunrise: "ਸੂਰਜ ਚੜ੍ਹਨਾ",
        sunset: "ਸੂਰਜ ਡੁੱਬਣਾ",
        hourlyForecast: "ਘੰਟਾ ਘੰਟਾ ਮੌਸਮ",
        forecast: "5 ਦਿਨਾਂ ਦਾ ਮੌਸਮ"
    },
    as: {
        chooseLanguage: "ভাষা বাচক",
        invalidCity: "অবৈধ চহৰৰ নাম",
        humidity: "আদ্ৰতা",
        windSpeed: "বতাহৰ বেগ",
        pressure: "চাপ",
        uvIndex: "ইউভি সূচক",
        visibility: "দৃশ্যমানতা",
        sunrise: "সুৰ্যোদয়",
        sunset: "সুৰ্যাস্ত",
        hourlyForecast: "প্ৰতি ঘণ্টাৰ আগভাস",
        forecast: "৫ দিনৰ আগভাস"
    }
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
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}&lang=${lang}`);

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

        const uvResponse = await fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`);
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