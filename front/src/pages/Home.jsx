import '../styles/Home.css';
import '../App.css';
import CancelFinishButton from '../components/CancelFinishButton/CancelFinishButton';


function Home() {
    return (
        <div className="homeApp">
            <main>
                <h1>to na home</h1>
                <CancelFinishButton content="Cancel" id="cancel" className="cancel"/>
                <CancelFinishButton content="Finish" id="finish" className="finish"/>
            </main>
        </div>
    )
}

export default Home