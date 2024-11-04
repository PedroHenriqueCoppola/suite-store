import '../styles/Categories.css';
import '../App.css';
import { useEffect, useState } from 'react';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';
import DeleteButton from '../components/DeleteButton/DeleteButton';
import Subtitle from '../components/Subtitle/Subtitle';

function Categories() {
    const categoryName = document.getElementById("categoryName");
    const tax = document.getElementById("tax");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories()
    }, []); // [] pra parar o loop
 
    async function getCategories() {
        try {
            const response = await fetch("http://localhost/routes/category.php");
            const records = await response.json();
            setCategories(records);
        }
        catch (error) {
            console.log("Error:", error);
        }
    }

    const [catName, setCatName] = useState("");
    const [catTax, setCatTax] = useState("");

    const handleChangeName = (e) => {
        setCatName(e.target.value) // seta no 'catName' o valor do que ta sendo atualizado no input
    }

    const handleChangeTax = (e) => {
        setCatTax(e.target.value) // seta no 'catTax' o valor do que ta sendo atualizado no input
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", catName); // coloca o valor de 'catName' atulizado no input em "name" que vai ser resgatado no PHP
        formData.append("tax", catTax); // mesmo do de cima

        try {
            fetch('http://localhost/routes/category.php', {
                method: 'POST',
                body: formData // fetch no formdata
            })
            .then(() => {
                getCategories();
                categoryName.value = "";
                tax.value = "";
                // modal de success
            })
        } catch (error) {
            console.log("Error:", error);
        }
    }

    async function handleDeleteCategory(code) {
        try {
            await fetch(`http://localhost/routes/category.php?code=${code}`, {
                method: "DELETE"
            })
            .then(() => {
                getCategories();
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="categoriesApp">
            <main>
                <form id='newCategoryForm' autoComplete="off" onSubmit={handleSubmit} >
                    <div className="contentCard">
                        <Input
                            type="text"
                            className="inputBox"
                            name="catName"
                            id="categoryName"
                            span="Category name"
                            content="No special characters or numbers"
                            onChange={handleChangeName}
                            required 
                        />

                        <Input 
                            type="number"
                            className="inputBox" 
                            name="catTax"
                            id="tax"
                            span="Tax"
                            content="Decimal number (ex.: 10.00)"
                            step="0.01"
                            onChange={handleChangeTax}
                            required
                        />

                        <AddNewButton content="Add New Category"></AddNewButton>
                    </div>
                </form>

                <div className="contentCard">
                    <Title content="Here you can see all the categories."/>

                    {categories.length >= 1 ? (
                        <table id="categoryTable">
                            <thead>
                                <tr>
                                    <th className="thCode">Code</th>
                                    <th className="thCat">Category</th>
                                    <th className="thTax">Tax (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.code}>
                                        <td className="firstTd">{category.code}</td>
                                        <td>{category.name}</td>
                                        <td>{category.tax}%</td>
                                        <td className='lastTd'>
                                            <DeleteButton onClick={() => handleDeleteCategory(category.code)}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody> 
                        </table>
                    ) : (<Subtitle className="subtitle" content="There aren’t categories registered yet."/>)} 
                </div>
            </main>
        </div>
    )
}

export default Categories;
