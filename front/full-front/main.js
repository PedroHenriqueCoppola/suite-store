let purchases = getObjectFromLocalStorage('purchases');

const addProductForm = document.getElementById("addProductForm");
const productSelect = document.querySelector(".productSelect");
const productCode = productSelect.value;
const purchaseAmount = document.getElementById("purchaseAmount");
const purchaseTax = document.getElementById("purchaseTax");
const purchasePrice = document.getElementById("purchasePrice");

const showFinalTax = document.getElementById("showFinalTax");
const showFinalPrice = document.getElementById("showFinalPrice");
const cancelButton = document.getElementById("cancel");
const finishButton = document.getElementById("finish");

let taxes = 0;
let prices = 0;

const urlProducts = `http://localhost/routes/product.php`; // importando PHP
const urlCategories = `http://localhost/routes/category.php`; // importando PHP
const urlOrders = `http://localhost/routes/order.php`; // importando PHP
const urlOrderItem = `http://localhost/routes/order-item.php`; // importando PHP

let categoryData;
let productData;

window.onload = async function() {
    categoryData = await getCategories();
    productData = await getProducts();
    Promise.all([categoryData, productData]).then(async () => { // independente de quanto tempo demore as duas, a update só vai depois delas carregarem
        updateDisabledInputs()
    });
    initPurchases();
    loadPurchases();
    reloadPrintTax();
    reloadPrintPrice();
}

function initPurchases() {
    if (!localStorage.getItem('purchases')) {
        localStorage.setItem('purchases', JSON.stringify([])); // inicia o localstorage
    }
}

addProductForm.addEventListener("submit", e => {
    e.preventDefault();

    addNewPurchase();
})

async function getCategories() {
    return await fetch(urlCategories, {
        method: 'GET'
    })
    .then(res => res.json())
}

async function getProducts() {
    return await fetch(urlProducts, {
        method: 'GET'
    })
    .then(res => res.json())
}

fetch(urlProducts)
    .then(res => {
        return res.json(); // filtra o response do fetch para um json
    })
    .then(data => {
        data.forEach(el => {
            const option = document.createElement("option");
            option.value = el.code;
            option.textContent = el.name;

            productSelect.append(option);
        });
    })

async function checkPurchaseInputs() {
    const amountValue = purchaseAmount.value;
    let productCode = productSelect.value; // pega o código do produto que ta sendo selecionado

    const result = await getCategoryAndProductById(productCode);
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

    if(getSelectedProduct()) {
        alert("You already added this product to your cart. Please, modify it.");
        return false;
    }

    return amountValue;
}

function getSelectedProduct() {
    const purchases = getObjectFromLocalStorage('purchases');
    let productCode = productSelect.value;

    const teste = purchases.find(el => el.id == productCode); // pegando o product pelo id
    if (teste == undefined) {
        return;
    }
    return teste;
}

function readCorrectContentOfHomeInputs() {
    // pegando os objetos de categories e products
    const productCode = productSelect.value;
    const productProperties = productData.find(el => el.code == productCode);
    const categoryProperties = categoryData.find(el => el.code == productProperties.category_code)

    // amount
    const purchaseAmountValue = purchaseAmount.value;
    const amount = parseInt(purchaseAmountValue); // retorna o amount selecionado

    // preço da unidade * quantidade
    const totalPrice = productProperties.price * amount; 

    // calculo da taxa de um produto
    const percentageTax = parseFloat(categoryProperties.tax)/100;
    const finalTax = percentageTax * totalPrice;
    
    // taxa e preço que aparecem como total em cima dos botões
    taxes += finalTax;
    prices += totalPrice + finalTax;
    
    const productInPurchase = {
        id: productProperties.code,
        lineCode: getProductLineIndex(),
        name: productProperties.name,
        unitPrice: productProperties.price,
        tax: categoryProperties.tax,
        finalTax: finalTax,
        amount: amount, 
        totalPrice: totalPrice + finalTax
    };

    const purchase = {
        products: productInPurchase // coloca o array de products dentro do purchase
    };

    return { productProperties, amount, productInPurchase, purchase };
}

async function addNewPurchase() {
    if (await checkPurchaseInputs() != false) {
        const inputsData = readCorrectContentOfHomeInputs();
        const { productInPurchase } = inputsData;

        purchases.push(productInPurchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        purchaseAmount.value = '';
        printFinalTax();
        printFinalPrice();
        loadPurchases();
    }
}

async function getCategoryAndProductById(productCode) {
    const responseCat = await fetch(urlCategories);
    const categories = await responseCat.json();

    const responseProd = await fetch(urlProducts);
    const products = await responseProd.json();
    
    const product = products.find(p => p.code == productCode); // pegando o product pelo id

    const category = categories.find(cat => cat.code == product.category_code); // pega a category correspondente ao id armazenado no produto

    return { category, product };
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

function getProductLineIndex() {
    var lastLineCode = purchases.at(-1)?.lineCode ?? 0;
    var code = lastLineCode + 1;
    return code;
}

function deleteLine(lineCode) {
    if(confirm("Are you sure you want to delete this product?")) {
        taxes = 0;
        prices = 0;
        
        purchases = purchases.filter(purchase => purchase.lineCode != lineCode);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        reloadPrintTax();
        reloadPrintPrice();
        loadPurchases();
    }
}

productSelect.addEventListener("change", updateDisabledInputs);

async function updateDisabledInputs() {
    const productCode = productSelect.value;

    const productProperties = productData.find(el => el.code == productCode);
    const categoryProperties = categoryData.find(el => el.code == productProperties.category_code)

    purchaseTax.value = ("Tax: " + categoryProperties.tax + "%");
    purchasePrice.value = ("Unit Price: " + productProperties.price);
}

function printFinalTax() {
    showFinalTax.textContent = (getCorrectFloatToSave(taxes));
}

function reloadPrintTax() {
    purchases.forEach(product => {
         taxes += product.finalTax
    })
    printFinalTax();
}

function printFinalPrice() {
    showFinalPrice.textContent = (getCorrectFloatToSave(prices));
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
            localStorage.setItem('purchases', JSON.stringify([]));
            location.reload();
        }   
    } else {
        alert("You can't delete an empty cart.");
    }
})

async function getLastCode() {
    const response = await fetch(urlOrders);
    const ordersList = await response.json();
    return ordersList[0].code;
}

finishButton.addEventListener("click", async e => {
    e.preventDefault();

    if (purchases.length <= 0) {
        alert("Please, add an product in your cart first.");
    } else {
        if(confirm("Are you sure you want to finish your purchase?")) {
            // criar o order
            const order = await fetch(urlOrders, {
                method: 'POST',
            })
            .then(e => e.json())
            .catch(error => {
                console.log("Error:", error);
            })

            // cria o objeto e salva no banco
            const object = purchases.map(async purchase => {
                await fetch(urlOrderItem, {
                    method: 'POST',
                    body: JSON.stringify({code: order.code, prodCode: purchase.id, amount: purchase.amount})
                })

                // atualizar os valores
                const data = {
                    code: await getLastCode(),
                    tax: getCorrectFloatToSave(taxes),
                    total: getCorrectFloatToSave(prices)
                }

                fetch(urlOrders, {
                    method: 'PUT',
                    body: JSON.stringify(data) 
                })
            })

            // diminui no estoque
            const promise3 = purchases.forEach(e => {
                const stock = {
                    id: e.id,
                    amount: e.amount
                }

                fetch(urlOrderItem, {
                    method: 'PUT',
                    body: JSON.stringify(stock)
                })
            })

            Promise.all([order, object, promise3]).then(async () => {
                localStorage.setItem('purchases', JSON.stringify([]));
                await new Promise(r => setTimeout(r, 1500));
                location.reload();
            })
        }
    }
})