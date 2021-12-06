document.addEventListener('DOMContentLoaded', function(event) {
    const body = document.querySelector("body");
    const pokedexMainContainer = body.querySelector("#pokedex-main-container");
    const generations = [151, 251, 386, 493, 649, 721, 809];
    let gen = 0;
    let results = [];

    // Carousel Items
    const totalItems = 6;
    let currentItem = 1;

    let carouselUl;
    let liList;

    // Check If Some User has already Logged in
    if(localStorage.getItem("user-name")) {
        if(sessionStorage.getItem("generation")) {
            gen = parseInt(sessionStorage.getItem("generation")) - 1;
            sessionStorage.removeItem("generation");
        }
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
        const hamburgerMobile = body.querySelector(".hamburger-mobile");
        const generationNavUl = body.querySelector(".generation-nav > ul");

        usernameInHeader.innerText = "Hello! " + localStorage.getItem("user-name");

        hamburgerMobile.addEventListener("click", function() {
            generationNavUl.classList.toggle("display-block-for-mobile-only");
        });

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
                        setImagesOfCarousel(start)
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
        const carouselDotsArray = pokedexMainContainer.querySelectorAll(".carousel-buttons span");

        document.addEventListener("keydown", function(event) {
            if(event.key === "ArrowLeft") {
                changeDisplayedItem(true, -1);
            }
            else if(event.key === "ArrowRight") {
                changeDisplayedItem(true, 1);
            }
        })

        previousButton.addEventListener("click", function() {
            changeDisplayedItem(true, -1);
        });

        nextButton.addEventListener("click", function() {
            changeDisplayedItem(true, 1);
        });

        for(let carouselDot of carouselDotsArray) {
            carouselDot.addEventListener("click", function() {
                changeDisplayedItem(false, parseInt(this.getAttribute("data-id")));
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
        let end = generations[gen], totalPokemons = end - start + 1;
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
        liList = pokedexMainContainer.querySelectorAll(".carousel li");
        ul.innerHTML = "";

        for(let i = start; i <= end; i++) {
            let li = document.createElement("li");
            li.setAttribute("data-number", i);
            li.classList.add(results[i].type);
            li.addEventListener("click", function() {
                const clickedPokemonId = parseInt(this.getAttribute("data-number"));
                sessionStorage.setItem("pokemon-id", clickedPokemonId);
                sessionStorage.setItem("generation", (gen+1));
                window.location.href = "http://127.0.0.1:5500/pokemon.html";
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
        carouselUl.scrollLeft = liList[currentItem].offsetLeft;
        carouselButtons.classList.remove("display-none");
    }

    function setImagesOfCarousel(start) {
        carouselUl = pokedexMainContainer.querySelector(".carousel > ul");
        liList = pokedexMainContainer.querySelectorAll(".carousel li");
        if(liList.length > totalItems) {
            carouselUl.removeChild(liList[0]);
            carouselUl.removeChild(liList[liList.length-1]);
        }
        liList = pokedexMainContainer.querySelectorAll(".carousel li");
        for(let li of liList) {
            let img = li.querySelector("img");
            img.setAttribute("src", results[start++].front_image);
        }
        let copyOfFirstElement = liList[0].cloneNode(true);
        let copyOfLastElement = liList[liList.length-1].cloneNode(true);

        carouselUl.prepend(copyOfLastElement);
        carouselUl.append(copyOfFirstElement);
    }

    function changeDisplayedItem(onNextPrevClick, number) {
        const carouselDotsArray = pokedexMainContainer.querySelectorAll(".carousel-buttons span");

        liList[currentItem].classList.remove("selected");
        carouselDotsArray[currentItem-1].classList.remove("selected");
        if(onNextPrevClick) {
            if(currentItem == 1 && number == -1) {
                currentItem = totalItems;
                horizontalScrollToElement(carouselUl, liList[0].offsetLeft, 400, true);
            }
            else if((currentItem == totalItems) && (number == 1)) {
                currentItem = 1;
                horizontalScrollToElement(carouselUl, liList[liList.length-1].offsetLeft, 400, true);
            }
            else {
                currentItem = currentItem + number;
                horizontalScrollToElement(carouselUl, liList[currentItem].offsetLeft, 400);
            }
        }
        else {
            currentItem = number;
            horizontalScrollToElement(carouselUl, liList[currentItem].offsetLeft, 400);
        }
        liList[currentItem].classList.add("selected");
        carouselDotsArray[currentItem-1].classList.add("selected");
    }

    function horizontalScrollToElement(scrollLayer, destination, duration, callback) {
        if (duration <= 0) {
            // Scroll instantly back to the real element after going to duplicate
            if(callback) {
                carouselUl.scrollLeft = liList[currentItem].offsetLeft;
            }
            return;
        }
        const difference = destination - scrollLayer.scrollLeft;
        const perTick = (difference / duration) * 10;
    
        let timeout = setTimeout(function() {
            scrollLayer.scrollLeft = scrollLayer.scrollLeft + perTick;
            if (scrollLayer.scrollLeft === destination) {
                clearTimeout(timeout);
                // Scroll instantly back to the real element after going to duplicate
                if(callback) {
                    carouselUl.scrollLeft = liList[currentItem].offsetLeft;
                }
                return;
            }
            horizontalScrollToElement(scrollLayer, destination, duration - 10, callback);
        }, 10);
    }
});