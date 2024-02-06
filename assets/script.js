let searchHistory = [];

function updateSearchHistory() {
    
}

document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    updateSearchHistory();
});


