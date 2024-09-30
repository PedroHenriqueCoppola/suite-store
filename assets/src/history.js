const histories = getObjectFromLocalStorage('histories');

const showPurchaseCode = document.querySelector(".showPurchaseCode");
const showPurchaseTax = document.querySelector(".showPurchaseTax");
const showPurchaseTotal = document.querySelector(".showPurchaseTotal");

// window.onload = function() {
//     loadHistory();
// }

document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
});

function calculateTotals(histories) {
    return histories.map(history => {
        let totalTax = 0;
        let totalPrice = 0;

        history.purchase.forEach(item => {
            totalTax += item.finalTax;
            totalPrice += getCorrectFloatToSave(item.totalPrice);
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

    purchases.forEach(purchase => {
        const row = document.createElement('tr');

        const purchaseCodeTd = document.createElement('td');
        purchaseCodeTd.textContent = purchase.purchaseId;
        purchaseCodeTd.classList.add('firstTd');

        const totalTaxTd = document.createElement('td');
        totalTaxTd.textContent = "$" + purchase.totalTax;
        totalTaxTd.classList.add('showPurchaseTax');

        const totalPriceTd = document.createElement('td');
        totalPriceTd.textContent = "$" + purchase.totalPrice;
        totalTaxTd.classList.add('showPurchaseTotal');

        const viewButtonTd = document.createElement('td');
        viewButtonTd.classList.add('lastTd');

        // configurando e criando o botão
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.classList.add('tdButton');
        viewButton.onclick = function() {
            alert("oi")
        };

        // coloca ele dentro do td
        viewButtonTd.appendChild(viewButton);

        row.appendChild(purchaseCodeTd);
        row.appendChild(totalTaxTd);
        row.appendChild(totalPriceTd);
        row.appendChild(viewButtonTd);

        tbody.appendChild(row);
    });
}