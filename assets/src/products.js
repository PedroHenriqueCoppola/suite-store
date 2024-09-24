const productCount = 'productCodeCount';
const categories = getObjectFromLocalStorage("categories");

const productsJson = 'products';

const newProductForm = document.getElementById("newProductForm");
const productName = document.getElementById("productName");
const productAmount = document.getElementById("productAmount");
const unitPrice = document.getElementById("unitPrice");
const category = document.getElementById("category");

function initProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([])); // inicia o localstorage
    }
}

function initProductsCodeCount() {
    if(!localStorage.getItem(productCount)) {
        localStorage.setItem(productCount, 1);
    }
}

window.onload = function() {
    initProductsCodeCount();
    initProducts();
    loadProducts();
}

newProductForm.addEventListener('submit', e => {
    e.preventDefault();

    addNewProductToTheRegister();
});

if (categories) {
    categories.forEach(el => {
        const option = document.createElement("option");
        option.value = el.code;
        option.textContent = el.name;

        category.append(option);
    });
}

function checkNameAmountAndPriceInput() {
    const productNameValue = validateInputSpacesAndCapitalize(document.getElementById("productName").value);
    const productAmountValue = productAmount.value;
    const unitPriceValue = unitPrice.value;
    const categoryValue = category.value;

    if(productNameValue == "" && productAmountValue == "" && unitPriceValue == "") {
        inputError(productName);
        inputError(productAmount);
        inputError(unitPrice);
        return false;
    } else if (productNameValue == "" && productAmountValue == "") {
        inputError(productName);
        inputError(productAmount);
        return false;
    } else if (productNameValue == "" && unitPriceValue == "") {
        inputError(productName);
        inputError(unitPrice);
        return false;
    } else if (productAmountValue == "" && unitPriceValue == "") {
        inputError(productAmount);
        inputError(unitPrice);
        return false;
    } else if (productNameValue == "") {
        inputError(productName);
        return false;
    } else if (productAmountValue == "") {
        inputError(productAmount);
        return false;
    } else if (unitPriceValue == "") {
        inputError(unitPrice);
        return false;
    } else {
        removeInputError(productName);
        removeInputError(productAmount);
        removeInputError(unitPrice);
    }

    if(productNameValue.length > 35) {
        alert("The max name length is 35 characters.");
        return false;
    }

    if(!limitTextInput(productNameValue)) {
        alert("Please, start with and letter on 'Category name'.");
        return false;
    }

    if (findExistentProductName(productNameValue)) {
        alert("This name already exists.");
        return false;
    }

    if((productAmountValue) > 10000 || productAmountValue <= 0 || isNaN(productAmountValue)) {
        alert("Please, insert an number between 1 and 10.000.");
        return false;
    } 

    if((unitPriceValue) > 10000 || unitPriceValue <= 0 || isNaN(unitPriceValue)) {
        alert("Please, insert an number between 1 and 10.000.");
        return false;
    }

    if (categoryValue == "") {
        alert("Please, create an category first.");
        return false;
    }
}

function findExistentProductName(name) {
    const productsList = getObjectFromLocalStorage(productsJson);
    const product = productsList.filter(element => element.name == name);
    return product[0];
}

function addNewProductToTheRegister() {
    if(checkNameAmountAndPriceInput() != false) {
        const products = getObjectFromLocalStorage(productsJson);

        const name = validateInputSpacesAndCapitalize(document.getElementById("productName").value);

        const amount = getCorrectIntToSave(document.getElementById("productAmount").value);

        const unitPriceToSave = getCorrectFloatToSave(document.getElementById("unitPrice").value);

        // const categoryCode = parseInt(category.value)
        const categoryCode = category.value;

        var product = { 
            code: getValidProductId(),
            name: name,
            amount: amount,
            unitPrice: unitPriceToSave,
            category: categoryCode
        };
        
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        loadProducts();
    }
}

function getCategoryNameFromTheCode(categoryCode) {
    const returnCategoryCode = categories.find(element => element.code == categoryCode);
    return returnCategoryCode.name;
}

function loadProducts() {
    const tbody = document.querySelector('#productsTable tbody'); 
    tbody.innerHTML = ''; // serve pra limpar o corpo da tabela antes de carregar
    
    const products = getObjectFromLocalStorage(productsJson);

    products.forEach(p => {
        // nova linha
        const row = document.createElement('tr');
        
        // cria as td pra code, productName, productAmount, unitPrice e category
        const codeTd = document.createElement('td');
        codeTd.textContent = p.code;
        codeTd.classList.add('firstTd');

        const productNameTd = document.createElement('td');
        productNameTd.textContent = p.name;

        const productAmountTd = document.createElement('td');
        productAmountTd.textContent = p.amount;

        const unitPriceTd = document.createElement('td');
        unitPriceTd.textContent = p.unitPrice;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = getCategoryNameFromTheCode(p.category);

        const deleteButtonTd = document.createElement('td');
        deleteButtonTd.classList.add('lastTd');

        // cria o botão de delete
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('tdButton');
        deleteButton.id = p.code;

        // adiciona o onclick
        deleteButton.onclick = function() {
            deleteProduct(this.id);
        };

        // adiciona o botão ao td
        deleteButtonTd.appendChild(deleteButton);
        
        // adiciona as células aos respectivos tds
        row.appendChild(codeTd);
        row.appendChild(productNameTd);
        row.appendChild(productAmountTd);
        row.appendChild(unitPriceTd);
        row.appendChild(categoryTd);
        row.appendChild(deleteButtonTd);

        // adiciona a linha na tabela
        tbody.appendChild(row);
    });
}

function deleteProduct(productId) {
    if(confirm("Are you sure you want to delete this product?")) {
        let products = getObjectFromLocalStorage(productsJson);

        products = products.filter(product => product.code != productId);
        localStorage.setItem('products', JSON.stringify(products));
        
        loadProducts();
    }
}

function updateCodeInLocalStorage(codeCount) {
    localStorage.setItem(productCount, codeCount);
}

function getValidProductId() {
    let code = getCodeFromLocalStorage(productCount) || 1;

    while (!ensureProductIdIsValid(code)) {
        code++;
    }

    updateCodeInLocalStorage(code + 1);
    return code;
}

function ensureProductIdIsValid(code) {
    const products = getObjectFromLocalStorage(productsJson);

    for (let pr of products) {
        if (pr.code == code) {
            return false;
        }
    }
    return true;
}