let searchHistory = [];
let listGroup = document.getElementById('list-group')

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
})

function updateSearchHistory(searchInput) {
    searchHistory.push(searchInput);
    console.log(searchHistory);
    listGroup.innerHTML = '';
    for (i = 0; i < searchHistory.length; i++) {
        newSearch = document.createElement('button');
        newSearch.type = 'button';
        newSearch.className = 'list-group-item list-group-item-action';
        newSearch.textContent = searchHistory[i];
        listGroup.appendChild(newSearch);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    updateSearchHistory(searchInput);
});

document.getElementById('clear-history').addEventListener('click', function(event) {
    event.preventDefault();
    let areYouSure = confirm("Are you sure? Clearing the search history cannot be undone.");
    if (areYouSure) {
      localStorage.clear();
      location.reload();
    }
});