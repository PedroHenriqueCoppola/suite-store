// const purchaseCount = 'purchaseCodeCount';
const historyCount = 'historyCodeCount';
const purchasesJson = 'purchases'

let purchases = getObjectFromLocalStorage(purchasesJson);
const products = getObjectFromLocalStorage('products');
const histories = getObjectFromLocalStorage('histories');

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("productSelect");
const productCode = productSelect.value; // pega o código do produto que ta sendo selecionado
const purchaseAmount = document.getElementById("purchaseAmount");
const purchaseTax = document.getElementById("purchaseTax");
const purchasePrice = document.getElementById("purchasePrice");

const showFinalTax = document.getElementById("showFinalTax");
const showFinalPrice = document.getElementById("showFinalPrice");
const cancelButton = document.getElementById("cancel");
const finishButton = document.getElementById("finish");

let taxes = 0;
let prices = 0;

window.onload = function() {
    initHistoryCodeCount();
    initPurchases();
    loadPurchases();
    initHistories();
    updateDisabledInputs();
    reloadPrintTax();
    reloadPrintPrice();
}

function initPurchases() {
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([])); // inicia o localstorage
    }
}

function initHistories() {
    if (!localStorage.getItem('histories')) {
        localStorage.setItem('histories', JSON.stringify([])); // inicia o localstorage
    }
}

// function initPurchaseCodeCount() {
//     if(!localStorage.getItem(purchaseCount)) {
//         localStorage.setItem(purchaseCount, 1);
//     }
// }

function initHistoryCodeCount() {
    if(!localStorage.getItem(historyCount)) {
        localStorage.setItem(historyCount, 1);
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
    const amountValue = purchaseAmount.value;
    let productCode = productSelect.value; // pega o código do produto que ta sendo selecionado

    const result = getCategoryAndProductById(productCode);
    const { product } = result; 
    
    if (amountValue == "") {
        inputError(purchaseAmount);
        return false
    } else {
        removeInputError(purchaseAmount);
    }

    if(amountValue <= 0 || isNaN(amountValue)) {
        alert("Please, insert an number bigger than 0.");
        return false;
    }

    if(amountValue > product.amount) {
        alert("You can't buy an amount bigger than the stock amount.");
        return false;
    }
}

function getCategoryAndProductById(productCode) {
    const categories = getObjectFromLocalStorage('categories'); // pega todas as categories em memória

    const product = products.find(p => p.code == productCode); // pegando o product pelo id

    const category = categories.find(cat => cat.code == product.category); // pega a category correspondente ao id armazenado no produto

    return { category, product };
}

function readCorrectContentOfHomeInputs() {
    let productCode = productSelect.value; // pega o código do produto que ta sendo selecionado

    const result = getCategoryAndProductById(productCode);
    const { category, product } = result; // desestruturando pra ter a categoria e o produto

    const purchaseAmountValue = purchaseAmount.value;
    const amount = parseInt(purchaseAmountValue); // retorna o amount selecionado

    const totalPrice = product.unitPrice * amount; // pega o preço unitário e calcula o preço total com o amount

    const percentageTax = parseFloat(category.tax)/100;
    const finalTax = percentageTax * totalPrice;

    taxes += finalTax;
    prices += totalPrice + finalTax;

    const todayDate = new Date().toLocaleString();

    const getFullPurchaseList = JSON.parse(localStorage.getItem('purchases'));

    // criando o objeto que vai dentro do objeto purchase
    const productInPurchase = {
        id: product.code,
        lineCode: getProductLineIndex(),
        name: product.name,
        unitPrice: product.unitPrice,
        tax: category.tax,
        finalTax: finalTax,
        amount: amount,
        totalPrice: totalPrice + finalTax
    };

    const purchase = {
        // code: getValidPurchaseId(),
        // totalPrice: totalPrice + finalTax,
        products: productInPurchase // coloca o array de products dentro do purchase
    };

    const history = {
        id: getValidHistoryId(),
        date: todayDate,
        purchase: getFullPurchaseList
    }

    return { product, amount, productInPurchase, purchase, history };
}

function addNewPurchase() {
    if (checkPurchaseInputs() !== false) {
        const inputsData = readCorrectContentOfHomeInputs();
        const { product, amount, productInPurchase } = inputsData;

        purchases.push(productInPurchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        product.amount -= amount;
        localStorage.setItem('products', JSON.stringify(products));
        purchaseAmount.title = `Number of products available: ${product.amount}`
        
        printFinalTax();
        printFinalPrice();
        loadPurchases();
    }
}

function loadPurchases() {
    const tbody = document.querySelector('#purchaseTable tbody');
    tbody.innerHTML = ''; // serve pra limpar o corpo da tabela antes de carregar
    purchases.map(e => {
        const row = document.createElement('tr');

        const productSelectTd = document.createElement('td');
        productSelectTd.textContent = e.name;
        productSelectTd.classList.add('firstTd');
        
        const unitPriceTd = document.createElement('td');
        unitPriceTd.textContent = getCorrectFloatToSave(e.unitPrice);

        const productAmountTd = document.createElement('td');
        productAmountTd.textContent = e.amount;

        const totalPriceTd = document.createElement('td');
        totalPriceTd.textContent = getCorrectFloatToSave(e.totalPrice);

        const deleteButtonTd = document.createElement('td');
        deleteButtonTd.classList.add('lastTd');

        // cria o botão de delete
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('tdButton');
        deleteButton.id = e.lineCode;

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

function addProductsAmountBackToLS(lineCode) {
    const purchaseCodeList = purchases.find(e => e.lineCode == lineCode);
    const amount = parseInt(purchaseCodeList.amount);

    let productCode = productSelect.value;
    const result = getCategoryAndProductById(productCode);
    const { product } = result; // desestruturando pra ter o produto

    product.amount += amount;

    return { product };
}

function deleteLine(lineCode) {
    if(confirm("Are you sure you want to delete this product?")) {
        taxes = 0;
        prices = 0;
        
        const result = addProductsAmountBackToLS(lineCode);
        const { product } = result;

        purchases = purchases.filter(purchase => purchase.lineCode != lineCode);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        localStorage.setItem('products', JSON.stringify(products));
        purchaseAmount.title = `Number of products available: ${product.amount}`
        
        reloadPrintTax();
        reloadPrintPrice();
        loadPurchases();
    }
}

function updateCodeInLocalStorage(codeCount) {
    localStorage.setItem(historyCount, codeCount);
}

function getValidHistoryId() {
    let code = getCodeFromLocalStorage(historyCount) || 1;

    while (!ensureHistoryIdIsValid(code)) {
        code++;
    }

    updateCodeInLocalStorage(code + 1);
    return code;
}

function ensureHistoryIdIsValid(code) {
    for (let his of histories) {
        if (his.code == code) {
            return false;
        }
    }
    return true;
}

function getProductLineIndex() {
    var lastLineCode = purchases.at(-1)?.lineCode ?? 0;
    var code = lastLineCode + 1;
    return code
}

productSelect.addEventListener("change", updateDisabledInputs);

function updateDisabledInputs() {
    const productCode = productSelect.value;
    const result = getCategoryAndProductById(productCode);
    const { category, product } = result; // desestruturação do result pra obter a category e o product

    purchaseTax.value = ("Tax: " + getCorrectFloatToSave(category.tax) + "%");
    purchasePrice.value = ("Unit Price: " + getCorrectFloatToSave(product.unitPrice));
}

function printFinalTax() {
    showFinalTax.textContent = ("$" + getCorrectFloatToSave(taxes));
}

function reloadPrintTax() {
    purchases.forEach(product => {
        taxes += product.finalTax
    })
    printFinalTax();
}

function printFinalPrice() {
    showFinalPrice.textContent = ("$" + getCorrectFloatToSave(prices));
}

function reloadPrintPrice() {
    purchases.forEach(product => {
        prices += product.totalPrice
    })
    printFinalPrice();
}

cancelButton.addEventListener("click", e => {
    e.preventDefault();
    if (purchases.length >= 1) {
        if(confirm("Are you sure you want to delete all the products in the cart?")) {
            // addProductsAmountBackToLS(lineCode);
            purchases.forEach(purchase => {
                addProductsAmountBackToLS(purchase.lineCode);
            });

            purchases = [];
            localStorage.setItem('purchases', JSON.stringify([]));
            localStorage.setItem('products', JSON.stringify(products));

            location.reload();
        }   
    } else {
        alert("You can't delete an empty cart.");
    }
});

finishButton.addEventListener("click", e => {
    e.preventDefault();

    if (purchases.length <= 0) {
        alert("Please, add an product in your cart first.");
    } else {
        if(confirm("Are you sure you want to finish your purchase?")) {
            readCorrectContentOfHomeInputs();

            const inputsData = readCorrectContentOfHomeInputs();
            const { history } = inputsData;

            histories.push(history);
            localStorage.setItem('histories', JSON.stringify(histories));

            purchases = [];
            localStorage.setItem('purchases', JSON.stringify([]));
            location.reload();
        }
    }
});