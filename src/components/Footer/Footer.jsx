import './Footer.css';
import WhiteLogo from "../../assets/white-logo.svg"

function Footer(){
    return(
        <footer>
            <div className="footer-logo-wrapper">
                <img src={WhiteLogo} alt="GardenGenius White Logo"/>
            </div>
        </footer>
    );

}

export default Footer;