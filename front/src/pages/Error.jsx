import '../App.css'
import "../styles/Error.css"
import ghost from '../assets/ghost.png'

function Error() {
    return (
        <div className="errorApp">
            <main>
                <div className="errorContent">
                    <img src={ghost} alt="fantasma" />
                    <h1 className="errorh1">Whoops!</h1>
                    <h3 className="errorh3">Page not found. Please try again.</h3>
                </div>
            </main>
        </div>
    )
}

export default Error;