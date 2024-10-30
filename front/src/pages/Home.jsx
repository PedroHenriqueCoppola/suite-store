import '../styles/Home.css';
import '../App.css';
import CancelFinishButton from '../components/CancelFinishButton/CancelFinishButton';
import AddNewButton from '../components/AddNewButton/AddNewButton';

function Home() {
    return (
        <div className="homeApp">
            <main>
                <div className="contentCard">

                    <AddNewButton type="submit" id="productButton" content="Add Product"/>
                </div>

                <CancelFinishButton content="Cancel" id="cancel" className="cancel"/>
                <CancelFinishButton content="Finish" id="finish" className="finish"/>
            </main>
        </div>
    )
}

export default Home