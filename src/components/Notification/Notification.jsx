import './Notification.css';
import Alert from '../../assets/Alert-icon-2.svg';

function Notification({message, onClose}) {
    return (
        <div className="notification-overlay" onClick={onClose}>
            <div className="notification">
                <div className="notification-icon-wrapper">
                    <img src={Alert} alt="Alert icon"/>
                </div>
                <div className="notification-txt">
                    <span className="notification-header">This is an error message</span>
                    <span>{message}</span>
                </div>
                <button onClick={onClose}>&times;</button>
            </div>
        </div>

    )
}

export default Notification;