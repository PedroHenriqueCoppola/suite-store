import '../../App.css'
import './ErrorModal.css'
import React, { useState } from "react";
import close from '../../assets/close.png';
import x from '../../assets/remove.png';

function ErrorModal(props) {

    const [errorModal, setErrorModal] = useState(false);

    const toggleErrorModal = () => {
        setErrorModal(!errorModal) // se ta true vai pra false e vice-versa
    }

    // tira o scroll de fora
    if(errorModal) {
        document.body.classList.add('activeModal')
    } else {
        document.body.classList.remove('activeModal')
    }

    return (
        <>
            <button className="modalButton" onClick={toggleErrorModal}>Open</button>

            {errorModal && ( 
                <div className="modal">
                    <div className="overlay" onClick={toggleErrorModal}></div>
                    <div className="modalContent">
                        <div className="oops">
                            <img src={x} alt="aaaaaaaaaaa" />
                            <div className="text">
                                <h1>Oops!</h1>
                                <h3>Something went wrong.</h3>
                            </div>
                        </div>

                        <div className="modalMessage">
                            <p>{props.content}</p>
                        </div>

                        <button 
                            className="closeModal" 
                            onClick={toggleErrorModal}
                            > <img src={close} alt="Close" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ErrorModal;