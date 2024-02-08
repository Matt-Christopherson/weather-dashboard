let searchHistory = [];
let listGroup = document.getElementById('list-group');
let weatherApiKey = '745a84814c6b8fbf996532eb4bc6712f';
let city;
let currentDay = dayjs().format("M/D/YYYY");
let presentCityEl = document.getElementById('present-city');
let presentTempEl = document.getElementById('present-temp');
let presentWindEl = document.getElementById('present-wind');
let presentHumidityEl = document.getElementById('present-humidity');

function getApi() {
    let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherApiKey + '&units=imperial';
    fetch(queryURL)
        .then(function (response) {
            console.log("Response Status: " + response.status);
            // If there's an error with the fetch, the user will be alerted.
            if (response.status !== 200) {
                alert('City not found, try again.');
            }
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            presentCityEl.textContent = data.name + ' ' + currentDay;
            presentTempEl.textContent = 'Temp: ' + data.main.temp + '°F';
            presentWindEl.textContent = 'Wind: ' + data.wind.speed + ' MPH';
            presentHumidityEl.textContent = 'Humidity: ' + data.main.humidity + '%'
        })
    }

// Gets the search history from the local storage and lists it below the search bar when the page is loaded.
$(function() {
    let oldSearch = JSON.parse(localStorage.getItem('searchHistory'));
    console.log(oldSearch);
    for (i = 0; i < oldSearch.length; i++) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'list-group-item list-group-item-action';
        button.textContent = oldSearch [i];
        listGroup.appendChild(button);
    }
    $("#present-city").text(currentDay); // Lists the current date at the top of the present day card when no city is listed.
})

// Lists the search history below the search bar and sets it in the local storage.
function updateSearchHistory(searchInput) {
    searchHistory.push(searchInput);
    console.log(searchHistory);
    listGroup.innerHTML = '';
    for (i = 0; i < searchHistory.length; i++) {
        newSearch = document.createElement('button');
        newSearch.type = 'button';
        newSearch.className = 'list-group-item list-group-item-action';
        newSearch.setAttribute('id','new-search-button');
        newSearch.textContent = searchHistory[i];
        listGroup.appendChild(newSearch);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    localStorage.setItem('lastSearchedCity', searchInput);
}

// Event listener that runs updateSearchHistory and shows the user the weather for their selected city when the submit button is clicked.
document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    updateSearchHistory(searchInput);
    city = searchInput;
    getApi();
});

// Event listener that clears the local storage data when the clear history button is clicked.
document.getElementById('clear-history').addEventListener('click', function(event) {
    event.preventDefault();
    let areYouSure = confirm("Are you sure? Clearing the search history cannot be undone.");
    if (areYouSure) {
      localStorage.clear();
      location.reload();
    }
});

// Event listener that checks the text content of the search history button and shows the user the weather for that text content.
listGroup.addEventListener('click', function(event) {
    if (event.target && event.target.matches('.list-group-item')) {
        let buttonTextContent = event.target.textContent;
        city = buttonTextContent;
        getApi();
    }
});