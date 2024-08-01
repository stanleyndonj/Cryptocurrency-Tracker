document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    const cryptoList = document.getElementById("crypto-list");
    const searchInput = document.getElementById("search");
    const favoritesList = document.getElementById("favorites-list");
    const btcPrice = document.getElementById("btc-price");
    const btcChange = document.getElementById("btc-change");
    const ethPrice = document.getElementById("eth-price");
    const ethChange = document.getElementById("eth-change");
    const lastSynced = document.getElementById("last-synced");
    const top10ChartCtx = document.getElementById("top10Chart").getContext("2d");
    const currencySelect = document.getElementById("currency-select");
    const favoritesToggle = document.getElementById("favorites-toggle");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");

    let cryptoData = [];
    let favorites = [];
    let currentCurrency = "usd";

    async function fetchCryptoData(currency = "usd") {
        try {
            const response = await fetch(`${apiUrl}&vs_currency=${currency}`);
            cryptoData = await response.json();
            displayCryptoData(cryptoData);
            updateDashboard(cryptoData);
            drawTop10Chart(cryptoData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function displayCryptoData(data) {
        cryptoList.innerHTML = "";
        data.forEach(crypto => {
            const cryptoItem = document.createElement("tr");
            cryptoItem.className = "crypto-item";
            cryptoItem.innerHTML = `
                <td><img src="${crypto.image}" alt="${crypto.name}" width="24" height="24"></td>
                <td>${crypto.name}</td>
                <td>$${crypto.current_price}</td>
                <td>${crypto.price_change_percentage_24h}%</td>
                <td><button data-id="${crypto.id}">Add to Favorites</button></td>
            `;
            cryptoList.appendChild(cryptoItem);
        });
    }

    function updateDashboard(data) {
        const btc = data.find(c => c.id === 'bitcoin');
        const eth = data.find(c => c.id === 'ethereum');
        if (btc) {
            btcPrice.textContent = `$${btc.current_price}`;
            btcChange.textContent = `24 Hour Change ${btc.price_change_percentage_24h}%`;
        }
        if (eth) {
            ethPrice.textContent = `$${eth.current_price}`;
            ethChange.textContent = `24 Hour Change ${eth.price_change_percentage_24h}%`;
        }
        lastSynced.textContent = new Date().toLocaleString();
    }

    function drawTop10Chart(data) {
        const top10 = data.slice(0, 10);
        const labels = top10.map(c => c.name);
        const prices = top10.map(c => c.current_price);

        new Chart(top10ChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price',
                    data: prices,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = cryptoData.filter(crypto => crypto.name.toLowerCase().includes(searchTerm));
        displayCryptoData(filteredData);
    });

    cryptoList.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const cryptoId = event.target.getAttribute("data-id");
            const crypto = cryptoData.find(c => c.id === cryptoId);
            if (crypto && !favorites.some(f => f.id === crypto.id)) {
                favorites.push(crypto);
                saveFavorites();
                updateFavoritesList();
            }
        }
    });

    favoritesList.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const cryptoId = event.target.getAttribute("data-id");
            favorites = favorites.filter(f => f.id !== cryptoId);
            saveFavorites();
            updateFavoritesList();
        }
    });

    favoritesToggle.addEventListener("click", () => {
        const isSidebarVisible = sidebar.style.left === '0px';
        if (isSidebarVisible) {
            sidebar.style.left = '-200px';
            mainContent.classList.remove('main-blurred');
        } else {
            sidebar.style.left = '0px';
            mainContent.classList.add('main-blurred');
        }
    });

    currencySelect.addEventListener("change", (event) => {
        currentCurrency = event.target.value;
        fetchCryptoData(currentCurrency);
    });

    function saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    function loadFavorites() {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            favorites = JSON.parse(storedFavorites);
        }
    }

    function updateFavoritesList() {
        favoritesList.innerHTML = "";
        favorites.forEach(favorite => {
            const favoriteItem = document.createElement("div");
            favoriteItem.className = "favorite-item";
            favoriteItem.innerHTML = `
                <span>${favorite.name}</span>
                <button data-id="${favorite.id}">Remove</button>
            `;
            favoritesList.appendChild(favoriteItem);
        });
    }

    loadFavorites();
    updateFavoritesList();
    fetchCryptoData(currentCurrency);
});





