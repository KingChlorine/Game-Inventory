const searchbtn = document.getElementById('search')
const searchbar = document.getElementById('searchbar')

const card = document.getElementsByClassName('carouselcard')
const popup = document.getElementById('overlay')

const close = document.getElementById('close')
const resultsDiv = document.getElementById("results");
const gameName = document.getElementsByClassName('gameName')

const host = "https://game-inventory-backend.onrender.com"

//function hide(){

//        searchbar.style.display = searchbar.style.display === 'block' ? 'none' : 'block';

//    }

function popupform(){

        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        
    }

function closepopup(){

    popup.style.display = 'none';
    close.addEventListener("click", () => {renderGamesFromJSON()})
}



//fetchAPI copilot

document.getElementById('searchGamebtn').addEventListener('click', () => {

    const query = document.getElementById('searchinput').value;
    gameSearch();

});


//used copilot to generate these functions


function gameSearch() {
    console.log("Button clicked!");

    const query = document.getElementById("searchinput").value;

    fetch(`${host}/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            console.log("Results:", data);
            displayResults(data);
        })
        .catch(err => console.error("Error:", err));
}

function displayResults(games) {
    
    resultsDiv.innerHTML = "";

    games.forEach(game => {
        const div = document.createElement("div");
        div.classList.add('gameResult');

        const coverUrl = game.cover ? "https:" + game.cover.url.replace('t_thumb', 't_1080p') : "";

        // Add Game button
        const btn = document.createElement("button");
        btn.classList.add('addGamebtn')
        btn.textContent = "Add Game";
        btn.addEventListener("click", () => addGame(game));
        div.appendChild(btn);

        // Game name
        const name = document.createElement("p");
        name.innerHTML = `<strong>${game.name}</strong>`;
        name.classList.add("gameName");
        name.addEventListener("click", () => showGameDetails(game, name));
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

    const coverUrl = game.cover ? "https:" + game.cover.url.replace('t_thumb', 't_1080p') : "";
 

    writeGameToJSON({ id: game.id, name: game.name, cover: coverUrl });
    renderGamesFromJSON();
   

   
}

function search() {
    const searchValue = document.getElementById("searchbar").value.toLowerCase();
    const cards = document.getElementsByClassName("gameCard");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const title = card.querySelector(".gameCardTitle").textContent.toLowerCase();

        if (title.startsWith(searchValue) || title.includes(searchValue)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

//write game data to json file using fetch and post request to flask server

function writeGameToJSON(game) { 
    fetch(`${host}/add_game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
    .then(response => response.json())
    .then(data => console.log("Game added:", data))
    .catch(err => console.error("Error:", err));
}


//render games from JSON


function renderGamesFromJSON(games) {
    

    const landing = document.getElementById("gamelanding");
    landing.innerHTML = ""
    

    fetch(`${host}/games`)
    .then(response => response.json())
    .then(data => { 
        console.log("json fetched", data);

        data.forEach(game => {
            console.log(game.name)

            const card = document.createElement("div");
            card.classList.add("gameCard");

            //create game image
            
            
            const image = document.createElement("img");
            image.src = game.cover
            image.classList.add("gameCardImg");
            card.appendChild(image);

            //create game name
            const name = document.createElement("p");
            name.innerHTML = game.name
            name.classList.add("gameCardTitle");
            card.appendChild(name);
            

             //remove button
            const btn = document.createElement("button");
            btn.classList.add("removeGame")
            btn.textContent = "Remove"
            btn.addEventListener("click", () => {
                deleteGamefromJSON(game.id);
            });
          
            card.appendChild(btn);

          
            landing.appendChild(card)
            

        });

    })

    .catch(err => console.error("Error:", err));


}



function deleteGamefromJSON(id) { 
    fetch(`${host}/delete_game/${id}`, {
        method: 'DELETE',
      
    })
    
    .then(() => renderGamesFromJSON())
    .catch(err => console.error("Error:", err));
    
}


//resultsDive
//name
//function to click game result name anch change modal to show enlarged image, 
// platform selection and add game button



function showGameDetails(game, name) {
    name.style.color = "blue"
    
  

}


window.onload = renderGamesFromJSON;

