# Cryptocurrency-Tracker
# Project Overview
The Cryptocurrency Tracker is a web application designed to provide real-time updates on cryptocurrency prices. This application aims to offer users an interactive platform to monitor the market, search for specific currencies, convert prices into various fiat currencies, and access additional information about each cryptocurrency.

# Features
# 2 Real-time Cryptocurrency Price Display:

Displays live prices of popular cryptocurrencies.
Dynamically updates the DOM to reflect the latest data fetched from the API.
# 2 Search Functionality:

Allows users to search for specific cryptocurrencies by name or symbol.
Displays search results dynamically on the page.
# 3 Currency Conversion:

Enables users to convert cryptocurrency prices into various fiat currencies (e.g., USD, EUR, GBP).
Provides a seamless user experience with real-time conversion rates.
# 4 Interactive Sidebar:

Includes a toggleable sidebar that displays additional information about selected cryptocurrencies.
Enhances user interaction and provides more in-depth data.

# Technologies Used
HTML
CSS
JavaScript
CoinGecko API
# API Usage
We utilize the CoinGecko API to fetch real-time data for various cryptocurrencies. The API provides comprehensive data, including current prices, historical data, market caps, and more.

# API Endpoints
# 1 Fetching Real-time Prices:

GET /coins/markets to retrieve the latest prices of selected cryptocurrencies.
# 2 Search Functionality:

GET /coins/list to get a list of all available cryptocurrencies.
# 3 Currency Conversion:

GET /simple/price to fetch exchange rates for various fiat currencies.
# 4 Additional Information:

GET /coins/{id} to fetch detailed information about specific cryptocurrencies.
# Setup and Installation
Clone the repository:

bash
Copy code
git clone git@github.com:stanleyndonj/Cryptocurrency-Tracker.git 
Navigate to the project directory:

bash
Copy code
cd cryptocurrency-tracker
Open index.html in your web browser to view the application.

# Code Structure
The project is structured as follows:

index.html: The main HTML file.

styles.css: The CSS file for styling the application.

script.js: The JavaScript file containing all the logic for fetching data, updating the DOM, and handling user interactions.
# Challenges
# 1 Ensuring Real-time Data Updates:

Continuously fetching and updating data without overwhelming the API or causing performance issues.
Implementing efficient polling or WebSocket techniques to achieve real-time updates.
# 2 Handling Asynchronous Data Fetching:

Managing asynchronous operations and ensuring smooth UI updates.
Properly handling errors and edge cases when fetching data from the API.
# 3 Maintaining Code Structure and Reusability:

Writing clean, modular code that is easy to maintain and extend.
Ensuring that the codebase adheres to best practices and is well-documented.
# 4 Optimizing Performance:

Ensuring the application performs well even with large datasets.
Implementing efficient DOM manipulation and event handling techniques.
# Contribution
Feel free to fork this repository and make changes. Pull requests are welcome!

# License
This project is licensed under the MIT License.

# Contact
For any questions or feedback, please contact us at [stanley.ndonj@student.moringaschool.com].


