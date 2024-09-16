const newCategoryForm = document.getElementById("newCategoryForm");
const categoryName = document.getElementById("categoryName");
const tax = document.getElementById("tax");
const errorMessage = document.querySelector(".errorMessage");
let code = getCodeFromLocalStorage();

newCategoryForm.addEventListener('submit', e => {
    e.preventDefault();
    
    checkCategoryNameInput();
    checkTaxInput();
})

function checkCategoryNameInput() {
    const categoryNameValue = categoryName.value;
    
    if(categoryNameValue === "") {
        inputError(categoryName);
    } else if (categoryNameValue !== "") {
        removeInputError(categoryName);
    }
}

function checkTaxInput() {
    const taxValue = parseFloat(tax.value); // converte para número
    
    if (tax.value === "") {
        inputError(tax);
    } else if (isNaN(taxValue) || taxValue <= 0) {
        alert("The tax value must be a number bigger than 0.");
        inputError(tax);
    } else {
        removeInputError(tax);
    }
}

function initCodeCount() {
    if(!localStorage.getItem('codeCount')) {
        localStorage.setItem('codeCount', 1);
    }
}

function getCodeFromLocalStorage() {
    return parseInt(localStorage.getItem('codeCount'));
}

function updateCodeInLocalStorage(codeCount) {
    localStorage.setItem('codeCount', codeCount);
}

function getCategoriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('categories')); // pega a categories iniciada
}

function addNewCategory() {
    const categories = getCategoriesFromLocalStorage(); // pega a que ja existe

    var category = { // objeto da categoria
        code: getValidId(),
        categoryName: categoryName.value,
        tax: tax.value
    };
    
    categories.push(category); // adicionar na lista
    localStorage.setItem('categories', JSON.stringify(categories)); // devolve pro localstoratge

    loadCategories();
}

function loadCategories() {
    const tbody = document.querySelector('#categoryTable tbody'); 
    tbody.innerHTML = '';
    const categories = getCategoriesFromLocalStorage();

    // alert("oi, entrei na load");

    categories.forEach(c => {
        // nova linha
        const row = document.createElement('tr');

        // cria as td pra code, categoryName e tax
        const codeTd = document.createElement('td');
        codeTd.textContent = c.code;
        codeTd.classList.add('firstTd');

        const categoryNameTd = document.createElement('td');
        categoryNameTd.textContent = c.categoryName;

        const taxTd = document.createElement('td');
        taxTd.textContent = c.tax;

        // cria o td e adiciona a classe 'lastTd'
        const deleteTd = document.createElement('td');
        deleteTd.classList.add('lastTd');

        // cria o botão de delete
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('tdButton');
        deleteButton.id = c.code;

        // adiciona o onclick
        deleteButton.onclick = function() {
            deleteCategory(this.id);
            console.log("Estou tentando excluir");
        };
        
        // adiciona o botão ao td
        deleteTd.appendChild(deleteButton);
        
        // adiciona as células na linha
        row.appendChild(codeTd);
        row.appendChild(categoryNameTd);
        row.appendChild(taxTd);
        row.appendChild(deleteTd);

        // adiciona a linha na tabela
        tbody.appendChild(row);
    });
}

function deleteCategory(categoryId) {
    console.log(categoryId);
    let categories = getCategoriesFromLocalStorage();

    categories = categories.filter(category => category.code != categoryId);

    localStorage.setItem('categories', JSON.stringify(categories));
    loadCategories();
}

function getValidId() {
    code;

    while (!ensureIdIsValid()) {
        code ++;
    }

    updateCodeInLocalStorage();

    return code;
}

function ensureIdIsValid() {
    const categories = getCategoriesFromLocalStorage();

    for (let cat of categories) {
        if (cat.code == code) {
            return false;
        }
    };

    return true;
}

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