import '../styles/History.css';
import '../App.css';
import Title from '../components/Title/Title';

function History() {
    return (
        <div className="historyApp">
            <main>
                <div className="contentCard">
                    <Title content="Here you can see your full history." />
                </div>

                <div className="contentCard">
                    <Title content="That’s your purchase details." />
                </div>
            </main>
        </div>
    )
}

export default History