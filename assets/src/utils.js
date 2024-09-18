const errorMessage = document.querySelector(".errorMessage");

function inputError(input) {
    input.parentElement.classList.add("contentError");
    errorMessage.classList.add("active");
    errorMessage.classList.remove("errorMessage");
}

function removeInputError(input) {
    input.parentElement.classList.remove("contentError");
    errorMessage.classList.remove("active");
    errorMessage.classList.add("errorMessage");
}

function getObjectFromLocalStorage(key) { 
    return JSON.parse(localStorage.getItem(key)) || []; // pega qualquer objeto iniciado no localstorage
}

function getCodeFromLocalStorage(key) {
    return parseInt(localStorage.getItem(key));
}

function validateInputSpaces(inputName) {
    return inputName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^\s+|\s+$/g,"").trim();
}