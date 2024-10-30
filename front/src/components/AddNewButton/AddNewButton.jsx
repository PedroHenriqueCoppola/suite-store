import './AddNewButton.css'

function AddNewButton(props) {
    return (
        <button className='addNewButton'>{props.content}</button>
    )
}

export default AddNewButton;