document.addEventListener('DOMContentLoaded', function(event) {
    const body = document.querySelector("body");
    const pokedexMainContainer = body.querySelector("#pokedex-main-container");
    const generations = [151, 251, 386, 493, 649, 721, 809];
    let gen = 0;
    let results = [];

    // Carousel Items
    const totalItems = 6;
    let currentItem = 0;

    // Check If Some User is already Logged in
    if(localStorage.getItem("user-name")) {
        userhasLoggedIn();
    }
    else {
        window.location.replace("http://127.0.0.1:5500/login.html");
    }

    function userhasLoggedIn() {
        const headerContent = body.querySelector(".header-content");
        const usernameInHeader = headerContent.querySelector("p");
        const signOut = headerContent.querySelector("a");
        const generationsLis = pokedexMainContainer.querySelectorAll("nav li");
        const h1 = pokedexMainContainer.querySelector("h1");

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
                    changeGenerationHeading(h1);
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

        const previousButton = pokedexMainContainer.querySelector(".previous-button");
        const nextButton = pokedexMainContainer.querySelector(".next-button");
        const ul = pokedexMainContainer.querySelector(".carousel > ul");
        const liList = pokedexMainContainer.querySelectorAll(".carousel li");
        const carouselDotsArray = pokedexMainContainer.querySelectorAll(".carousel-buttons span");

        document.addEventListener("keydown", function(event) {
            if(event.key === "ArrowLeft") {
                changeDisplayedItem(ul, liList, carouselDotsArray, true, -1);
            }
            else if(event.key === "ArrowRight") {
                changeDisplayedItem(ul, liList, carouselDotsArray, true, 1);
            }
        })

        previousButton.addEventListener("click", function() {
            changeDisplayedItem(ul, liList, carouselDotsArray, true, -1);
        });

        nextButton.addEventListener("click", function() {
            changeDisplayedItem(ul, liList, carouselDotsArray, true, 1);
        });

        for(let carouselDot of carouselDotsArray) {
            carouselDot.addEventListener("click", function() {
                changeDisplayedItem(ul, liList, carouselDotsArray, false, parseInt(this.getAttribute("data-id")));
            });
        }

        changeGenerationHeading(h1);
        getPokemons(pokedexMainContainer);
    }

    function changeGenerationHeading(h1) {
        h1.classList.remove("display-none");
        h1.innerText = "Generation " + (gen+1);
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
                if(ajaxCount == totalPokemons) {
                    setImagesOfCarousel(start);
                    displayData(start, end, pokedexMainContainer);
                }
            }
        }
    }

    function displayData(start, end, pokedexMainContainer) {
        console.log(results);
        console.log("Ajax complete");
        let carousel = pokedexMainContainer.querySelector(".carousel");
        let carouselButtons = pokedexMainContainer.querySelector(".carousel-buttons");
        let ul = pokedexMainContainer.querySelector(".pokemons");
        let carouselUl = carousel.querySelector("ul");
        let liList = carouselUl.querySelectorAll("li");
        ul.innerHTML = "";

        for(let i = start; i <= end; i++) {
            let li = document.createElement("li");
            li.setAttribute("data-number", i);
            li.classList.add(results[i].type);
            li.addEventListener("click", function() {
                const clickedPokemonId = parseInt(this.getAttribute("data-number"));
                localStorage.setItem("pokemon-id", clickedPokemonId);
                console.log(localStorage.getItem("pokemon-id"));
            });
            const {name, id, type, front_image} = results[i];
            const html = `
                <div class="round" style="background-image: url('${front_image}')"></div>
                <p class="pokedex-number">#00${id}</p>
                <p class="pokemon-name">${name}</p>
                <p class="pokemon-main-type">Type: ${type}</p>
                `;
            li.innerHTML = html;
            ul.appendChild(li);
        }

        ul.classList.remove("display-none");
        carousel.classList.remove("display-none");
        carouselButtons.classList.remove("display-none");

        // carouselUl.appendChild(liList[0].cloneNode(true));
        // carouselUl.insertBefore(liList[liList.length-1].cloneNode(true), liList[0]);
    }

    function setImagesOfCarousel(start) {
        const liList = pokedexMainContainer.querySelectorAll(".carousel li");
        for(let li of liList) {
            let img = li.querySelector("img");
            img.setAttribute("src", results[start++].front_image);
        }
        
    }

    function changeDisplayedItem(ul, liList, carouselDotsArray,onNextPrevClick, number) {
        liList[currentItem].classList.remove("selected");
        carouselDotsArray[currentItem].classList.remove("selected");
        if(onNextPrevClick) {
            if(currentItem == 0 && number == -1) {
                currentItem = totalItems - 1;
            }
            else if(currentItem == (totalItems-1) && number == 1) {
                currentItem = 0;
            }
            else {
                currentItem = currentItem + number;
            }
        }
        else {
            currentItem = number;
        }
        liList[currentItem].classList.add("selected");
        carouselDotsArray[currentItem].classList.add("selected");
        horizontalScrollToElement(ul, liList[currentItem].offsetLeft, 400);
    }

    function horizontalScrollToElement(scrollLayer, destination, duration) {
        if (duration <= 0) {
            return;
        }
        const difference = destination - scrollLayer.scrollLeft - 50;
        const perTick = (difference / duration) * 10;
    
        let timeout = setTimeout(function() {
            scrollLayer.scrollLeft = scrollLayer.scrollLeft + perTick;
            if (scrollLayer.scrollLeft === destination) {
                clearTimeout(timeout);
                return;
            }
            horizontalScrollToElement(scrollLayer, destination, duration - 10);
        }, 10);
    }
});