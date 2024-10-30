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

function getCorrectIntToSave(inputvalue) {
    return parseInt(inputvalue);
}

function getCorrectFloatToSave(inputValue) {
    return parseFloat(inputValue).toFixed(2);
}

function validateInputSpacesAndCapitalize(inputName) {
    const normalName = inputName
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\s+/g, " ");

    // russo function 
    // str: string que vai ser modificada
    // lower: se todas as outras letras vão estar lowercased
    const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());;
    return capitalize(normalName, true); // retorna o replace e o segundo param como true
}

function limitTextInput(inputValue) {
    // não permite que tenha nada além de letras em todo o input
    const textRegex = /^[a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/;

    return textRegex.test(inputValue)
}