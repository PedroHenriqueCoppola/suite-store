import '../styles/Products.css';
import '../App.css';
import { useEffect, useState } from 'react';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';
import Subtitle from '../components/Subtitle/Subtitle';
import DeleteButton from '../components/DeleteButton/DeleteButton';
import Globals from '../classes/Globals';

function Products() {
    const category = document.getElementById("category");
    const productName = document.getElementById("productName");
    const productAmount = document.getElementById("productAmount");
    const unitPrice = document.getElementById("unitPrice");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getProducts();

        fetch("http://localhost/routes/category.php")
        .then((res) => res.json())
        .then((data) => {
            setCategories(data); // armazena os dados das categorias no state
        })
        .catch((error) => console.log('Erro: ', error));
    }, []); // o array vazio garante que o fetch aconteça apenas na montagem do componente e para o loop

    async function getProducts() {
        try {
            const response = await fetch("http://localhost/routes/product.php");
            const records = await response.json();
            setProducts(records);
        }
        catch (error) {
            console.log("Error:", error);
        }
    }

    const [prodName, setProdName] = useState("");
    const [prodAmount, setProdAmount] = useState("");
    const [prodPrice, setProdPrice] = useState("");
    const [catName, setCatName] = useState("");

    const handleChangeName = (e) => {
        setProdName(e.target.value)
    }

    const handleChangeAmount = (e) => {
        setProdAmount(e.target.value) // seta no 'catTax' o valor do que ta sendo atualizado no input
    }

    const handleChangePrice = (e) => {
        setProdPrice(e.target.value) // seta no 'catTax' o valor do que ta sendo atualizado no input
    }

    const handleChangeCatName = (e) => {
        setCatName(e.target.value)
    }

    function validateProducts() {
        const prodNameVal = productName.value;
        const prodAmountVal = productAmount.value;
        const prodPriceVal = unitPrice.value;
        const catVal = category.value;

        if(prodNameVal == "" || prodAmountVal == "" || prodPriceVal == "" || catVal == "") {
            alert("Please fill all the information correctly.")
            return false
        }

        if(prodNameVal.length > 30) {
            alert("The max name length is 30 characters.");
            return false;
        }

        if(!Globals.limitTextInput(prodNameVal)) {
            alert("Special characters are not allowed.");
            return false;
        }

        if((prodAmountVal) > 100000 || prodAmountVal < 1 || isNaN(prodAmountVal)) {
            alert("Please, insert an number between 1 and 100.000.");
            return false;
        }

        if((prodPriceVal) > 1000000 || prodPriceVal < 1 || isNaN(prodPriceVal)) {
            alert("Please, insert an number between 1 and 1.000.000.");
            return false;
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(validateProducts() != false) {
            const formData = new FormData();
    
            formData.append("product", Globals.validateInputSpacesAndCapitalize(prodName));
            formData.append("amount", prodAmount); 
            formData.append("price", prodPrice);
            formData.append("category", catName);
    
            await fetch('http://localhost/routes/product.php', {
                method: 'POST',
                body: formData
            })
            .then((response) => {
                if(!response.ok) alert("Something went wrong. Please try again.");
            })
            .then(() => {
                getProducts();
                productName.value = '';
                productAmount.value = '';
                unitPrice.value = '';
                // modal de success
            })
        }
    }

    async function handleDeleteProduct(code) {
        if(window.confirm("Are you sure you want to delete this product?")) {
            await fetch(`http://localhost/routes/product.php?code=${code}`, {
                method: "DELETE"
            })
            .then((response) => {
                if(!response.ok) alert("You can't delete a product that has already been purchased.");
            })
            .then(() => {
                getProducts();
            })
            .catch((error) => {
                console.log('error: ' + error);
            });
        }
    }

    return (
        <div className="productsApp">
            <main>
                <form id="newProductForm" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="gridBoxProducts">
                        <div className="nameContent">
                            <Input
                                type="text" 
                                className="inputBox"
                                name="prodName"
                                id="productName"
                                span="Product name"
                                content="No special characters"
                                onChange={handleChangeName}
                                required
                            />
                        </div>

                        <div className="amountContent">
                            <Input
                                type="number"
                                className="inputBox" 
                                name="prodAmount"
                                id="productAmount"
                                span="Amount"
                                content="Integer number (ex.: 10)"
                                onChange={handleChangeAmount}
                                step="0.01"
                                min="1"
                                required
                            />
                        </div>

                        <div className="priceContent">
                            <Input
                                type="number" 
                                className="inputBox"
                                name="prodPrice"
                                id="unitPrice"
                                span="Unit price"
                                content="Ex.: 10.00"
                                onChange={handleChangePrice}
                                step="0.01"
                                min="1"
                                required
                            />
                        </div>

                        <div className="categoryContent">
                            <select 
                                name="categoryCode" 
                                id="category" 
                                className="select"
                                onChange={handleChangeCatName}>
                                    <option value="" hidden>Select the category</option>
                                    {categories.map((category) => (
                                        <option key={category.code} value={category.code}>{category.name}</option>
                                    ))}
                            </select>
                            <p>Select the category of this product</p>
                        </div>

                        <div className="buttonContent">
                            <AddNewButton id="productButton" content="Add New Product"></AddNewButton>
                        </div>
                    </div>
                </form>

                <div className="contentCard">
                    <Title content="Here you can see all the products." />

                    {products.length >= 1 ? (
                        <table id="productsTable">
                            <thead>
                                <tr>
                                    <th className="thProdCode">Code</th>
                                    <th className="thProd">Product</th>
                                    <th className="thProdAmount">Amount</th>
                                    <th className="thProdPrice">Unit price</th>
                                    <th className="thCatName">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.code}>
                                        <td className="firstTd">{product.code}</td>
                                        <td>{product.name}</td>
                                        <td>{product.amount}</td>
                                        <td>{product.price}</td>
                                        <td>{product.catname}</td>
                                        <td className='lastTd'>
                                            <DeleteButton className="prodButton" onClick={() => handleDeleteProduct(product.code)}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (<Subtitle className="subtitle" content="There aren’t products registered yet."/>)} 
                </div>
            </main>
        </div>
    )
}

export default Products;