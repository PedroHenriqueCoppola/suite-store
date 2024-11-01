import './AddNewButton.css'

function AddNewButton(props) {
    return (
        <button 
            className='addNewButton' 
            onClick={props.onClick}
            onSubmit={props.onSubmit}
        >{props.content}</button>
    )
}

export default AddNewButton;