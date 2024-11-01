import '../../App.css'
import './HomeCard.css'
import DeleteButton from '../DeleteButton/DeleteButton';


function HomeCard(props) {
    return (
        <div className="productCard">
            <h3>Product: {props.product}</h3>

            <div className="subline"></div>

            <div className="informations">
                <p className="cardText">Unit price: $ {props.price}</p>
                <p className="cardText">Amount: {props.amount}</p>
                <p className="cardText">Total: $ {props.total}</p>
            </div>

            <div className="cardDeleteButton">
                <DeleteButton />
            </div>
        </div>
    )
}

export default HomeCard;