class LocalStorage {

    static initPurchases() {
        if (!localStorage.getItem('purchases')) {
            localStorage.setItem('purchases', JSON.stringify([])); // inicia o localstorage
        }
    }

    static getObjectFromLocalStorage(key) { 
        return JSON.parse(localStorage.getItem(key)) || []; // pega qualquer objeto iniciado no localstorage
    }
}

export default LocalStorage;