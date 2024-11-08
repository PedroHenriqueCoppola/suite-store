import '../styles/History.css';
import '../App.css';
import { useEffect, useState } from 'react';
import Title from '../components/Title/Title';
import Subtitle from '../components/Subtitle/Subtitle'
import ViewButton from '../components/ViewButton/ViewButton';
import LocalStorage from '../classes/LocalStorage';

function History() {
    const [history, setHistory] = useState([]);
    const [ordersList, setOrdersList] = useState([]);

    const urlHistory = `http://localhost/routes/history.php`;

    useEffect(() => {
        getHistory()
    }, []);

    useEffect(() => {
        handleClick(0)
    }, [history]);

    async function getHistory() {
        try {
            const response = await fetch(urlHistory);
            const histories = await response.json();
            setHistory(histories);
        }
        catch (error) {
            console.log("Erro: ", error);
        }
    }

    async function handleClick(histCode) {
        try {
            const response = await fetch(`http://localhost/routes/order-item.php?code=${histCode}`);
            const list = await response.json();
            console.log(list);
            
            setOrdersList(list);
        }
        catch (error) {
            console.log("Erro: ", error);
        }
    }

    return (
        <div className="historyApp">
            <main>
                <div className="contentCard">
                    <Title content="Here you can see your full history." />

                    {history.length >= 1 ? (
                        <div className="historyTableDiv">
                            <table id="historyTable">
                                <thead>
                                    <tr>
                                        <th className="thPurchaseCode">Purchase Code</th>
                                        <th className="thTax">Tax</th>
                                        <th className="thTotal">Total</th>
                                        <th className="thDate">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((hist) => (
                                        <tr key={hist.code}>
                                            <td className="firstTd">{hist.code}</td>
                                            <td>${hist.tax}</td>
                                            <td>${hist.total}</td>
                                            <td>{hist.day}</td>
                                            <td className='lastTd'>
                                                <ViewButton onClick={() => handleClick(hist.code)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody> 
                            </table>
                        </div>
                    ) : (<Subtitle className="subtitle" content="When you buy something, it will appear here :)"/>)} 
                </div>

                <div className="contentCard">
                    <Title content="That’s your purchase details." />

                    {history.length >= 1 ? (
                        <div className="allCards">
                            {ordersList.map((order) => (
                                <div className="productCard" key={order.prodname}>
                                    <h3>Product: {order.prodname}</h3>

                                    <div className="subline"></div>

                                    <div className="informations">
                                        <p className="cardText">Category: {order.catname}</p>
                                        <p className="cardText">Amount: {order.amount}</p>
                                        <p className="cardText">Unit price: $ {LocalStorage.getCorrectFloatToSave((order.price)/order.amount)}</p>
                                        <p className="cardText">Tax ($) {LocalStorage.getCorrectFloatToSave(order.tax)}</p>
                                        <p className="cardText">Total: $ {LocalStorage.getCorrectFloatToSave(parseFloat(order.price) + parseFloat(order.tax))}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<Subtitle className="subtitle" content="You may see the details when you buy something."/>)} 
                </div>
            </main>
        </div>
    )
}

export default History