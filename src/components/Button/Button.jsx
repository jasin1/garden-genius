import './Button.css';
function Button({children, onClick, type, variant}){
    return(
        <button className={`btn btn-${variant}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
}

export default Button;