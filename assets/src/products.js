const productCount = 'productCodeCount';
const categories = getObjectFromLocalStorage("categories");

const productsJson = 'products';

const newProductForm = document.getElementById("newProductForm");
const productName = document.getElementById("productName");
const productAmount = document.getElementById("productAmount");
const unitPrice = document.getElementById("unitPrice");
const category = document.getElementById("category");

window.onload = function() {
    initProductsCodeCount();
    initProducts();
    loadProducts();
}

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

newProductForm.addEventListener('submit', e => {
    e.preventDefault();

    addNewProductToTheRegister();
});

if (categories) {
    categories.forEach(el => {
        const option = document.createElement("option");
        option.value = el.code;
        option.textContent = el.categoryName;

        category.append(option);
    });
}

// FUNÇÃO COM TODAS AS VALIDAÇÕES
function checks() {
    const name = validateInputSpaces(document.getElementById("productName").value);

    if(name == "" && aaaaaaa) {
    }
}

function getCorrectUnitPriceToSave(inputValue) {
    return parseFloat(inputValue).toFixed(2);
}

function addNewProductToTheRegister() {
    if(checks() == false) {
        // pass
    } else {
        const products = getObjectFromLocalStorage(productsJson);

        const name = validateInputSpaces(document.getElementById("productName").value);

        const amount = validateInputSpaces(document.getElementById("productAmount").value);

        const unitPriceToSave = getCorrectUnitPriceToSave(document.getElementById("unitPrice").value);

        var option = category.children[category.selectedIndex];
        var categoryText = option.textContent;

        var product = { 
            code: getValidProductId(),
            productName: name,
            amount: amount,
            unitPrice: unitPriceToSave,
            category: categoryText
        };
        
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        loadProducts();
    }
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
        productNameTd.textContent = p.productName;

        const productAmountTd = document.createElement('td');
        productAmountTd.textContent = p.amount;

        const unitPriceTd = document.createElement('td');
        unitPriceTd.textContent = p.unitPrice;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = p.category;

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
    let products = getObjectFromLocalStorage(productsJson);

    products = products.filter(product => product.code != productId);
    localStorage.setItem('products', JSON.stringify(products));
    
    loadProducts();
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