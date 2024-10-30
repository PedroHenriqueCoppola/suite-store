import '../styles/Categories.css';
import '../App.css';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';

function Categories() {
    return (
        <div className="categoriesApp">
            <main>
                <form id='newCategoryForm' autocomplete="off">
                    <div className="contentCard">
                        <Input
                            type="text"
                            className="inputBox"
                            name="catName"
                            span="Category name"
                            content="No special characters or numbers"
                            required 
                        />

                        <Input 
                            type="number"
                            className="inputBox" 
                            name="catTax"
                            span="Tax"
                            content="Decimal number (ex.: 10.00)"
                            step="0.01"
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