import './Input.css'

function Input(props) {
    return(
        <div className="inputLayout">
            <div className={props.className}>
                <input 
                    type={props.type} 
                    className={props.className}
                    name={props.name}
                    id={props.id}
                    placeholder={props.placeholder}
                    pattern={props.pattern}
                    minLength={props.minlength}
                    maxlength={props.maxlength}
                    step={props.step}
                    required={props.required}
                />
                <span>{props.span}</span>
            </div>
            <p>{props.content}</p>
        </div>
    )
}

export default Input;