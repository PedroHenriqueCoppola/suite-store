import '../styles/Products.css';
import '../App.css';
import { useEffect, useState } from 'react';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';
import Subtitle from '../components/Subtitle/Subtitle';
import DeleteButton from '../components/DeleteButton/DeleteButton';

function Products() {
    const category = document.getElementById("category");
    const productName = document.getElementById("productName");
    const productAmount = document.getElementById("productAmount");
    const unitPrice = document.getElementById("unitPrice");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        createCategoryOption()
        getProducts()
    }, []); // [] pra parar o loop

    function createCategoryOption() {
        fetch("http://localhost/routes/category.php")
        .then(res => {
            return res.json(); // filtra o response do fetch para um json
        })
        .then(data => { // data é o que o fetch me retorna em json depois de ter filtrado ele
            data.forEach(el => {
                const option = document.createElement("option");
                option.value = el.code;
                option.textContent = el.name;
        
                category.append(option);
            })
        })
        .catch(error => console.log(error));
    }
 
    async function getProducts() {
        try {
            const response = await fetch("http://localhost/routes/product.php");
            const records = await response.json();
            setProducts(records);
            console.log(setProducts)
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

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const formData = new FormData();

        formData.append("product", prodName);
        formData.append("amount", prodAmount); 
        formData.append("price", prodPrice);
        formData.append("category", catName);

        try {
            fetch('http://localhost/routes/product.php', {
                method: 'POST',
                body: formData
            })
            .then(() => {
                getProducts();
                productName.value = '';
                productAmount.value = '';
                unitPrice.value = '';
                // modal de success
            })
        } catch (error) {
            console.log("Error:", error);
        }
    }

    async function handleDeleteProduct(code) {
        try {
            await fetch(`http://localhost/routes/product.php?code=${code}`, {
                method: "DELETE"
            })
            .then(() => {
                getProducts();
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getCategoryNameFromTheCode(categoryCode) {
        const categoriesList = await fetch("http://localhost/routes/category.php")
            .then (res => {
                return res.json();
            })
        const returnCategoryCode = categoriesList.find(el => el.code == categoryCode);
        return returnCategoryCode.name;
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
                                content="No special characters or numbers"
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
                                onChange={handleChangeCatName} >
                                {/* <option value="" hidden>Select the category</option> */}
                            </select>
                            <p>Select the category</p>
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
                                        {/* ARRUMAR AQUI. ELE BASICAMENTE PRECISA EXECUTAR O QUE ESSA FUNÇÃO PEDE MAS NÃO PODE TER ASYNC NA FUNÇÃO GLOBAL (MESMO ERRO QUE TAVA COM O GUSTAVO)*/}
                                        {/* <td>{getCategoryNameFromTheCode(product.category_code)}</td> */}
                                        <td>{product.category_code}</td>
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