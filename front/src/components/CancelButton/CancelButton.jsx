import '../../App.css'
import './CancelButton.css'
import closedTrash from '../../assets/closedtrash.png'
import openTrash from '../../assets/opentrash.png'

function CancelButton(props) {
    return (
        <button className="cancelButton">
            <img src={openTrash} alt="trash" className='arr-2'/>
            <span className="text">{props.content}</span>
            <span className="circle"></span>
            <img src={closedTrash} alt="trash" className="arr-1"/>
        </button>
    )
}

export default CancelButton;