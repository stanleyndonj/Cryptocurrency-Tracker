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
    const btcSupply = document.getElementById("btc-supply");
    const ethPrice = document.getElementById("eth-price");
    const ethChange = document.getElementById("eth-change");
    const ethMarketCap = document.getElementById("eth-market-cap");
    const ethVolume = document.getElementById("eth-volume");
    const ethSupply = document.getElementById("eth-supply");
    const lastSynced = document.getElementById("last-synced");
    const top10ChartCtx = document.getElementById("top10Chart").getContext("2d");
    const currencySelect = document.getElementById("currency-select");
    const convertBtn = document.getElementById("convert-btn");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const favoritesToggle = document.getElementById("favorites-toggle");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    let cryptoData = [];
    let top10Chart = null;

    const fetchCryptoData = async (currency = "usd") => {
        try {
            const response = await fetch(`${apiUrl}&order=market_cap_desc&per_page=10&page=1&sparkline=false&vs_currency=${currency}`);
            const data = await response.json();
            cryptoData = data;
            displayCryptoData(currency);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const displayCryptoData = (currency) => {
        cryptoList.innerHTML = "";
        const formatCurrency = (value) => {
            const formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency.toUpperCase(),
            });
            return formatter.format(value);
        };

        cryptoData.forEach((coin) => {
            const cryptoItem = document.createElement("div");
            cryptoItem.className = "crypto-item";
            cryptoItem.innerHTML = `
                <img src="${coin.image}" alt="${coin.name}">
                <h3>${coin.name}</h3>
                <p>${formatCurrency(coin.current_price)}</p>
                <p>24h: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                <p>Market Cap: ${formatCurrency(coin.market_cap)}</p>
                <p>Volume: ${formatCurrency(coin.total_volume)}</p>
                <p>Supply: ${coin.circulating_supply.toFixed(0)} ${coin.symbol.toUpperCase()}</p>
                <button class="add-favorite-btn" data-id="${coin.id}">Add to Favorites</button>
            `;
            cryptoList.appendChild(cryptoItem);
        });

        updateMainCryptoInfo(currency);
        updateTop10Chart(currency);
    };

    const updateMainCryptoInfo = (currency) => {
        const btc = cryptoData.find((coin) => coin.id === "bitcoin");
        const eth = cryptoData.find((coin) => coin.id === "ethereum");

        const formatCurrency = (value) => {
            const formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency.toUpperCase(),
            });
            return formatter.format(value);
        };

        if (btc) {
            btcPrice.textContent = formatCurrency(btc.current_price);
            btcChange.textContent = `24 Hour Change ${btc.price_change_percentage_24h.toFixed(2)}%`;
            btcMarketCap.textContent = `Market Cap: ${formatCurrency(btc.market_cap)}`;
            btcVolume.textContent = `Volume: ${formatCurrency(btc.total_volume)}`;
            btcSupply.textContent = `Supply: ${btc.circulating_supply.toFixed(0)} BTC`;
        }

        if (eth) {
            ethPrice.textContent = formatCurrency(eth.current_price);
            ethChange.textContent = `24 Hour Change ${eth.price_change_percentage_24h.toFixed(2)}%`;
            ethMarketCap.textContent = `Market Cap: ${formatCurrency(eth.market_cap)}`;
            ethVolume.textContent = `Volume: ${formatCurrency(eth.total_volume)}`;
            ethSupply.textContent = `Supply: ${eth.circulating_supply.toFixed(0)} ETH`;
        }

        lastSynced.textContent = new Date().toLocaleString();
    };

    const updateTop10Chart = (currency) => {
        const top10Names = cryptoData.map((coin) => coin.name);
        const top10Prices = cryptoData.map((coin) => coin.current_price);

        const formatCurrency = (value) => {
            const formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency.toUpperCase(),
            });
            return formatter.format(value);
        };

        if (top10Chart) {
            top10Chart.destroy();
        }

        top10Chart = new Chart(top10ChartCtx, {
            type: "bar",
            data: {
                labels: top10Names,
                datasets: [
                    {
                        label: `Price in ${currency.toUpperCase()}`,
                        data: top10Prices,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return formatCurrency(value);
                            },
                        },
                    },
                },
            },
        });
    };

    const addFavorite = (coin) => {
        const favoriteItem = document.createElement("div");
        favoriteItem.className = "favorite-item";
        favoriteItem.innerHTML = `
            <span>${coin.name}</span>
            <button class="remove-favorite-btn" data-id="${coin.id}">Remove</button>
        `;
        favoritesList.appendChild(favoriteItem);
        saveFavoriteToLocalStorage(coin);
    };

    const removeFavorite = (coinId) => {
        const favoriteItems = favoritesList.getElementsByClassName("favorite-item");
        for (const item of favoriteItems) {
            if (item.querySelector("button").dataset.id === coinId) {
                item.remove();
                break;
            }
        }
        removeFavoriteFromLocalStorage(coinId);
    };

    const saveFavoriteToLocalStorage = (coin) => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.push(coin);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    };

    const removeFavoriteFromLocalStorage = (coinId) => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const updatedFavorites = favorites.filter((coin) => coin.id !== coinId);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const loadFavoritesFromLocalStorage = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.forEach((coin) => addFavorite(coin));
    };

    searchBtn.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = cryptoData.filter((coin) => coin.name.toLowerCase().includes(searchTerm));
        displayCryptoData(filteredData);
    });

    cryptoList.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-favorite-btn")) {
            const coinId = event.target.dataset.id;
            const coin = cryptoData.find((coin) => coin.id === coinId);
            if (coin) {
                addFavorite(coin);
            }
        }
    });

    favoritesList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-favorite-btn")) {
            const coinId = event.target.dataset.id;
            removeFavorite(coinId);
        }
    });

    convertBtn.addEventListener("click", () => {
        const selectedCurrency = currencySelect.value;
        fetchCryptoData(selectedCurrency);
    });

    sidebarToggle.addEventListener("click", () => {
        document.body.classList.toggle("sidebar-hidden");
    });

    favoritesToggle.addEventListener("click", () => {
        favoritesList.classList.toggle("hidden");
    });

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    fetchCryptoData();
    loadFavoritesFromLocalStorage();
});
