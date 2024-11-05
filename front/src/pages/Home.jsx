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
    // consts
    const product = document.getElementById("product");
    const purchaseAmount = document.getElementById("purchaseAmount");
    const purchaseTax = document.getElementById("purchaseTax");
    const purchasePrice = document.getElementById("purchasePrice");

    // useStates
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        LocalStorage.initPurchases()

        setPurchases(LocalStorage.getObjectFromLocalStorage('purchases'))

        fetch("http://localhost/routes/product.php")
        .then((res) => res.json())
        .then((data) => {
            setProducts(data)
        })
        .catch((error) => {console.log("Erro: ", error)})

        fetch("http://localhost/routes/category.php")
        .then((res) => res.json())
        .then((data) => {
            setCategories(data)
        })
        .catch((error) => {console.log("Erro: ", error)})
    }, [])

    let updateDisabledInputs = () => {
        const productProperties = products.find(el => el.code == product.value);
        const categoryProperties = categories.find(el => el.code == productProperties.category_code)

        purchaseTax.value = ("Tax: " + categoryProperties.tax + "%");
        purchasePrice.value = ("Unit price: " + productProperties.price)
    }

    // validação
    function checkPurchaseInputs() {
        return true;
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
        
    //     // taxa e preço que aparecem como total em cima dos botões
    //     taxes += finalTax;
    //     prices += totalPrice + finalTax;
        
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

    async function addNewPurchase(e) {
        e.preventDefault()
        if (await checkPurchaseInputs() != false) {
            const inputsData = readCorrectContentOfHomeInputs();
            const { productInPurchase } = inputsData;
    
            purchases.push(productInPurchase);
            localStorage.setItem('purchases', JSON.stringify(purchases))
            setPurchases(LocalStorage.getObjectFromLocalStorage('purchases'))
            
            purchaseAmount.value = '';
            // printFinalTax();
            // printFinalPrice();
        }
    }

    function getProductIndex() {
        var lastCardCode = purchases.at(-1)?.cardCode ?? 0;
        var code = lastCardCode + 1;
        return code;
    }

    function deleteCard(cardCode) {
        // taxes = 0;
        // prices = 0;
        
        setPurchases(purchases.filter(purchase => purchase.cardCode != cardCode));
        console.log(purchases)
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        // reloadPrintTax();
        // reloadPrintPrice();
    }

    return (
        <div className="homeApp">
            <main>
                <form id="addProductForm" autoComplete="off" onSubmit={addNewPurchase}>
                    <div className="gridBoxHome">
                        <div className="productContent">
                            <select name="productSelect" id="product" className="select productSelect" onChange={updateDisabledInputs}>
                                <option value="" hidden>Select the product</option>
                                {products.map((product) => (
                                    <option key={product.code} value={product.code}>{product.name}</option>
                                ))}                               
                            </select>
                            <p>Select your product</p>
                        </div>

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
                        
                        <div className="productButton">
                            <AddNewButton type="submit" id="productButton" content="Add Product" />
                        </div>
                    </div>
                </form>

                <div className="contentCard">
                    <Title content="That's your cart."/>

                    {purchases.length >= 1 ? (
                        <div className="allCards">
                            {purchases.map((el) => (
                                <div className="productCard">
                                    <h3>Product: {el.name}</h3>

                                    <div className="subline"></div>

                                    <div className="informations">
                                        <p className="cardText">Unit price: $ {el.unitPrice}</p>
                                        <p className="cardText">Amount: {el.amount}</p>
                                        <p className="cardText">Total: $ {el.totalPrice}</p>
                                    </div>

                                    <div className="cardDeleteButton">
                                        <DeleteButton id={el.cardCode} onClick={() => deleteCard(el.cardCode)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <Subtitle className="subtitle" content="There's nothing on your cart yet."/>}

                    <form id="finishForm" >
                        <div className="finalInformations">
                            <div className="finalTax">
                                <h4>Tax ($):</h4>
                                <p id="showFinalTax">$0.00</p>
                            </div>

                            <div className="finalTotal">
                                <h4>Total ($):</h4>
                                <p id="showFinalPrice">$0.00</p>
                            </div>

                            <div className="cancelAndFinishButton">
                                <CancelButton content="Cancel" onClick={(e) => {
                                    e.preventDefault();
                                    if (purchases.length >= 1) {
                                        localStorage.setItem('purchases', JSON.stringify([]));
                                        setPurchases(LocalStorage.getObjectFromLocalStorage('purchases'))
                                    } else {
                                        alert("You can't delete an empty cart.");
                                    }
                                }}/>
                                <FinishButton content="Finish" onClick={(e) => {
                                    e.preventDefault()
                                }}/>
                            </div>
                        </div>
                    </form>
                </div>
                
                <ErrorModal content="Please, fill all the information correctly!"/>
            </main>
        </div>
    )
}

export default Home;