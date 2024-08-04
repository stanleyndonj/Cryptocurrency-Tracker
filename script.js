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

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const sidebar = document.getElementById("sidebar");
    const body = document.querySelector("body");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        body.classList.toggle("sidebar-hidden");
    });

    function updateFavorites() {
        favoritesList.innerHTML = "";
        favorites.forEach(favorite => {
            const favoriteItem = document.createElement("div");
            favoriteItem.classList.add("favorite-item");
            favoriteItem.innerHTML = `
                <span>${favorite.name}</span>
                <button class="remove-favorite" data-id="${favorite.id}">Remove</button>
            `;
            favoritesList.appendChild(favoriteItem);
        });
    }

    function fetchData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                cryptoList.innerHTML = "";
                data.forEach(crypto => {
                    const cryptoItem = document.createElement("div");
                    cryptoItem.classList.add("crypto-item");
                    cryptoItem.innerHTML = `
                        <img src="${crypto.image}" alt="${crypto.name}">
                        <h3>${crypto.name}</h3>
                        <p>$${crypto.current_price}</p>
                        <p>${crypto.price_change_percentage_24h}%</p>
                        <button class="add-favorite" data-id="${crypto.id}" data-name="${crypto.name}">Add to Favorites</button>
                    `;
                    cryptoList.appendChild(cryptoItem);
                });

                const btc = data.find(crypto => crypto.id === "bitcoin");
                const eth = data.find(crypto => crypto.id === "ethereum");

                btcPrice.textContent = `$${btc.current_price}`;
                btcChange.textContent = `24 Hour Change ${btc.price_change_percentage_24h}%`;
                btcMarketCap.textContent = `Market Cap: $${btc.market_cap}`;
                btcVolume.textContent = `Volume: $${btc.total_volume}`;

                ethPrice.textContent = `$${eth.current_price}`;
                ethChange.textContent = `24 Hour Change ${eth.price_change_percentage_24h}%`;
                ethMarketCap.textContent = `Market Cap: $${eth.market_cap}`;
                ethVolume.textContent = `Volume: $${eth.total_volume}`;

                const now = new Date();
                lastSynced.textContent = now.toLocaleString();

                const top10 = data.slice(0, 10);
                const chartLabels = top10.map(crypto => crypto.name);
                const chartData = top10.map(crypto => crypto.current_price);
                new Chart(top10ChartCtx, {
                    type: "bar",
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: "Price (USD)",
                            data: chartData,
                            backgroundColor: "rgba(0, 123, 255, 0.5)",
                            borderColor: "rgba(0, 123, 255, 1)",
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
            });
    }

    fetchData();
    updateFavorites();

    searchBtn.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredFavorites = favorites.filter(favorite => favorite.name.toLowerCase().includes(searchTerm));
        favoritesList.innerHTML = "";
        filteredFavorites.forEach(favorite => {
            const favoriteItem = document.createElement("div");
            favoriteItem.classList.add("favorite-item");
            favoriteItem.innerHTML = `
                <span>${favorite.name}</span>
                <button class="remove-favorite" data-id="${favorite.id}">Remove</button>
            `;
            favoritesList.appendChild(favoriteItem);
        });
    });

    favoritesList.addEventListener("click", event => {
        if (event.target.classList.contains("remove-favorite")) {
            const id = event.target.dataset.id;
            favorites = favorites.filter(favorite => favorite.id !== id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            updateFavorites();
        }
    });

    cryptoList.addEventListener("click", event => {
        if (event.target.classList.contains("add-favorite")) {
            const id = event.target.dataset.id;
            const name = event.target.dataset.name;
            if (!favorites.some(favorite => favorite.id === id)) {
                favorites.push({ id, name });
                localStorage.setItem("favorites", JSON.stringify(favorites));
                updateFavorites();
            }
        }
    });

    currencySelect.addEventListener("change", () => {
        const currency = currencySelect.value;
        fetch(`${apiUrl}&vs_currency=${currency}`)
            .then(response => response.json())
            .then(data => {
                const btc = data.find(crypto => crypto.id === "bitcoin");
                const eth = data.find(crypto => crypto.id === "ethereum");

                btcPrice.textContent = `${currency.toUpperCase()} ${btc.current_price}`;
                btcChange.textContent = `24 Hour Change ${btc.price_change_percentage_24h}%`;
                btcMarketCap.textContent = `Market Cap: ${currency.toUpperCase()} ${btc.market_cap}`;
                btcVolume.textContent = `Volume: ${currency.toUpperCase()} ${btc.total_volume}`;

                ethPrice.textContent = `${currency.toUpperCase()} ${eth.current_price}`;
                ethChange.textContent = `24 Hour Change ${eth.price_change_percentage_24h}%`;
                ethMarketCap.textContent = `Market Cap: ${currency.toUpperCase()} ${eth.market_cap}`;
                ethVolume.textContent = `Volume: ${currency.toUpperCase()} ${eth.total_volume}`;
            });
    });

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
