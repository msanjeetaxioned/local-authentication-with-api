document.addEventListener('DOMContentLoaded', function(event) {
    const fieldNames = ["User Name", "Password"];
    const errors = [
        "Enter ",
        "Invalid User name and/or Password"
    ];
    const mainContainer = document.querySelector(".main-container");
    const form = mainContainer.querySelector("form");
    const errorMessage = form.querySelector(".error-message");
    const spanErrorMessage = errorMessage.querySelector(".error-message > span");
    const userName = form["user-name"];
    const password = form["password"];
    let formSubmittedOnce = false;
    localStorage.setItem("sanjeetm", 12345);
    localStorage.setItem("tejeshs", 1234);

    form.addEventListener("submit", function(event) {
        if(!formSubmittedOnce) {
            errorMessage.classList.remove("display-none");
            formSubmittedOnce = true;
        }
        if(checkIfInputPresent(userName)) {
            if(checkIfInputPresent(password)) {
                if(validateLoginInfo(userName, password)) {
                    localStorage.setItem("user-name", userName.value);
                }
                else {
                    event.preventDefault();
                }
            }
            else {
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }
    });

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
            return true;
        }
        spanErrorMessage.innerText = errors[1];
        return false;
    }

});