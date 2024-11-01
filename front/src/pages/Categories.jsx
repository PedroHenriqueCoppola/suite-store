import '../styles/Categories.css';
import '../App.css';
import { useState } from 'react';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';

function Categories() {
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
        } catch (error) {
            // console.log(error)
        }
    }

    return (
        <div className="categoriesApp">
            <main>
                <form id='newCategoryForm' autoComplete="off" onSubmit={handleSubmit}>
                    <div className="contentCard">
                        <Input
                            type="text"
                            className="inputBox"
                            name="catName"
                            span="Category name"
                            content="No special characters or numbers"
                            onChange={handleChangeName}
                            required 
                        />

                        <Input 
                            type="number"
                            className="inputBox" 
                            name="catTax"
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
                </div>
            </main>
        </div>
    )
}

export default Categories