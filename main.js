const purchaseCount = 'purchaseCodeCount';
const purchasesJson = 'purchases'

const products = getObjectFromLocalStorage('products');

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.getElementById("productSelect");
const productCode = productSelect.value; // pega o código do produto que ta sendo selecionado
const purchaseAmount = document.getElementById("purchaseAmount");
const purchaseTax = document.getElementById("purchaseTax");
const purchasePrice = document.getElementById("purchasePrice");

window.onload = function() {
    initPurchaseCodeCount();
    initPurchases();
    loadPurchases();
    updateDisabledInputs();
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

// busca um produto no array products com base no código fornecido (productCode)
// function getProductDetailsById(productCode) {
//     const getDetails = products.find(element => element.code == productCode);
//     return getDetails;
// } 

function getCategoryAndProductById(productCode) {
    const categories = getObjectFromLocalStorage('categories'); // pega todas as categories em memória
    const products = getObjectFromLocalStorage('products'); // pega todos os products em memória

    const product = products.find(p => p.code == productCode); // pegando o product pelo id

    const category = categories.find(cat => cat.code == product.category); // pega a category correspondente ao id armazenado no produto

    return { category, product };
}

function addNewPurchase() {
    if (checkPurchaseInputs() !== false) {
        const purchases = getObjectFromLocalStorage(purchasesJson);
        
        const productCode = productSelect.value; // pega o código do produto que ta sendo selecionado

        const result = getCategoryAndProductById(productCode);
        const { category, product } = result; // desestruturando pra ter a categoria e o produto

        const purchaseAmountValue = purchaseAmount.value;
        const amount = parseInt(purchaseAmountValue); // retorna o amount selecionado

        const totalPrice = product.unitPrice * amount; // pega o preço unitário e calcula o preço total com o amount

        const percentageTax = parseFloat(category.tax)/100
        const finalTax = percentageTax * totalPrice;
        console.log(finalTax)

        // criando o objeto que vai dentro do objeto purchase
        const productInPurchase = {
            id: product.code,
            name: product.name,
            unitPrice: product.unitPrice,
            tax: category.tax,
            amount: amount,
            totalPrice: totalPrice + finalTax
        };

        const purchase = {
            code: getValidPurchaseId(),
            totalPrice: totalPrice + finalTax,
            finalTax: finalTax,
            products: [productInPurchase] // coloca o array de products dentro do purchase
        };

        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        loadPurchases();
    }
}

function loadPurchases() {
    const tbody = document.querySelector('#purchaseTable tbody');
    tbody.innerHTML = ''; // serve pra limpar o corpo da tabela antes de carregar

    const purchases = getObjectFromLocalStorage(purchasesJson);

    purchases.forEach(purchase => {
        // pra cada produto na lista de produtos da compra
        purchase.products.forEach(product => {
            // nova linha
            const row = document.createElement('tr');

             // cria as td pra productSelect, unitPrice, productAmount, totalPrice e btton
            const productSelectTd = document.createElement('td');
            productSelectTd.textContent = product.name;
            productSelectTd.classList.add('firstTd');
            
            const unitPriceTd = document.createElement('td');
            unitPriceTd.textContent = getCorrectFloatToSave(product.unitPrice);

            const productAmountTd = document.createElement('td');
            productAmountTd.textContent = product.amount;

            const totalPriceTd = document.createElement('td');
            totalPriceTd.textContent = getCorrectFloatToSave(product.totalPrice);

            const deleteButtonTd = document.createElement('td');
            deleteButtonTd.classList.add('lastTd');

            // cria o botão de delete
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('tdButton');
            deleteButton.id = purchase.code;

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

productSelect.addEventListener("change", updateDisabledInputs);

function updateDisabledInputs() {
    const productCode = productSelect.value;
    const result = getCategoryAndProductById(productCode);
    const { category, product } = result; // desestruturação do result pra obter a category e o product

    purchaseTax.value = ("Tax: " + getCorrectFloatToSave(category.tax) + "%");
    purchasePrice.value = ("Unit Price: " + getCorrectFloatToSave(product.unitPrice));
}