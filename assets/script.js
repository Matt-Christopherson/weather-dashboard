let searchHistory = [];
let listGroup = document.getElementById('list-group');
let weatherApiKey = '745a84814c6b8fbf996532eb4bc6712f';
let city;

let presentCityEl = document.getElementById('present-city');
let presentWeatherEl = document.getElementById('present-weather');
let presentIconEl = document.getElementById('present-icon');
let presentTempEl = document.getElementById('present-temp');
let presentWindEl = document.getElementById('present-wind');
let presentHumidityEl = document.getElementById('present-humidity');

let day1DateEl = document.getElementById('1date');
let day1IconEl = document.getElementById('1icon');
let day1TempEl = document.getElementById('1temp');
let day1WindEl = document.getElementById('1wind');
let day1HumidityEl = document.getElementById('1humidity');

let day2DateEl = document.getElementById('2date');
let day2IconEl = document.getElementById('2icon');
let day2TempEl = document.getElementById('2temp');
let day2WindEl = document.getElementById('2wind');
let day2HumidityEl = document.getElementById('2humidity');

let day3DateEl = document.getElementById('3date');
let day3IconEl = document.getElementById('3icon');
let day3TempEl = document.getElementById('3temp');
let day3WindEl = document.getElementById('3wind');
let day3HumidityEl = document.getElementById('3humidity');

let day4DateEl = document.getElementById('4date');
let day4IconEl = document.getElementById('4icon');
let day4TempEl = document.getElementById('4temp');
let day4WindEl = document.getElementById('4wind');
let day4HumidityEl = document.getElementById('4humidity');

let day5DateEl = document.getElementById('5date');
let day5IconEl = document.getElementById('5icon');
let day5TempEl = document.getElementById('5temp');
let day5WindEl = document.getElementById('5wind');
let day5HumidityEl = document.getElementById('5humidity');

var dateArray = [day1DateEl, day2DateEl, day3DateEl, day4DateEl, day5DateEl];
var iconArray = [day1IconEl, day2IconEl, day3IconEl, day4IconEl, day5IconEl];
var tempArray = [day1TempEl, day2TempEl, day3TempEl, day4TempEl, day5TempEl];
var windArray = [day1WindEl, day2WindEl, day3WindEl, day4WindEl, day5WindEl];
var humiArray = [day1HumidityEl, day2HumidityEl, day3HumidityEl, day4HumidityEl, day5HumidityEl];

// When the fetch request is made the html is updated with the current weather and a five day forecast.
function getApi() {
    let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + weatherApiKey + '&units=imperial';
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            // The current weather was left out of the for loop because the HTML is slightly different.
            let presentDateString = data.list[0].dt_txt;
            let presentDatePart = presentDateString.slice(0, 10); // The date data from the api also shows the hour of the day, and I didn't like the way it looked so this just takes the date. I did the same thing on line 70.
            presentCityEl.textContent = data.city.name + ' ' + presentDatePart + ' ';
            presentIconURL = 'https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '.png';
            presentWeatherEl.innerHTML = '<img id="present-icon" src="' + presentIconURL + '">' + data.list[0].weather[0].description;
            presentTempEl.textContent = 'Temp: ' + data.list[0].main.temp + '°F';
            presentWindEl.textContent = 'Wind: ' + data.list[0].wind.speed + ' MPH';
            presentHumidityEl.textContent = 'Humidity: ' + data.list[0].main.humidity + '%';
            // This for loop updates the five different cards with the data from the api request. I chose to make it a for loop to try to keep the code as DRY as possible, since this js file is already pretty long.
            for (i = 0; i < data.list.length; i += 8) { // The for loop uses i += 8 instead of i++ because the data in the api array changes days every 8 objects.
                let dateString = data.list[i+1].dt_txt;
                let datePart = dateString.slice(0, 10);
                dateArray[i / 8].innerText = datePart;
                iconURL = 'https://openweathermap.org/img/wn/' + data.list[i+1].weather[0].icon + '.png';
                iconArray[i / 8].setAttribute('src', iconURL);
                tempArray[i / 8].innerText = 'Temp: ' + data.list[i+1].main.temp + '°F';
                windArray[i / 8].textContent = 'Wind: ' + data.list[i+1].wind.speed + ' MPH';
                humiArray[i / 8].textContent = 'Humidity: ' + data.list[i+1].main.humidity + '%';
            }
        })
    }

// Gets the search history from the local storage and lists it below the search bar.
function loadSearchHistory() {
    let oldSearch = JSON.parse(localStorage.getItem('searchHistory')) || [];
    oldSearch.forEach(function(item) {
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'list-group-item list-group-item-action';
        button.textContent = item;
        listGroup.appendChild(button);
    });
    city = localStorage.getItem('lastSearchedCity');
    getApi();
}


// Lists the search history below the search bar and sets it in the local storage.
function updateSearchHistory(searchInput) {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(searchInput);
    console.log(searchHistory);
    listGroup.innerHTML = '';
    searchHistory.forEach(function(item) {
        let newSearch = document.createElement('button');
        newSearch.type = 'button';
        newSearch.className = 'list-group-item list-group-item-action';
        newSearch.setAttribute('id','new-search-button');
        newSearch.textContent = item;
        listGroup.appendChild(newSearch);
    });
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
    location.reload();
});

// Event listener that clears the local storage data when the clear history button is clicked.
document.getElementById('clear-history').addEventListener('click', function(event) {
    event.preventDefault();
    let areYouSure = confirm("Are you sure? Clearing the search history cannot be undone.");
    if (areYouSure) {
        localStorage.removeItem('searchHistory');
        localStorage.removeItem('lastSearchedCity');
        listGroup.innerHTML = '';
    }
    location.reload();
});

// Event listener that checks the text content of the search history button and shows the user the weather for that text content.
listGroup.addEventListener('click', function(event) {
    if (event.target && event.target.matches('.list-group-item')) {
        let buttonTextContent = event.target.textContent;
        city = buttonTextContent;
        localStorage.setItem('lastSearchedCity', buttonTextContent);
        getApi();
    }
    location.reload();
});

// This is for when a user uses the application for the first time, or when the user clears the data. Rather than display empty boxes, the user is only shown the search box.
function checkLocalStorage() {
    if (localStorage.length === 0) {
        document.getElementById('present-card').style.display = 'none';
        document.getElementById('forecast-cards').style.display = 'none';
        let searchColEl = document.getElementById('search-col')
        searchColEl.style.right = '50%';
        searchColEl.style.left = '50%';
        searchColEl.style.transform = 'translate(-50%, -50%)';
        searchColEl.style.top = '40%'
        searchColEl.style.borderTopLeftRadius = '10px';
        searchColEl.style.borderBottomLeftRadius = '10px';
    }
}

// Runs the load search history function when the page loads.
loadSearchHistory();
