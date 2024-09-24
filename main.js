const purchaseCount = 'purchaseCodeCount';
const purchasesJson = 'purchases'

const products = getObjectFromLocalStorage('products');
console.log(products)

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("productSelect");
const productAmount = document.getElementById("productAmount");
const product = document.getElementById("productSelect");

window.onload = function() {
    initPurchaseCodeCount();
    initPurchases();
    loadPurchases();
}

function initPurchases() {
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([])); // inicia o localstorage
    }
}

function initPurchaseCodeCount() {
    if(!localStorage.getItem(purchaseCount)) {
        localStorage.setItem(purchaseCount, 1);
    }
}

addProductForm.addEventListener("submit", e => {
    e.preventDefault();

    addNewPurchase();
})

if (products) {
    products.forEach(el => {
        const option = document.createElement("option");
        option.value = el.code;
        option.textContent = el.name;

        productSelect.append(option);
    });
}

function checkPurchaseInputs() {
    return true;
}

function getTextByProductId(productCode) {
    const getText = products.find(element => element.code == productCode);
    return getText;
}

function addNewPurchase() {
    if(checkPurchaseInputs() != false) {
        const purchases = getObjectFromLocalStorage(purchasesJson);

        // const select = document.getElementById("productSelect");
        // const option = select.children[select.selectedIndex];
        // const name = validateInputSpacesAndCapitalize(option.textContent);

        // const amount = getCorrectIntToSave(document.getElementById("purchaseAmount").value);

        // const tax = getCorrectFloatToSave(document.getElementById("purchaseTax").value);
        // tem que ser a variavel que ja vai ter a conta completa, não o valor do input (ele ta disabled)

        const price = getCorrectFloatToSave(document.getElementById("purchasePrice").value);
        // tem que ser a variavel que ja vai ter a conta completa, não o valor do input (ele ta disabled)

        var purchase = { 
            code: getValidPurchaseId(),
            totalPrice: price,
            finalTax: finalTax,
            products: []
        }
        
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        loadPurchases();
    }
}

function loadPurchases() {
    const tbody = document.querySelector('#purchaseTable tbody'); 
    tbody.innerHTML = ''; // serve pra limpar o corpo da tabela antes de carregar
    
    const purchases = getObjectFromLocalStorage(purchasesJson);

    purchases.forEach(p => {
        // nova linha
        const row = document.createElement('tr');
        
        // cria as td pra productSelect, productAmount, finalTax e totalPrice
        const productSelectTd = document.createElement('td');
        productSelectTd.textContent = products.code;
        productSelectTd.classList.add('firstTd');
        productSelectTd.id = p.productId;

        const unitPriceTd = document.createElement('td');
        unitPriceTd.textContent = products.unitPrice;

        const productAmountTd = document.createElement('td');
        productAmountTd.textContent = products.amount;

        const totalPriceTd = document.createElement('td');
        totalPriceTd.textContent = p.price;

        const deleteButtonTd = document.createElement('td');
        deleteButtonTd.classList.add('lastTd');

        // cria o botão de delete
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('tdButton');
        deleteButton.id = p.code;

        // adiciona o onclick
        deleteButton.onclick = function() {
            deleteLine(this.id);
        };

        // adiciona o botão ao td
        deleteButtonTd.appendChild(deleteButton);
        
        // adiciona as células aos respectivos tds
        row.appendChild(productSelectTd);
        row.appendChild(unitPriceTd);
        row.appendChild(productAmountTd);
        row.appendChild(totalPriceTd);
        row.appendChild(deleteButtonTd);
        
        // adiciona a linha na tabela
        tbody.appendChild(row);
    });
}

function deleteLine(purchaseCode) {
    if(confirm("Are you sure you want to delete this product?")) {
        let purchases = getObjectFromLocalStorage(purchasesJson);

        purchases = purchases.filter(purchase => purchase.code != purchaseCode);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        loadPurchases();
    }
}

function updateCodeInLocalStorage(codeCount) {
    localStorage.setItem(purchaseCount, codeCount);
}

function getValidPurchaseId() {
    let code = getCodeFromLocalStorage(purchaseCount) || 1;

    while (!ensurePurchaseIdIsValid(code)) {
        code++;
    }

    updateCodeInLocalStorage(code + 1);
    return code;
}

function ensurePurchaseIdIsValid(code) {
    const purchases = getObjectFromLocalStorage(purchasesJson);

    for (let pur of purchases) {
        if (pur.code == code) {
            return false;
        }
    }
    return true;
}