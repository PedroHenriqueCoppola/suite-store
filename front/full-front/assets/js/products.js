const newProductForm = document.getElementById("newProductForm");
const productName = document.getElementById("productName");
const productAmount = document.getElementById("productAmount");
const unitPrice = document.getElementById("unitPrice");
const category = document.getElementById("category");

const urlProducts = `http://localhost/routes/product.php`; // importando PHP
const urlCategories = `http://localhost/routes/category.php`; // importando PHP

window.onload = function() {
    loadProducts();
}

newProductForm.addEventListener('submit', e => {
    e.preventDefault();

    addNewProductToTheRegister();
});

fetch(urlCategories)
    .then(res => {
        return res.json(); // filtra o response do fetch para um json
    })
    .then(data => { // data é o que o fetch me retorna em json depois de ter filtrado ele
        data.forEach(el => {
            const option = document.createElement("option");
            option.value = el.code;
            option.textContent = el.name;
    
            category.append(option);
        })
    })
    .catch(error => console.log(error));

function checkNameAmountAndPriceInput() {
    const nameValue = validateInputSpacesAndCapitalize(document.getElementById("productName").value);
    const productAmountValue = productAmount.value;
    const unitPriceValue = unitPrice.value;
    const categoryValue = category.value;

    if(nameValue == "" && productAmountValue == "" && unitPriceValue == "") {
        inputError(productName);
        inputError(productAmount);
        inputError(unitPrice);
        return false;
    } else if (nameValue == "" && productAmountValue == "") {
        inputError(productName);
        inputError(productAmount);
        return false;
    } else if (nameValue == "" && unitPriceValue == "") {
        inputError(productName);
        inputError(unitPrice);
        return false;
    } else if (productAmountValue == "" && unitPriceValue == "") {
        inputError(productAmount);
        inputError(unitPrice);
        return false;
    } else if (nameValue == "") {
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

    if(nameValue.length > 30) {
        alert("The max name length is 30 characters.");
        return false;
    }

    if(!limitTextInput(nameValue)) {
        alert("Special characters are not allowed on 'Category name'.");
        return false;
    }

    if((productAmountValue) > 100000 || productAmountValue <= 0 || isNaN(productAmountValue)) {
        alert("Please, insert an number between 1 and 100.000.");
        return false;
    } 

    if((unitPriceValue) > 1000000 || unitPriceValue <= 0 || isNaN(unitPriceValue)) {
        alert("Please, insert an number between 1 and 1.000.000.");
        return false;
    }

    if (categoryValue == "") {
        alert("Please, create an category first.");
        return false;
    }

    return nameValue;
}

function addNewProductToTheRegister() {
    if(checkNameAmountAndPriceInput() != false) {
        const formData = new FormData();

        product = checkNameAmountAndPriceInput();
        let amount = document.getElementById("productAmount").value;
        let price = document.getElementById("unitPrice").value;
        let categoryCode = document.getElementById("category").value;

        formData.append("product", product);
        formData.append("amount", amount);
        formData.append("price", price);
        formData.append("category", categoryCode);
        
        fetch(urlProducts, {
            method: 'POST',
            body: formData 
        })
        .then(() => {
            loadProducts();
            productName.value = '';
            productAmount.value = '';
            unitPrice.value = '';
        })
        .catch(error => {
            console.log("Error:", error);
        })
    }
}

async function getCategoryNameFromTheCode(categoryCode) {
    const categoriesList = await fetch(urlCategories)
        .then (res => {
            return res.json();
        })
    const returnCategoryCode = categoriesList.find(el => el.code == categoryCode);
    return returnCategoryCode.name;
}

async function loadProducts() {
    const tbody = document.querySelector('#productsTable tbody'); 
    tbody.innerHTML = ''; // serve pra limpar o corpo da tabela antes de carregar
    
    const response = await fetch(urlProducts);
    const products = await response.json();

    products.forEach(async p => {
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
        unitPriceTd.textContent = "$ " + p.price;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = await getCategoryNameFromTheCode(p.category_code);

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

async function deleteProduct(productId) {
    if(confirm("Are you sure you want to delete this product?")) {
        try {
            await fetch(`http://localhost/routes/product.php?code=${productId}`, {
                method: "DELETE"
            }).then(() => {
                loadProducts();
            })
        } catch (error) {
            console.log(error.message);
        }
    }
}