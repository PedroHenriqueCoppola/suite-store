const categoryCount = 'categoryCodeCount';
const categoriesJson = 'categories';

const newCategoryForm = document.getElementById("newCategoryForm");
const categoryName = document.getElementById("categoryName");
const categoryNameValue = document.getElementById("categoryName").value;
const tax = document.getElementById("tax");

let isSubmitting = false; // controle para evitar múltiplos submits

window.onload = function() {
    initCategories();
    initCategoryCodeCount();
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
    const name = validateInputSpaces(document.getElementById("categoryName").value);

    if(name == "" && tax.value == "") {
        inputError(categoryName);
        inputError(tax);
        return false;
    } else if(name == "" && tax.value != "") {
        inputError(categoryName);
        return false;
    } else if(name != "" && tax.value == "") {
        inputError(tax);
        return false;
    } else {
        removeInputError(categoryName);
        removeInputError(tax);
    }

    // limita o nome da categoria a 25 caracteres
    if(name.length > 25) {
        alert("The max name length is 25 characters.");
        return false;
    }

    // não permitir números nem caracteres especiais
    if(!limitTextInput(name)) {
        alert("No numbers or special characters allowed on 'Category name'.")
        return false;
    }

    // validar nomes iguais
    if (findExistentCategoryName(name)) {
        alert("This name already exists.");
        return false;
    }

    // validação do número entre 1 e 99,9
    if((tax.value) > 100 || tax.value <= 0 || isNaN(tax.value)) {
        alert("Please, insert an number between 1 and 99.9.")
        return false;
    } 
}

function findExistentCategoryName(name) {
    const categoriesList = getObjectFromLocalStorage(categoriesJson);
    const category = categoriesList.filter(element => element.categoryName == name);
    console.log(category)
    return category[0];
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

function getCorrectTaxToSave(taxValue) {
    return parseFloat(taxValue).toFixed(2);
}

function addNewCategory() {
    if(checkCategoryNameAndTaxInput() == false) {
        // pass
    } else {
        const categories = getObjectFromLocalStorage(categoriesJson);

        const name = validateInputSpaces(document.getElementById("categoryName").value);

        const taxToSave = getCorrectTaxToSave(document.getElementById("tax").value);

        var category = { 
            code: getValidCategoryId(),
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
    
    const categories = getObjectFromLocalStorage(categoriesJson);

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

function deleteCategory(categoryId) {
    let categories = getObjectFromLocalStorage(categoriesJson);

    categories = categories.filter(category => category.code != categoryId);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    loadCategories();
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