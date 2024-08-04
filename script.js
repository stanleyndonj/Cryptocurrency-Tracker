// script.js
document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    const cryptoList = document.getElementById("crypto-list");
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("search-btn");
    const favoritesList = document.getElementById("favorites-list");
    const btcPrice = document.getElementById("btc-price");
    const btcChange = document.getElementById("btc-change");
    const btcMarketCap = document.getElementById("btc-market-cap");
    const btcVolume = document.getElementById("btc-volume");
    const ethPrice = document.getElementById("eth-price");
    const ethChange = document.getElementById("eth-change");
    const ethMarketCap = document.getElementById("eth-market-cap");
    const ethVolume = document.getElementById("eth-volume");
    const lastSynced = document.getElementById("last-synced");
    const top10ChartCtx = document.getElementById("top10Chart").getContext("2d");
    const currencySelect = document.getElementById("currency-select");
    const favoritesToggle = document.getElementById("favorites-toggle");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    let cryptoData = [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Toggle sidebar
    sidebarToggle.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-hidden");
    });

    // Toggle dark mode
    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
    });

    // Fetch and display cryptocurrency data
    async function fetchCryptocurrencies() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            cryptoData = data;
            displayCryptocurrencies(data);
            displayTop10Chart(data);
            updateDashboard(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Display the list of cryptocurrencies
    function displayCryptocurrencies(data) {
        cryptoList.innerHTML = "";
        data.forEach((crypto) => {
            const item = document.createElement("div");
            item.classList.add("crypto-item");
            item.innerHTML = `
                <img src="${crypto.image}" alt="${crypto.name}">
                <h3>${crypto.name}</h3>
                <p>Current Price: $${crypto.current_price}</p>
                <button data-crypto-id="${crypto.id}">Add to Favorites</button>
            `;
            item.querySelector("button").addEventListener("click", () => addToFavorites(crypto));
            cryptoList.appendChild(item);
        });
    }

    // Display the top 10 cryptocurrencies in a chart
    function displayTop10Chart(data) {
        const top10 = data.slice(0, 10);
        new Chart(top10ChartCtx, {
            type: "bar",
            data: {
                labels: top10.map((crypto) => crypto.name),
                datasets: [
                    {
                        label: "Price (USD)",
                        data: top10.map((crypto) => crypto.current_price),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    // Update the dashboard with Bitcoin and Ethereum data
    function updateDashboard(data) {
        const btc = data.find((crypto) => crypto.id === "bitcoin");
        const eth = data.find((crypto) => crypto.id === "ethereum");
        btcPrice.textContent = `$${btc.current_price}`;
        btcChange.textContent = `24 Hour Change ${btc.price_change_percentage_24h.toFixed(2)}%`;
        btcMarketCap.textContent = `Market Cap: $${btc.market_cap}`;
        btcVolume.textContent = `Volume: $${btc.total_volume}`;
        ethPrice.textContent = `$${eth.current_price}`;
        ethChange.textContent = `24 Hour Change ${eth.price_change_percentage_24h.toFixed(2)}%`;
        ethMarketCap.textContent = `Market Cap: $${eth.market_cap}`;
        ethVolume.textContent = `Volume: $${eth.total_volume}`;
        lastSynced.textContent = new Date().toLocaleString();
    }

    // Add a cryptocurrency to favorites
    function addToFavorites(crypto) {
        if (!favorites.some((fav) => fav.id === crypto.id)) {
            favorites.push(crypto);
            updateFavorites();
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }

    // Remove a cryptocurrency from favorites
    function removeFromFavorites(cryptoId) {
        favorites = favorites.filter((crypto) => crypto.id !== cryptoId);
        updateFavorites();
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    // Update the favorites list
    function updateFavorites() {
        favoritesList.innerHTML = favorites.map((crypto) => `
            <div class="favorite-item">
                <span>${crypto.name}</span>
                <button data-crypto-id="${crypto.id}">Remove</button>
            </div>
        `).join("");

        favoritesList.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => removeFromFavorites(button.getAttribute("data-crypto-id")));
        });
    }

    // Handle the search functionality
    searchBtn.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = cryptoData.filter((crypto) =>
            crypto.name.toLowerCase().includes(searchTerm)
        );
        displayCryptocurrencies(filteredData);
    });

    // Handle favorites toggle
    favoritesToggle.addEventListener("click", () => {
        favoritesList.classList.toggle("hidden");
    });

    // Fetch initial data
    fetchCryptocurrencies();
});
