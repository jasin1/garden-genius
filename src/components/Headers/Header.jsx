
function Header({Tag, className, children}){
    return(
        <Tag className={className}>
            {children}
        </Tag>
    )
}

export default Header;