document.addEventListener('DOMContentLoaded', (event) => {
    const body = document.body;
    const pokemonContainer = body.querySelector("#pokemon-container");
    let pokemonData = {
        name: "", id: 0, types: [], front_image: "", weight: 0, height: 0, baseExperience: 0, stats: []
    };

    // Check If Some User is already Logged in
    if(localStorage.getItem("user-name")) {
        // Check If Pokemon Id to be displayed present
        if(sessionStorage.getItem("pokemon-id")) {
            getPokemonData();
        }
        else {
            window.location.replace("http://127.0.0.1:5500/generation.html");
        }
    }
    else {
        window.location.replace("http://127.0.0.1:5500/login.html");
    }

    function getPokemonData() {
        const xhttp = new XMLHttpRequest();
        const url = `https://pokeapi.co/api/v2/pokemon/${sessionStorage.getItem("pokemon-id")}/`;
        xhttp.open("GET", url);
        xhttp.send();
        xhttp.onload = function() {
            let response = JSON.parse(this.responseText);
            pokemonData.name = response.name;
            pokemonData.id = response.id;

            let types = [];
            
            for(let i = 0; i < response.types.length; i++) {
                types[i] = "";
                types[i] = response.types[i].type.name;
            }

            pokemonData.types = types;
            pokemonData.front_image = response.sprites.front_default;
            pokemonData.weight = response.weight;
            pokemonData.height = response.height;
            pokemonData.baseExperience = response.base_experience;

            let stats = [];
            for(let i = 0; i < response.stats.length; i++) {
                stats[i] = response.stats[i].base_stat;
            }
            pokemonData.stats = stats;
            console.log(pokemonData);
            displayPokemonData();
        }
    }

    function displayPokemonData() {
        body.className = "";
        body.classList.add(pokemonData.types[0]);

        let h1 = pokemonContainer.querySelector("h1");
        let img = pokemonContainer.querySelector("figure > img");
        let pokedexNumber = pokemonContainer.querySelector("p");
        let additionalInfos = pokemonContainer.querySelectorAll(".additional-info > span");
        let statsValues = pokemonContainer.querySelectorAll(".stats .stat-value");

        h1.innerText = pokemonData.name;
        img.setAttribute("src", pokemonData.front_image);
        pokedexNumber.innerText = `#00${pokemonData.id}`;
        if(pokemonData.types.length > 1) {
            additionalInfos[0].innerHTML = `<small>Types: </small>${pokemonData.types[0]}, ${pokemonData.types[1]}`;
        }
        else {
            additionalInfos[0].innerHTML = `<small>Type: </small>${pokemonData.types[0]}`;
        }
        additionalInfos[1].innerHTML = `<small>Weight: </small>${pokemonData.weight}`;
        additionalInfos[2].innerHTML = `<small>Height: </small>${pokemonData.height}`;
        additionalInfos[3].innerHTML = `<small>Base-Experience: </small>${pokemonData.baseExperience}`;

        statsValues[0].innerText = pokemonData.stats[0];
        statsValues[1].innerText = pokemonData.stats[5];
        statsValues[2].innerText = pokemonData.stats[1];
        statsValues[3].innerText = pokemonData.stats[2];
        statsValues[4].innerText = pokemonData.stats[3];
        statsValues[5].innerText = pokemonData.stats[4];

        pokemonContainer.classList.remove("display-none");
    }
});