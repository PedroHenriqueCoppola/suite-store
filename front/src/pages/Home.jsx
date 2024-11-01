import '../styles/Home.css';
import '../App.css';
import AddNewButton from '../components/AddNewButton/AddNewButton';
import ErrorModal from '../components/ErrorModal/ErrorModal';
import FinishButton from '../components/FinishButton/FinishButton';
import CancelButton from '../components/CancelButton/CancelButton';
import Input from '../components/Input/Input';
import Title from '../components/Title/Title';
import HomeCard from '../components/HomeCard/HomeCard';

function Home() {
    return (
        <div className="homeApp">
            <main>
                <form id="addProductForm" autocomplete="off">
                    <div className="gridBoxHome">
                        <div className="productContent">
                            <select name="productSelect" id="product" className="select">
                                <option value="" hidden>Select the product</option>                                
                                <option value="1">aaaaaa</option>                                
                                <option value="2">bbbbbb</option>                                
                                <option value="3">cccccc</option>                                
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
                            <AddNewButton type="submit" id="productButton" content="Add Product"/>
                        </div>
                    </div>
                </form>

                <div className="contentCard">
                    <Title content="That's your cart."/>

                    <div className="allCards">
                        <HomeCard
                            product="Pasta"
                            price="12.00"
                            amount="43"
                            total="516.00"
                        />

                        <HomeCard
                            product="Pasta"
                            price="12.00"
                            amount="43"
                            total="516.00"
                        />

                        <HomeCard
                            product="Pasta"
                            price="12.00"
                            amount="43"
                            total="516.00"
                        />

                        <HomeCard
                            product="Pasta"
                            price="12.00"
                            amount="43"
                            total="516.00"
                        />
                        
                        <HomeCard
                            product="Pasta"
                            price="12.00"
                            amount="43"
                            total="516.00"
                        />

                        <HomeCard
                            product="Pasta"
                            price="12.00"
                            amount="43"
                            total="516.00"
                        />
                    </div>

                    <form id="finishForm">
                        <div className="finalInformations">
                            <div className="finalTax">
                                <h4>Tax ($):</h4>
                                <p id="showFinalTax">$0.00</p>
                            </div>

                            <div class="finalTotal">
                                <h4>Total ($):</h4>
                                <p id="showFinalPrice">$0.00</p>
                            </div>

                            <div className="cancelAndFinishButton">
                                <CancelButton content="Cancel" />
                                <FinishButton content="Finish"/>
                            </div>
                        </div>
                    </form>
                </div>
                
                <ErrorModal content="Please, fill all the information correctly!"/>
            </main>
        </div>
    )
}

export default Home