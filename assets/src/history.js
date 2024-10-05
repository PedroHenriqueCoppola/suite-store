const histories = getObjectFromLocalStorage('histories');

const showPurchaseCode = document.querySelector(".showPurchaseCode");
const showPurchaseTax = document.querySelector(".showPurchaseTax");
const showPurchaseTotal = document.querySelector(".showPurchaseTotal");

document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
});

function calculateTotals(histories) {
    return histories.map(history => {
        let totalTax = 0;
        let totalPrice = 0;

        history.purchase.forEach(item => {
            totalTax += item.finalTax;
            totalPrice += item.totalPrice;
        });

        return {
            purchaseId: history.id,
            totalTax: getCorrectFloatToSave(totalTax),
            totalPrice: getCorrectFloatToSave(totalPrice)
        };
    });
}

function loadHistory() {
    const purchases = calculateTotals(histories);
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    i = 0;
    purchases.forEach(purchase => {
        const row = document.createElement('tr');

        const purchaseCodeTd = document.createElement('td');
        purchaseCodeTd.textContent = purchase.purchaseId;
        purchaseCodeTd.classList.add('firstTd');

        const totalTaxTd = document.createElement('td');
        totalTaxTd.textContent = "$ " + purchase.totalTax;
        totalTaxTd.classList.add('showPurchaseTax');

        const totalPriceTd = document.createElement('td');
        totalPriceTd.textContent = "$ " + purchase.totalPrice;
        totalPriceTd.classList.add('showPurchaseTotal');

        const viewButtonTd = document.createElement('td');
        viewButtonTd.classList.add('lastTd');

        // configurando e criando o botão
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.classList.add('tdButton');
        viewButton.id = histories[i].id;
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

function loadDetails(purchaseId) {
    const tbody = document.querySelector('#detailsTable tbody');
    tbody.innerHTML = '';

    const history = histories.find(purchase => purchase.id == purchaseId);

    history.purchase.forEach(el => {
        const row = document.createElement('tr');

        const productNameTd = document.createElement('td');
        productNameTd.textContent = el.name;
        productNameTd.classList.add('firstTd');

        const unitPriceTd = document.createElement('td');
        unitPriceTd.textContent = "$ " + el.unitPrice;

        const amountTd = document.createElement('td');
        amountTd.textContent = el.amount;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = el.category;

        const taxTd = document.createElement('td');
        taxTd.textContent = "$ " + getCorrectFloatToSave(el.finalTax);
        taxTd.classList.add('lastTd');

        row.appendChild(productNameTd);
        row.appendChild(unitPriceTd);
        row.appendChild(amountTd);
        row.appendChild(categoryTd);
        row.appendChild(taxTd);

        tbody.appendChild(row);
    })
}