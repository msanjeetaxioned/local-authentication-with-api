document.addEventListener('DOMContentLoaded', (event) => {
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

        usernameInHeader.innerText = "Hello! " + localStorage.getItem("user-name");
        signOut.addEventListener("click", function() {
            localStorage.removeItem("user-name");
            window.location.replace("http://127.0.0.1:5500/login.html");
        });
    }
});