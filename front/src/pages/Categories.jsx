import '../styles/Categories.css';
import '../App.css';
import { useEffect, useState } from 'react';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';
import DeleteButton from '../components/DeleteButton/DeleteButton';
import Subtitle from '../components/Subtitle/Subtitle';
import Globals from '../classes/Globals';

function Categories() {
    const [categories, setCategories] = useState([]);
    const categoryName = document.getElementById("categoryName");
    const categoryTax = document.getElementById("categoryTax");

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

    function validateCategories() {
        const catNameValue = categoryName.value;
        const catTaxValue = categoryTax.value;

        if(catNameValue == "" || catTaxValue == ""){
            alert("Please fill all the information correctly.")
            return false
        }

        if(catNameValue.length > 25) {
            alert("The maximum is 25 characters.");
            return false;
        }

        if(!Globals.limitTextInput(catNameValue)) {
            alert("Special characters or numbers are not allowed for the name.");
            return false;
        }

        if((catTaxValue) > 100 || catTaxValue < 1 || isNaN(catTaxValue)) {
            alert("Please, insert an number between 1 and 100");
            return false;
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(validateCategories() != false) {
            const formData = new FormData();
            formData.append("name", Globals.validateInputSpacesAndCapitalize(catName)); // coloca o valor de 'catName' atulizado no input em "name" que vai ser resgatado no PHP
            formData.append("tax", catTax); // mesmo do de cima
    
            await fetch('http://localhost/routes/category.php', {
                method: 'POST',
                body: formData // fetch no formdata
            })
            .then((response) => {
                if(!response.ok) alert("Something went wrong. Please try again.");
            })
            .then(() => {
                getCategories();
                categoryName.value = "";
                categoryTax.value = "";
                // modal de success
            })
            .catch((error) => {
                console.log('error: ' + error);
            });
        }
    }

    async function handleDeleteCategory(code) {
        if(window.confirm("Are you sure you want to delete this category?")) {  
            await fetch(`http://localhost/routes/category.php?code=${code}`, {
                method: "DELETE"
            })
            .then((response) => {
                if(!response.ok) alert("You can't delete a category that is being used.");
            })
            .then(() => {
                getCategories();
            })
            .catch((error) => {
                console.log('error: ' + error);
            });
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
                            content="No special characters"
                            onChange={handleChangeName}
                            required 
                        />

                        <Input 
                            type="number"
                            className="inputBox" 
                            name="catTax"
                            id="categoryTax"
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