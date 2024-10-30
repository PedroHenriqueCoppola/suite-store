import '../styles/Products.css';
import '../App.css';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';

function Products() {
    return (
        <div className="productsApp">
            <main>
                <form id="newProductForm" autocomplete="off">
                    <div className="gridBox">
                        <div className="nameContent">
                            <Input
                                type="text" 
                                className="inputBox"
                                name="prodName"
                                id="productName"
                                span="Product name"
                                content="No special characters or numbers"
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
                                step="0.01"
                                min="1"
                                required
                            />
                        </div>

                        <div className="categoryContent">
                            <select name="categoryCode" id="category" className="select">
                                <option value="" hidden>Select the category</option>                                
                                <option value="1">Teste1</option>                                
                                <option value="2">Teste2</option>                                
                                <option value="3">Teste3</option>                                
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
                </div>
            </main>
        </div>
    )
}

export default Products