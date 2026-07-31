const searchbtn = document.getElementById('search')
const searchbar = document.getElementById('searchbar')

const card = document.getElementsByClassName('carouselcard')
const popup = document.getElementById('overlay')

const close = document.getElementById('close')

function hide(){

        searchbar.style.display = searchbar.style.display === 'block' ? 'none' : 'block';

    }

function popupform(){

        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        
    }

function closepopup(){

    popup.style.display = 'none';
}

//fetchAPI @BroCodez

//fetchAPI copilot

document.getElementById('searchGamebtn').addEventListener('click', () => {

    const query = document.getElementById('searchinput').value;
    searchGames(query);

});

function searchGames(query) {

    fetch('http://127.0.0.1:5000/search?query=${encodeURIComponent(query)}')
        .then(Response => Response.json())
        .then(data => {
            console.log("IGDB results:", data);
            displayResults(data);
        })
        .catch(err => console.error("Search error", err));
}


//test delete

function gameSearch() {
    console.log("Button clicked!");

    const query = document.getElementById("searchinput").value;

    fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            console.log("Results:", data);
            displayResults(data);
        })
        .catch(err => console.error("Error:", err));
}

function displayResults(games) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    games.forEach(game => {
        const div = document.createElement("div");
        div.classList.add('gameResult');

        const coverUrl = game.cover ? "https:" + game.cover.url : "";

        // Add Game button
        const btn = document.createElement("button");
        btn.classList.add('addGamebtn')
        btn.textContent = "Add Game";
        btn.addEventListener("click", () => addGame(game));
        div.appendChild(btn);

        // Game name
        const name = document.createElement("p");
        name.innerHTML = `<strong>${game.name}</strong>`;
        div.appendChild(name);

        // Cover image
        if (coverUrl) {
            const img = document.createElement("img");
            img.src = coverUrl;
            img.width = 30;
            div.appendChild(img);
        }

        resultsDiv.appendChild(div);
    });
}

function addGame(game) {
    console.log("game added:", game);

    const landing = document.getElementById("gamelanding");

    const card = document.createElement("div");
    card.classList.add("gameCard");


    const coverUrl = game.cover ? "https:" + game.cover.url : "";

    // Cover image
    const img = document.createElement("img");
    img.src = coverUrl;
    img.classList.add("gameCardImg");
    card.appendChild(img);

    // Title
    const title = document.createElement("p");
    title.classList.add("gameCardTitle");
    title.textContent = game.name;
    card.appendChild(title);


    //remove button
    const btn = document.createElement("button");
    btn.classList.add("removeGame")
    btn.textContent = "Remove"
    card.appendChild(btn);

    landing.appendChild(card);
}


    
