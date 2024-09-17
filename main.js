const addProductForm = document.getElementById("addProductForm");
const productAmount = document.getElementById("productAmount");
const errorMessage = document.querySelector(".errorMessage");

addProductForm.addEventListener("submit", e => {
    e.preventDefault();

    checkProductAmountInput();
 })

 
// validação só fazer depois (exemplo no js de categories)
// function checkProductAmountInput() {
//     const productAmountValue = productAmount.value;
    
//     if(productAmountValue === "") {
//         inputError(productAmount);
//     } else if (productAmountValue <= "0") {
//         alert("This number must be bigger than 1.");
//     } else {
//         removeInputError(productAmount);
//     }
// }

function inputError(inputId) {
    inputId.parentElement.classList.add("contentError");
    errorMessage.classList.add("active");
    errorMessage.classList.remove("errorMessage");
}

function removeInputError(inputId) {
    inputId.parentElement.classList.remove("contentError");
    errorMessage.classList.remove("active");
    errorMessage.classList.add("errorMessage");
}