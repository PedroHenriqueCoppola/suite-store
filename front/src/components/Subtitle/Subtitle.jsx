import '../../App.css'
import './Subtitle.css'

function Subtitle(props) {
    return (
        <h4 className={props.className}>{props.content}</h4>
    )
}

export default Subtitle;