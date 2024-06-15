const newsApiKey = "c68a108d7b774ff6ace964771d76914e"; // Replace with your NewsAPI key
const newsUrl = `https://newsapi.org/v2/everything?q=weather&apiKey=${newsApiKey}`;

// Function to fetch weather news
function fetchWeatherNews() {
    fetch(newsUrl)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            const highlightedArticles = articles.slice(0, 3); // Get the top 3 articles
            const otherArticles = articles.slice(3); // Get the rest of the articles
            displayNewsArticles(otherArticles);
            showNewsPopup(highlightedArticles);
        })
        .catch(error => console.error("Error fetching news:", error));
}

// Function to display news articles in the news container
function displayNewsArticles(articles) {
    const newsContainer = document.querySelector(".news-container");
    if (!newsContainer) {
        console.error("News container not found");
        return;
    }

    newsContainer.innerHTML = "";

    articles.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("news-article");

        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" class="news-img">` : ""}
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(articleElement);
    });
}

// Function to show the news pop-up with highlighted articles
function showNewsPopup(highlightedArticles) {
    const newsPopup = document.getElementById('news-popup');
    const newsContent = document.querySelector('.news-content');

    if (!newsPopup || !newsContent) {
        console.error("News popup or content container not found");
        return;
    }

    let currentArticleIndex = 0;

    function displayNextArticle() {
        if (currentArticleIndex < highlightedArticles.length) {
            const article = highlightedArticles[currentArticleIndex];
            newsContent.innerHTML = `
               
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsPopup.style.display = 'block';

            setTimeout(() => {
                newsPopup.style.display = 'none';
                currentArticleIndex++;
                setTimeout(displayNextArticle, 2000); // 2 seconds delay between articles
            }, 5000); // Each article displayed for 5 seconds
        }
    }

    displayNextArticle();
}

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Fetch news on page load
    fetchWeatherNews();

    // Ensure the news button fetches news and redirects to the news page
    const newsBtn = document.getElementById('news-btn');
    if (newsBtn) {
        newsBtn.addEventListener('click', () => {
            window.location.href = '/Public/news.html'; // Redirect to news page
        });
    } else {
        console.error("News button not found");
    }
});

// sabu news related video show kari baro achi gpt re already achi

// Example function to fetch related YouTube videos
async function fetchRelatedVideos(query) {
    const youtubeApiKey = 'AIzaSyChwSMfqZB2abiRQcO-UiEMzjNDt_saDUo'; // Replace with your YouTube API key
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}&type=video`;

    try {
        const response = await fetch(youtubeUrl);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

// Function to display related videos
async function displayRelatedVideos(articleElement, query) {
    const videos = await fetchRelatedVideos(query);
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');

        videoElement.innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
            <p>${video.snippet.title}</p>
        `;

        videoContainer.appendChild(videoElement);
    });

    articleElement.appendChild(videoContainer);
}

// Modify displayNewsArticles function to include related videos
function displayNewsArticles(articles) {
    const newsContainer = document.querySelector(".news-container");
    if (!newsContainer) return; // Ensure the news container exists

    newsContainer.innerHTML = "";

    articles.forEach(async article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("news-article");

        const { title, description, url, urlToImage, content } = article;

        articleElement.innerHTML = `
            <h3>${title}</h3>
            ${urlToImage ? `<img src="${urlToImage}" alt="${title}">` : ""}
            <p>${description}</p>
            <p>${content}</p>
            <a href="${url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(articleElement);

        await displayRelatedVideos(articleElement, title);
    });
}
