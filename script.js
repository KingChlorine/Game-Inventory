const searchbtn = document.getElementById('search')
const searchbar = document.getElementById('searchbar')

const card = document.getElementsByClassName('carouselcard')
const popup = document.getElementById('overlay')

const close = document.getElementById('close')
const header = document.getElementById('header')
const editbtn = document.getElementById('editbutton')


function hide(){

        searchbar.style.display = searchbar.style.display === 'block' ? 'none' : 'block';
        header.classList.toggle('hidden');
        editbtn.classList.toggle('hidden');

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

    fetch(`https://game-inventory-backend.onrender.com/search?query=${encodeURIComponent(query)}`)

        .then(Response => Response.json())
        .then(data => {
            console.log("IGDB results:", data);
            displayResults(data);
        })
        .catch(err => console.error("Search error", err));
}


function gameSearch() {
    console.log("Button clicked!");

    const query = document.getElementById("searchinput").value;

    fetch(`https://game-inventory-backend.onrender.com/search?query=${encodeURIComponent(query)}`)

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

        const coverUrl = game.cover ? 
        "https:" + game.cover.url.replace("t_thumb", "t_1080p") 
        : "";

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


// Function to add a game card to the landing page

function addGame(game) {
    console.log("game added:", game);

    const landing = document.getElementById("gamelanding");

    const card = document.createElement("div");
    card.classList.add("gameCard");


      const coverUrl = game.cover ? 
        "https:" + game.cover.url.replace("t_thumb", "t_1080p") 
        : "";


    // Cover image
    const img = document.createElement("img");
    img.classList.add("gameCardImg");
    img.src = coverUrl;
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
    btn.addEventListener("click", () => {
        landing.removeChild(card);
    });
    card.appendChild(btn);

    landing.appendChild(card);
}

// Search function for filtering game cards

function search() {
    const searchValue = document.getElementById("searchbar").value.toLowerCase();
    const cards = document.getElementsByClassName("gameCard");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const title = card.querySelector(".gameCardTitle").textContent.toLowerCase();

        if (title.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

