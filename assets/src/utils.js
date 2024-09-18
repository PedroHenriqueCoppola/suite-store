function getObjectFromLocalStorage(key) { 
    return JSON.parse(localStorage.getItem(key)) || []; // pega a categories iniciada
}

function getCodeFromLocalStorage(key) {
    return parseInt(localStorage.getItem(key));
}

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