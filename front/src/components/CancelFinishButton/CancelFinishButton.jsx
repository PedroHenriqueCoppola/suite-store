import '../../App.css'
import './CancelFinishButton.css'

function CancelFinishButton(props) {
    return (
        <button id={props.id} className={props.className}>{props.content}</button>
    )
}

export default CancelFinishButton;