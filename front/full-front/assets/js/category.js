const newCategoryForm = document.getElementById("newCategoryForm");
const categoryName = document.getElementById("categoryName");
const tax = document.getElementById("tax");

let isSubmitting = false; // controle para evitar múltiplos submits

const urlCategories = `http://localhost/routes/category.php`; // importando PHP

window.onload = function() {
    loadCategories();
};

newCategoryForm.addEventListener('submit', e => {
    e.preventDefault();

    if (isSubmitting) return; // se já estiver processando, não prossegue
    isSubmitting = true; // flag dizendo que o envio ta em andamento

    addNewCategory();

    isSubmitting = false; // flag liberada depois da submissão ser processada
});

async function getCategories() {
    return await fetch(urlCategories, {
        method: 'GET'
    })
    .then(res => res.json())
}

function validateInputs(){
    const inputName = document.getElementById("categoryName");
    const nameValue = validateInputSpacesAndCapitalize(document.getElementById("categoryName").value);
    console.log(nameValue);
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
    // limita o nome da categoria a 25 caracteres - CERTA
    if(nameValue.length > 25) {
        alert("The max name length is 25 characters.");
        return false;
    }
    // não permitir números nem caracteres especiais - CERTA
    if(!limitTextInput(nameValue)) {
        alert("Special characters or numbers are not allowed for the name.");
        return false;
    }
    // validação do número entre 1 e 100 - CERTA
    if((taxValue) > 100 || taxValue <= 0 || isNaN(taxValue)) {
        alert("Please, insert an number between 1 and 100");
        return false;
    }

    return nameValue;
}

function addNewCategory() {
    if(validateInputs() != false) {
        const formData = new FormData();
        let tax = document.getElementById("tax");

        value = validateInputs();
        tax = tax.value;
        console.log(tax)

        formData.append("rightName", value);
        formData.append("rightTax", tax);

        fetch(urlCategories, {
            method: 'POST',
            body: formData
        })
        .then(() => {
            loadCategories();
            categoryName.value = "";
            tax.value = "";
        })
        .catch(error => {
            console.log("Error:", error);
        });
    }
}

async function loadCategories() {
    const tbody = document.querySelector('#categoryTable tbody'); 
    tbody.innerHTML = ""; // serve pra limpar o corpo da tabela antes de carregar
    
    const response = await fetch(urlCategories);
    const categories = await response.json();

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

async function deleteCategory(categoryCode) {
    if(confirm("Are you sure you want to delete this category?")) {
        try {
            await fetch(`http://localhost/routes/category.php?code=${categoryCode}`, {
                method: "DELETE"
            }).then(() => {
                loadCategories();
            })
        } catch (error) {
            console.log(error.message);
        }
    }
}  