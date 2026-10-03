const searchbtn = document.getElementById('search')
const searchbar = document.getElementById('searchbar')
let selectedPlatform = null;

const card = document.getElementsByClassName('carouselcard')
const popup = document.getElementById('overlay')

const close = document.getElementById('close')
const resultsDiv = document.getElementById("results");
const gameName = document.getElementsByClassName('gameName')

const host = "https://game-inventory-backend.onrender.com"

//move search bar on mobilescreen 

const mobileSearch = document.querySelector('.mobileSearch');
const searchbox = document.querySelector(".searchbox");
const navbar = document.getElementById('navbar');
const editbutton = document.getElementById('editbutton')

function moveSearchbox() {
    
    if (window.innerWidth <= 800) {
        mobileSearch.appendChild(searchbox);
        mobileSearch.classList.add("mo")
    } else {
        navbar.insertBefore(searchbox, editbutton);
    }
}

moveSearchbox(); 

//This changes colour of navbar from main theme to black when page is scrolled

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

//When + is pressed, checks if addGame popup is visible and if not makes it visible

function popupform(){

        popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
        
    }

  
//When closepopupbtn is pressed the popup closes


function closepopup(){

    popup.style.display = 'none';

}



//when searchGambtn is clicked, gameSearch() function ins called

document.getElementById('searchGamebtn').addEventListener('click', () => {

    gameSearch();

});


//The query variable is interpolated into the url to fetch igdb data. API response is converted to json and logged
//this data is then passed to the displayResults() function. If search fails, error is logged
function gameSearch() {
    const query = document.getElementById('searchinput').value;
    fetch(`${host}/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            console.log("Results:", data);
            displayResults(data);
        })
        .catch(err => console.error("Error:", err));
}

//this function recieves an array from the gameSearch function. A resultsDiv is created and a name 
// and image for each game is created using the values in the array and then added to the resultsDiv

function displayResults(games) {
    
    resultsDiv.innerHTML = "";

    games.forEach(game => {
        const div = document.createElement("div");
        div.classList.add('gameResult');

        const coverUrl = game.cover ? "https:" + game.cover.url.replace('t_thumb', 't_1080p') : "";
        
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

//this function is called when the addGame button is clicked. Game and selectedPlatform are
// passed to this function and written to JSON

function addGame(game, selectedPlatform) {
    console.log("game added:", game);
    const coverUrl = game.cover ? "https:" + game.cover.url.replace('t_thumb', 't_1080p') : "";
    writeGameToJSON({ id: game.id, name: game.name, cover: coverUrl, platform: selectedPlatform });
   
}

// This function filters which owned games are visible. Searchbar input is used to loop through gameCards. 
// If the title of a game gard matches the search value, nothing is changed, if the title does not match, 
// the display is set to none.

function search(platform) {
    
    const searchValue = document.getElementById("searchbar").value.toLowerCase();
    const cards = document.getElementsByClassName("gameCard");
    const platformContainers = document.getElementsByClassName("platformContainer");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const title = card.querySelector(".gameCardTitle").textContent.toLowerCase();

        const match = title.startsWith(searchValue) || title.includes(searchValue);
        card.style.display = match ? "" : "none";
    }

    
    for (let landing of platformContainers) {
        const header = landing.getElementsByClassName("platformHeader")[0];
        const visibleCrds = landing.querySelectorAll(".gameCard:not([style*='display: none'])");
        header.style.display = visibleCrds.length > 0 ? "" : "none";
    }

}

//needs more understanding************
// This function uses add_game endpoint to make post request to flask backend
// When game is successfully added to json, that updated json renders game cards

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
    .catch(err => console.error("Error:", err))
    .finally(renderGamesFromJSON);
}

//This function creates game cards for added games then returns cards to be used

function createCards(game) {
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
            btn.textContent = "X"
            btn.addEventListener("click", () => {
                deleteGamefromJSON(game.id);
            });
          
            card.appendChild(btn);

           return card;

}

//this function creates platform landing areas to sort cards

function renderPlatform(game, card) {
    const platformName = game.platform
    const platformClass = platformName.toLowerCase() + "landing";
    let landing = document.querySelector("." + platformClass)
    
        
            
            if (landing) {
                landing.appendChild(card)
                }
            else {
                landing = document.createElement("div")
                const header = document.createElement("h2")
                header.classList.add("platformHeader")
                const gamelanding = document.getElementById("gamelanding")
                header.textContent = game.platform
                landing.classList.add(platformClass)
                landing.classList.add("platformContainer")
                gamelanding.appendChild(landing)
                landing.appendChild(header)
                landing.appendChild(card)
            }
            
}

function renderGamesFromJSON(games) {
    
    fetch(`${host}/games`)
    .then(response => response.json())
    .then(data => { 
        console.log("json fetched", data);
        document.getElementById("gamelanding").innerHTML = "";

        data.forEach(game => {
            console.log(game.name)

            //removed cards 
            createCards(game)

            //removed if else platform logic
            const card = createCards(game)
            renderPlatform(game, card)
            

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



//this populates the html of the details modal state
function createGameDetails(game) { 
     let selectedPlatform = null;

    const detailsdiv = document.getElementById("details")
    detailsdiv.innerHTML = ""
    const detailsimage = document.createElement("img")
    detailsimage.src = game.cover ? `https:${game.cover.url.replace('t_thumb', 't_1080p')}` : ""
    detailsimage.style.width = "25%"
    detailsdiv.innerHTML = game.name
    detailsdiv.appendChild(detailsimage)
    const platformselect = document.createElement("select");
    platformselect.id = "platformselect"
    const platforms = document.createElement("div");
    const platform1 = document.createElement("button");
    platform1.value = "PC";
    platform1.textContent = "PC";
    const platform2 = document.createElement("button");
    const platform3 = document.createElement("button");
    platform2.value = "PS2";
    platform2.textContent = "PS2";
    platform3.value = "PS3";
    platform3.textContent = "PS3";
    const platform4 = document.createElement("button");
    platform4.value = "PS4";
    platform4.textContent = "PS4";
    const platform5 = document.createElement("button");
    platform5.value = "PS5";
    platform5.textContent = "PS5";  
    platforms.appendChild(platform1);
    platforms.appendChild(platform2);
    platforms.appendChild(platform3);
    platforms.appendChild(platform4); 
    platforms.appendChild(platform5);  
    detailsdiv.appendChild(platforms);
    platforms.classList.add("platforms");
    const btn = document.createElement("button");
        btn.classList.add('addGamebtn')
        btn.textContent = "Add Game";
        btn.addEventListener("click", () => addGame(game, selectedPlatform));
        detailsdiv.appendChild(btn);
    
    platform1.addEventListener("click", () => {
        selectedPlatform = platform1.value;
        console.log("Selected platform:", selectedPlatform);
        return selectedPlatform;
    });
    platform2.addEventListener("click", () => {
        selectedPlatform = platform2.value;
        console.log("Selected platform:", selectedPlatform);
        return selectedPlatform;
    });
    platform3.addEventListener("click", () => {
        selectedPlatform = platform3.value;
        console.log("Selected platform:", selectedPlatform);
        return selectedPlatform;
    });
    platform4.addEventListener("click", () => {
        selectedPlatform = platform4.value;
        console.log("Selected platform:", selectedPlatform);
        return selectedPlatform;
    });
    platform5.addEventListener("click", () => { 
        selectedPlatform = platform5.value; 
        console.log("Selected platform:", selectedPlatform);
        return selectedPlatform;
    });
  return selectedPlatform;
}

//this funtion hides results and displays the details modal state
function displayDetails() {
    const resultContainer = document.getElementById("results")
    const searchContainer = document.getElementById("searchContainer")
    const results = document.getElementById("results")
    const detailsdiv = document.getElementById("details")
    const resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "none";
    resultContainer.style.display = "none";
    results.style.display = "none"
    searchContainer.style.display = "none"
    detailsdiv.style.display = "flex"
    detailsdiv.style.fontSize = "1em"
    }

//this function returns the user to results state and hides details modal state
function hideDetails() {
    const popupnav = document.querySelector(".popupnav");
    const backbtn = document.createElement("button");
    const detailsdiv = document.getElementById("details")
    const resultsDiv = document.getElementById("results");
    const searchContainer = document.getElementById("searchContainer")
    const results = document.getElementById("results")
    backbtn.classList.add('backbtn')
    backbtn.textContent = "↩"
    backbtn.addEventListener("click", () => {
        detailsdiv.style.display = "none";
        resultsDiv.style.display = "flex";
        results.style.display = "flex";
        searchContainer.style.display = "flex";
        backbtn.style.display = "none";})
        popupnav.appendChild(backbtn);
}




function showGameDetails(game) {
  
    displayDetails()
    createGameDetails(game)
    hideDetails() 

}


window.onload = renderGamesFromJSON;

