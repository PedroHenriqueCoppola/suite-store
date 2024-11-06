import '../styles/History.css';
import '../App.css';
import { useEffect, useState } from 'react';
import Title from '../components/Title/Title';
import Subtitle from '../components/Subtitle/Subtitle'
import ViewButton from '../components/ViewButton/ViewButton';

function History() {
    const [history, setHistory] = useState([]);

    const urlHistory = `http://localhost/routes/history.php`;

    useEffect(() => {
        getHistory()
    }, []);

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

    function view() {
        console.log("oi")
    }

    return (
        <div className="historyApp">
            <main>
                <div className="contentCard">
                    <Title content="Here you can see your full history." />

                    {history.length >= 1 ? (
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
                                        <td>${hist.total}</td>
                                        <td>${hist.tax}</td>
                                        <td>{hist.day}</td>
                                        <td className='lastTd'>
                                            <ViewButton onClick={() => view()}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody> 
                        </table>
                    ) : (<Subtitle className="subtitle" content="When you buy something, it will appear here :)"/>)} 
                </div>

                <div className="contentCard">
                    <Title content="That’s your purchase details." />
                </div>
            </main>
        </div>
    )
}

export default History