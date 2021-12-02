document.addEventListener('DOMContentLoaded', function(event) {
    const generations = [151, 251, 386, 493, 649, 721, 809];
    let gen = 0;
    let results = [];

    if(localStorage.getItem("user-name")) {
        userhasLoggedIn();
    }
    else {
        window.location.replace("http://127.0.0.1:5500/login.html");
    }

    function userhasLoggedIn() {
        const body = document.querySelector("body");
        const headerContent = body.querySelector(".header-content");
        const usernameInHeader = headerContent.querySelector("p");
        const signOut = headerContent.querySelector("a");
        const pokedexMainContainer = body.querySelector("#pokedex-main-container");
        const generationsLis = pokedexMainContainer.querySelectorAll("nav li");

        usernameInHeader.innerText = "Hello! " + localStorage.getItem("user-name");
        signOut.addEventListener("click", function() {
            localStorage.removeItem("user-name");
            window.location.replace("http://127.0.0.1:5500/login.html");
        });

        for(let generationLi of generationsLis) {
            generationLi.querySelector("a").addEventListener("click", function() {
                let genClicked = parseInt(this.getAttribute("data-id"));
                if(genClicked == gen) {
                }
                else {
                    generationsLis[gen].classList.remove("selected");
                    generationsLis[genClicked].classList.add("selected");
                    gen = genClicked;
                    if(results[generations[genClicked]]) {
                        let start;
                        if(gen == 0) {
                            start = 1
                        }
                        else {
                            start = generations[gen-1] + 1;
                        }
                        let end = generations[gen];
                        displayData(start, end, pokedexMainContainer);
                    }
                    else {
                        getPokemons(pokedexMainContainer);
                    }
                }
            });
        }

        getPokemons(pokedexMainContainer);
    }

    function getPokemons(pokedexMainContainer) {
        let start;
        if(gen == 0) {
            start = 1
        }
        else {
            start = generations[gen-1] + 1;
        }
        let end = generations[gen], totalPokemons = end - start;
        let ajaxCount = 0;

        for(let i = start; i <= end; i++) {
            results[i] = {};
            const xhttp = new XMLHttpRequest();
            const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
            xhttp.open("GET", url);
            xhttp.send();
            xhttp.onload = function() {
                let response = JSON.parse(this.responseText);
                let id = response.id;
                
                results[id].name = response.name;
                results[id].id = id;
                results[id].type = response.types[0].type.name;
                results[id].front_image = response.sprites.front_default;
                ++ajaxCount;
                if(ajaxCount >= totalPokemons) {
                    displayData(start, end, pokedexMainContainer);
                }
            }
        }
    }

    function displayData(start, end, pokedexMainContainer) {
        console.log(results);
        console.log("Ajax complete");
        let ul = pokedexMainContainer.querySelector(".pokemons");

        ul.innerHTML = "";

        for(let i = start; i <= end; i++) {
            let li = document.createElement("li");
            li.setAttribute("data-number", i);
            li.classList.add(results[i].type);
            li.addEventListener("click", function() {
                
            });
            const {name, id, type, front_image} = results[i];
            const item = `
                <div class="round" style="background-image: url('${front_image}')"></div>
                <p class="pokedex-number">#00${id}</p>
                <p class="pokemon-name">${name}</p>
                <p class="pokemon-main-type">Type: ${type}</p>
                `;
            li.innerHTML = item;
            ul.appendChild(li);
        }

        ul.classList.remove("display-none");
    }
});