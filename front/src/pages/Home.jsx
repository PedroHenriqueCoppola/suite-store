import '../styles/Home.css';
import '../App.css';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import ErrorModal from '../components/ErrorModal/ErrorModal';
import FinishButton from '../components/FinishButton/FinishButton';
import CancelButton from '../components/CancelButton/CancelButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';
import LocalStorage from '../classes/LocalStorage';
import { useEffect, useState } from 'react';
import Subtitle from '../components/Subtitle/Subtitle';
import DeleteButton from '../components/DeleteButton/DeleteButton';

function Home() {
    // useStates
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [tax, setTax] = useState("");
    const [price, setPrice] = useState("");

    // PHP
    const urlProducts = `http://localhost/routes/product.php`;
    const urlCategories = `http://localhost/routes/category.php`;
    const urlOrders = `http://localhost/routes/order.php`; 
    const urlOrderItem = `http://localhost/routes/order-item.php`;
    
    // consts
    const product = document.getElementById("product");
    const productSelect = document.querySelector(".productSelect");
    const purchaseAmount = document.getElementById("purchaseAmount");
    const purchaseTax = document.getElementById("purchaseTax");
    const purchasePrice = document.getElementById("purchasePrice");
    const stockAmount = document.getElementById("stockAmount");

    useEffect(() => {
        LocalStorage.initPurchases();
        setPurchases(LocalStorage.getObjectFromLocalStorage('purchases'));
        
        getProducts();
        getCategories();
    }, []);

    useEffect(() => {
        updateTax()
        updatePrice()
        verifyTaxAndPrice()
    }, [purchases]);
    

    async function getProducts() {
        fetch(urlProducts)
        .then((res) => res.json())
        .then((data) => {
            setProducts(data)
            return data;
        })
        .catch((error) => {console.log("Erro: ", error)})
    }

    async function getCategories() {
        fetch(urlCategories)
        .then((res) => res.json())
        .then((data) => {
            setCategories(data)
        })
        .catch((error) => {console.log("Erro: ", error)})
    }

    let updateDisabledInputs = () => {
        const productProperties = products.find(el => el.code == product.value);
        const categoryProperties = categories.find(el => el.code == productProperties.category_code)
        
        purchaseTax.value = ("Tax: " + categoryProperties.tax + "%");
        purchasePrice.value = ("Unit price: " + productProperties.price);
        stockAmount.value = ("Available amount: " + productProperties.amount);
    }

    function getCategoryAndProductById(productCode) {
        const product = products.find(p => p.code == productCode); // pegando o product pelo id
        return product;
    }

    // validação
    function checkPurchaseInputs() {
        const homeAmountVal = purchaseAmount.value;
        let productCode = productSelect.value;

        if(homeAmountVal == "") {
            alert("Please insert an amount.")
            return false;
        }

        if(homeAmountVal <= 0 || isNaN(homeAmountVal)) {
            alert("Please, insert an number bigger than 0.");
            return false;
        }
        
        if(getSelectedProduct()) {
            alert("You already added this product to your cart. Please, modify it.");
            return false;
        }

        if(homeAmountVal > getCategoryAndProductById(productCode).amount) {
            alert("You can't buy an amount bigger than the stock amount.");
            return false;
        }
    }

    function getSelectedProduct() {
        const purchases = LocalStorage.getObjectFromLocalStorage('purchases');
        let productCode = productSelect.value;
    
        const teste = purchases.find(el => el.id == productCode); // pegando o product pelo id
        if (teste == undefined) {
            return;
        }
        return teste;
    }

    // localstorage
    function readCorrectContentOfHomeInputs() {
        // pegando os objetos de categories e products
        const productProperties = products.find(el => el.code == product.value);
        const categoryProperties = categories.find(el => el.code == productProperties.category_code)
        
        // amount
        const amount = parseInt(purchaseAmount.value); // retorna o amount selecionado
        
        // preço da unidade * quantidade
        const totalPrice = productProperties.price * amount;
        
        // calculo da taxa de um produto
        const percentageTax = parseFloat(categoryProperties.tax)/100;
        const finalTax = percentageTax * totalPrice;
    
        const productInPurchase = {
            id: productProperties.code,
            cardCode: getProductIndex(),
            name: productProperties.name,
            unitPrice: productProperties.price,
            tax: categoryProperties.tax,
            finalTax: finalTax,
            amount: amount, 
            totalPrice: totalPrice + finalTax
        };
    
        const purchase = {
            products: productInPurchase // coloca o array de products dentro do purchase
        };
    
        return { productProperties, amount, productInPurchase, purchase };
    }

    function addNewPurchase(e) {
        e.preventDefault()
        if (checkPurchaseInputs() != false) {
            const inputsData = readCorrectContentOfHomeInputs();
            const { productInPurchase } = inputsData;
    
            const newProduct = [...purchases, productInPurchase];
            setPurchases(newProduct);
            localStorage.setItem('purchases', JSON.stringify(newProduct))
            
            purchaseAmount.value = '';
            updateTax()
            updatePrice()
        }
    }

    function getProductIndex() {
        var lastCardCode = purchases.at(-1)?.cardCode ?? 0;
        var code = lastCardCode + 1;
        return code;
    }

    const deleteCard = (cardCode) => {
        if(window.confirm("Are you sure you want to delete this product?")) {
            const deleteProd = purchases.filter(purchase => purchase.cardCode != cardCode);
            setPurchases(deleteProd);
            localStorage.setItem('purchases', JSON.stringify(deleteProd));
            
            updateTax()
            updatePrice()
        }
    };

    function cancelButton(e) {
        e.preventDefault();
        if(window.confirm("Are you sure you want to clear your cart?")) {
            if (purchases.length >= 1) {
                localStorage.setItem('purchases', JSON.stringify([]));
                setPurchases(LocalStorage.getObjectFromLocalStorage('purchases'))
            } else {
                alert("You can't delete an empty cart.");
            }
        }
    }

    function updateTax() {
        let fullTax = 0;
        purchases.forEach(product => {
            fullTax += product.finalTax
            setTax(fullTax)
        })
    }

    function updatePrice() {
        let fullPrice = 0;
        purchases.forEach(product => {
            fullPrice += product.totalPrice
            setPrice(fullPrice)
        })
    }

    function verifyTaxAndPrice() {
        if (purchases.length <= 0) {
            setTax(0);
            setPrice(0);
        }
    }

    async function getLastCode() {
        const response = await fetch(urlOrders);
        const ordersList = await response.json();
        return ordersList[0].code;
    }

    async function finishButton(e) {
        e.preventDefault();

        if(window.confirm("Finish this purchase?")) {
            if (purchases.length <= 0) {
                alert("Please, add an product in your cart first.");
            } else {
                // criar o order
                const date = new Date().toLocaleString();
                const order = await fetch(urlOrders, {
                    method: 'POST',
                    body: JSON.stringify({day: date})
                })
                .then(res => res.json())
                .catch(error => {
                    console.log("Erro: ", error);
                })
    
                // cria o objeto e salva no banco
                const object = purchases.map(async purchase => {
                    await fetch(urlOrderItem, {
                        method: 'POST',
                        body: JSON.stringify({code: order.code, prodCode: purchase.id, amount: purchase.amount})
                    })
    
                    // atualizar os valores
                    const data = {
                        code: await getLastCode(),
                        tax: LocalStorage.getCorrectFloatToSave(tax),
                        total: LocalStorage.getCorrectFloatToSave(price)
                    }
    
                    fetch(urlOrders, {
                        method: 'PUT',
                        body: JSON.stringify(data) 
                    })
                })
    
                // diminui no estoque
                const promise3 = purchases.forEach(e => {
                    const stock = {
                        id: e.id,
                        amount: e.amount
                    }
    
                    fetch(urlOrderItem, {
                        method: 'PUT',
                        body: JSON.stringify(stock)
                    })
                })

                Promise.all([order, object, promise3]).then(async () => {
                    localStorage.setItem('purchases', JSON.stringify([]));
                    setPurchases(LocalStorage.getObjectFromLocalStorage('purchases'));
                    setTax(0);
                    setPrice(0);
                    window.alert("Purchase successfully completed.");
                    await new Promise(r => setTimeout(r, 500));
                    window.location.reload();
                })
            }
        }
    }
    
    return (
        <div className="homeApp">
            <main>
                <form id="addProductForm" autoComplete="off" onSubmit={addNewPurchase}>
                    <div className="allDisplay">
                        <div className="prodAndAmount">
                            <div className="productContent">
                                <select name="productSelect" id="product" className="select productSelect" onChange={updateDisabledInputs}>
                                    <option value="" hidden>Select the product</option>
                                    {products.map((product) => (
                                        <option key={product.code} value={product.code}>{product.name}</option>
                                    ))}                               
                                </select>
                                <p>Select your product</p>
                            </div>
                            
                            <div className="amountContent">
                                <Input
                                    type="number"
                                    className="inputBox" 
                                    name="purchaseAmount"
                                    id="purchaseAmount"
                                    span="Amount"
                                    content="Integer number (ex.: 10)"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="infosAndButton">
                            <Input
                                type="text"
                                className="inputBox" 
                                name="purchaseTax"
                                id="purchaseTax"
                                placeholder="Tax:"
                                disabled
                            />

                            <Input
                                type="text"
                                className="inputBox" 
                                name="purchasePrice"
                                id="purchasePrice"
                                placeholder="Unit price:"
                                disabled
                            />

                            <Input
                                type="text"
                                className="inputBox" 
                                name="stockAmount"
                                id="stockAmount"
                                placeholder="Available amount:"
                                disabled
                            />  
                            
                            <div className="productButton">
                                <AddNewButton type="submit" id="productButton" content="Add Product" />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="contentCard">
                    <Title content="That's your cart."/>

                    {purchases.length >= 1 ? (
                        <div className="allCards">
                            {purchases.map((el) => (
                                <div className="productCard" key={el.cardCode}>
                                    <h3>Product: {el.name}</h3>

                                    <div className="subline"></div>

                                    <div className="informations">
                                        <p className="cardText">Amount: {el.amount}</p>
                                        <p className="cardText">Unit price: $ {LocalStorage.getCorrectFloatToSave(el.unitPrice)}</p>
                                        <p className="cardText">Tax payed: $ {LocalStorage.getCorrectFloatToSave(el.finalTax)}</p>
                                        <p className="cardText">Total: $ {LocalStorage.getCorrectFloatToSave(el.totalPrice)}</p>
                                    </div>

                                    <div className="cardDeleteButton">
                                        <DeleteButton onClick={() => deleteCard(el.cardCode)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <Subtitle className="subtitle" content="There's nothing on your cart yet."/>}

                    <form id="finishForm" >
                        <div className="finalInformations">
                            <div className="finalTax">
                                <h4>Tax ($):</h4>
                                <p id="showFinalTax">${LocalStorage.getCorrectFloatToSave(tax)}</p>
                            </div>

                            <div className="finalTotal">
                                <h4>Total ($):</h4>
                                <p id="showFinalPrice">${LocalStorage.getCorrectFloatToSave(price)}</p>
                            </div>

                            <div className="cancelAndFinishButton">
                                <CancelButton content="Cancel" onClick={cancelButton}/>
                                <FinishButton content="Finish" onClick={finishButton}/>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Home;