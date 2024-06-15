document.addEventListener('DOMContentLoaded', function() {
    const addFavoriteBtn = document.getElementById('add-favorite-btn');
    const favoritesList = document.getElementById('favorites-list');

    // Function to load favorite locations from localStorage
    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = '';
        favorites.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.classList.add('favorite-item');
            li.addEventListener('click', () => displayWeatherForCity(city));
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(city);
            });
            li.appendChild(removeBtn);
            favoritesList.appendChild(li);
        });
    }

    // Function to add a city to favorites
    function addFavorite(city) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            loadFavorites();
        }
    }

    // Function to remove a city from favorites
    function removeFavorite(city) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav !== city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites();
    }

    // Function to display weather for a favorite city
    function displayWeatherForCity(city) {
        // Call the fetchWeather function from app.js
        if (typeof checkWeather === 'function') {
            checkWeather(city);
        } else {
            console.error('fetchWeather function is not defined');
        }
    }

    // Event listener for the add to favorites button
    addFavoriteBtn.addEventListener('click', () => {
        const city = document.querySelector('.city').textContent;
        addFavorite(city);
    });

    // Load favorite locations on page load
    loadFavorites();
});
