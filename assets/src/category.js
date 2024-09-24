const categoryCount = 'categoryCodeCount';
const categoriesJson = 'categories';
const productsJson = 'products';
const productsList = getObjectFromLocalStorage(productsJson);
const categoriesList = getObjectFromLocalStorage(categoriesJson);

const newCategoryForm = document.getElementById("newCategoryForm");
const categoryName = document.getElementById("categoryName");
const categoryNameValue = categoryName.value;
const tax = document.getElementById("tax");

let isSubmitting = false; // controle para evitar múltiplos submits

window.onload = function() {
    initCategoryCodeCount();
    initCategories();
    loadCategories();
};

function initCategories() {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify([])); // inicia o localstorage
    }
}

function initCategoryCodeCount() {
    if(!localStorage.getItem(categoryCount)) {
        localStorage.setItem(categoryCount, 1);
    }
}

newCategoryForm.addEventListener('submit', e => {
    e.preventDefault();

    if (isSubmitting) return; // se já estiver processando, não prossegue
    isSubmitting = true; // flag dizendo que o envio ta em andamento

    addNewCategory();

    isSubmitting = false; // flag liberada depois da submissão ser processada
});

function checkCategoryNameAndTaxInput(){
    const inputName = document.getElementById("categoryName");
    const nameValue = validateInputSpacesAndCapitalize(document.getElementById("categoryName").value);
    const taxValue = tax.value;

    if(nameValue == "" && taxValue == "") {
        inputError(inputName);
        inputError(tax);
        return false;
    } else if(nameValue == "" && taxValue != "") {
        inputError(inputName);
        return false;
    } else if(nameValue != "" && taxValue == "") {
        inputError(tax);
        return false;
    } else {
        removeInputError(inputName);
        removeInputError(tax);
    }

    // limita o nome da categoria a 30 caracteres
    if(nameValue.length > 30) {
        alert("The max name length is 30 characters.");
        return false;
    }

    // não permitir números nem caracteres especiais
    if(!limitTextInput(nameValue)) {
        alert("Special characters or numbers are not allowed for the name.")
        return false;
    }

    // validar nomes iguais
    if (findExistentCategoryName(nameValue)) {
        alert("This name already exists.");        
        return false;
    }

    // validação do número entre 1 e 100
    if((taxValue) > 100 || taxValue <= 0 || isNaN(taxValue)) {
        alert("Please, insert an number between 1 and 100")
        return false;
    } 
}

function findExistentCategoryName(name) {
    const categoriesList = getObjectFromLocalStorage(categoriesJson);
    const category = categoriesList.filter(element => element.name == name);
    return category[0];
}

function addNewCategory() {
    if(checkCategoryNameAndTaxInput() != false) {
        const categories = getObjectFromLocalStorage(categoriesJson);

        const name = document.getElementById("categoryName").value;

        const taxToSave = getCorrectFloatToSave(document.getElementById("tax").value);

        var category = { 
            code: getValidCategoryId(),
            name: validateInputSpacesAndCapitalize(name),
            tax: taxToSave
        };
        
        categories.push(category); // adicionar na lista
        localStorage.setItem('categories', JSON.stringify(categories)); // devolve pro localstoratge

        loadCategories(); // recarrega a tela depois de adicionar categoria
    }
}

function loadCategories() {
    const tbody = document.querySelector('#categoryTable tbody'); 
    tbody.innerHTML = ''; // serve pra limpar o corpo da tabela antes de carregar
    
    const categories = getObjectFromLocalStorage(categoriesJson);

    categories.forEach(c => {
        // nova linha
        const row = document.createElement('tr');
        
        // cria as td pra code, categoryName e tax
        const codeTd = document.createElement('td');
        codeTd.textContent = c.code;
        codeTd.classList.add('firstTd');

        const categoryNameTd = document.createElement('td');
        categoryNameTd.textContent = c.name;

        const taxTd = document.createElement('td');
        taxTd.textContent = c.tax + "%";

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
        };

        // adiciona o botão ao td
        deleteTd.appendChild(deleteButton);
        
        // adiciona as células aos respectivos tds
        row.appendChild(codeTd);
        row.appendChild(categoryNameTd);
        row.appendChild(taxTd);
        row.appendChild(deleteTd);

        // adiciona a linha na tabela
        tbody.appendChild(row);
    });
}

function deleteCategory(categoryCode) {
    const productsBelongingTargetCategory = productsList.map(product => product.category == categoryCode);

    if (productsBelongingTargetCategory[0] == true) {
        alert("You can't delete this category. There are products with it. Please, delete the products first.")
    } else {
        if(confirm("Are you sure you want to delete this category?")) {
            let categories = getObjectFromLocalStorage(categoriesJson);
            categories = categories.filter(category => category.code != categoryCode);
            localStorage.setItem('categories', JSON.stringify(categories));
            
            loadCategories();
        }
    }  
}

function updateCodeInLocalStorage(codeCount) {
    localStorage.setItem(categoryCount, codeCount);
}

function getValidCategoryId() {
    let code = getCodeFromLocalStorage(categoryCount) || 1;

    while (!ensureCategoryIdIsValid(code)) {
        code++;
    }

    updateCodeInLocalStorage(code + 1);
    return code;
}

function ensureCategoryIdIsValid(code) {
    const categories = getObjectFromLocalStorage(categoriesJson);

    for (let cat of categories) {
        if (cat.code == code) {
            return false;
        }
    }
    return true;
}

function testing() {
    
}