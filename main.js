const products = getObjectFromLocalStorage("products");

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("productSelect");
const productAmount = document.getElementById("productAmount");

addProductForm.addEventListener("submit", e => {
    e.preventDefault();

 })

if (products) {
    products.forEach(el => {
        const option = document.createElement("option");
        option.value = el.code;
        option.textContent = el.name;

        productSelect.append(option);
    });
}