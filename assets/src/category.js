const newCategoryForm = document.getElementById("newCategoryForm");
const categoryName = document.getElementById("categoryName");
const tax = document.getElementById("tax");
const errorMessage = document.querySelector(".errorMessage");
let isSubmitting = false; // controle para evitar múltiplos submits
let code = getCodeFromLocalStorage() || 1;


window.onload = function() {
    initCategories();
    initCodeCount();
    loadCategories();
};

function initCategories() {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify([])); // inicia o localstorage
    }
}

function initCodeCount() {
    if(!localStorage.getItem('codeCount')) {
        localStorage.setItem('codeCount', 1);
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
    const name = getCorrectName(document.getElementById("categoryName").value);

    if(categoryName.value === "" && tax.value === "") {
        inputError(categoryName);
        inputError(tax);
        return false;
    } else if(categoryName.value === "" && tax.value !== "") {
        inputError(categoryName);
        return false;
    } else if(categoryName.value !== "" && tax.value === "") {
        inputError(tax);
        return false;
    } else {
        removeInputError(categoryName);
        removeInputError(tax);
    }
    
    // previne só espaço no nome
    if (name == "") {
        inputError(categoryName);
        return false;
    }

    // não permitir números nem caracteres especiais
    if(!limitTextInput(name)) {
        alert("No numbers or special characters allowed on 'Category name'.")
        return false;
    }

    // validação do número entre 1 e 99,9
    if((tax.value) > 100 || tax.value <= 0 || isNaN(tax.value)) {
        alert("Please, insert an number between 1 and 99,9.")
        return false;
    } 
}

function limitTextInput(inputValue) {
    const textRegex = new RegExp(
        /[a-zA-Z]/
    );

    if(textRegex.test(inputValue)) {
        return true;
    }

    return false;
}

function getCodeFromLocalStorage() {
    return parseInt(localStorage.getItem('codeCount'));
}

function updateCodeInLocalStorage(codeCount) {
    localStorage.setItem('codeCount', codeCount);
}

function getCategoriesFromLocalStorage() { 
    return JSON.parse(localStorage.getItem('categories')) || []; // pega a categories iniciada
}

function getCorrectName(categoryName) {
    return categoryName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^\s+|\s+$/g,"").trim();
}

function getCorrectTaxToSave(taxValue) {
    return parseFloat(taxValue).toFixed(2);
}

function addNewCategory() {
    if(checkCategoryNameAndTaxInput() == false) {
        // pass
    } else {
        const categories = getCategoriesFromLocalStorage();

        const name = getCorrectName(document.getElementById("categoryName").value);

        const taxToSave = getCorrectTaxToSave(document.getElementById("tax").value);

        var category = { 
            code: getValidId(),
            categoryName: name,
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
    
    const categories = getCategoriesFromLocalStorage();

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
    let categories = getCategoriesFromLocalStorage();

    categories = categories.filter(category => category.code != categoryId);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    loadCategories();
}

function getValidId() {
    let code = getCodeFromLocalStorage() || 1;

    while (!ensureIdIsValid(code)) {
        code++;
    }

    updateCodeInLocalStorage(code + 1);
    return code;
}

function ensureIdIsValid(code) {
    const categories = getCategoriesFromLocalStorage();

    for (let cat of categories) {
        if (cat.code == code) {
            return false;
        }
    }
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