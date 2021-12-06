document.addEventListener('DOMContentLoaded', function(event) {
    const mainContainer = document.querySelector(".main-container");
    const form = mainContainer.querySelector("form");
    const errorMessage = form.querySelector(".error-message");
    const spanErrorMessage = errorMessage.querySelector(".error-message > span");
    const userName = form["user-name"];
    const password = form["password"];
    const fieldNames = ["User Name", "Password"];
    const errors = [
        "Enter ",
        "Invalid User name and/or Password"
    ];
    const validUserNames = [
        {name: "sanjeetm", password: 12345},
        {name: "tejeshs", password: 1234}
    ];

    let formSubmittedOnce = false;

    // Check If Some User has already Logged in
    if(localStorage.getItem("user-name")) {
        window.location.replace("http://127.0.0.1:5500/generation.html");
    }
    else {
        showLoginForm(); // User hasn't Logged in
    }

    function showLoginForm() {
        form.addEventListener("submit", function(event) {
            if(checkIfInputPresent(userName)) {
                if(checkIfInputPresent(password)) {
                    if(validateLoginInfo(userName, password)) {
                        event.preventDefault();
                        window.location.replace("http://127.0.0.1:5500/generation.html");
                    }
                    else {
                        event.preventDefault();
                        onFirstIncorrectSubmit();
                    }
                }
                else {
                    event.preventDefault();
                    onFirstIncorrectSubmit();
                }
            }
            else {
                event.preventDefault();
                onFirstIncorrectSubmit();
            }
        });
    }

    function onFirstIncorrectSubmit() {
        if(!formSubmittedOnce) {
            errorMessage.classList.remove("display-none");
            formSubmittedOnce = true;
        }
    }

    function checkIfInputPresent(inputField) {
        let value = inputField.value;
        let id = parseInt(inputField.getAttribute("data-id"));
        if(value == "") {
            spanErrorMessage.innerText = errors[0] + fieldNames[id];
            return false;
        }
        else {
            return true;
        }
    }

    function validateLoginInfo(userName, password) {
        let value = userName.value;
        if(localStorage.getItem(value) == password.value) {
            localStorage.setItem("user-name", value);
            return true;
        }
        spanErrorMessage.innerText = errors[1];
        return false;
    }
});