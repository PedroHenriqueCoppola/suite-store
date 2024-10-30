const showPurchaseCode = document.querySelector(".showPurchaseCode");
const showPurchaseTax = document.querySelector(".showPurchaseTax");
const showPurchaseTotal = document.querySelector(".showPurchaseTotal");

const urlHistory = `http://localhost/routes/history.php`; // importando PHP
const urlOrderItem = `http://localhost/routes/order-item.php`; // importando PHP

document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
});

async function loadHistory() {
    const response = await fetch(urlHistory);
    const histories = await response.json();
    
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    i = 0;
    histories.forEach(purchase => {
        const row = document.createElement('tr');

        const purchaseCodeTd = document.createElement('td');
        purchaseCodeTd.textContent = purchase.code;
        purchaseCodeTd.classList.add('firstTd');

        const totalTaxTd = document.createElement('td');
        totalTaxTd.textContent = "$ " + purchase.tax;
        totalTaxTd.classList.add('showPurchaseTax');

        const totalPriceTd = document.createElement('td');
        totalPriceTd.textContent = "$ " + purchase.total;
        totalPriceTd.classList.add('showPurchaseTotal');

        const viewButtonTd = document.createElement('td');
        viewButtonTd.classList.add('lastTd');

        // configurando e criando o botão
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.classList.add('tdButton');
        viewButton.id = histories[i].code;
        viewButton.onclick = function() {
            loadDetails(this.id);
        };

        // coloca ele dentro do td
        viewButtonTd.appendChild(viewButton);

        row.appendChild(purchaseCodeTd);
        row.appendChild(totalTaxTd);
        row.appendChild(totalPriceTd);
        row.appendChild(viewButtonTd);

        tbody.appendChild(row);
        i++;
    });
}

async function loadDetails(purchaseCode) {
    const response = await fetch(urlHistory);
    const histories = await response.json();
    console.log(histories);
    

    const tbody = document.querySelector('#detailsTable tbody');
    tbody.innerHTML = '';

    const detailsRes = await fetch(`http://localhost/routes/order-item.php?code=${purchaseCode}`);
    const ordersList = await detailsRes.json();
    console.log(ordersList);
    
    ordersList.find(purchase => purchase.code == purchaseCode);

    ordersList.forEach(el => {
        const row = document.createElement('tr');

        const productNameTd = document.createElement('td');
        productNameTd.textContent = el.prodname; 
        productNameTd.classList.add('firstTd');

        const rightPrice = (el.price)/(el.amount);
        const unitPriceTd = document.createElement('td');
        unitPriceTd.textContent = "$ " + getCorrectFloatToSave(rightPrice); 

        const amountTd = document.createElement('td');
        amountTd.textContent = el.amount;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = el.catname;

        const taxTd = document.createElement('td');
        taxTd.textContent = "$ " + getCorrectFloatToSave(el.tax);
        taxTd.classList.add('lastTd');

        row.appendChild(productNameTd);
        row.appendChild(unitPriceTd);
        row.appendChild(amountTd);
        row.appendChild(categoryTd);
        row.appendChild(taxTd);

        tbody.appendChild(row);
    })
}