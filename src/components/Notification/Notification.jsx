import './Notification.css';
import Alert from '../../assets/Alert-icon-2.svg';
import { useEffect } from 'react';

function Notification({message, onClose}) {
    useEffect(() => {
        console.log('Notification message:', message);  // Debugging line
      }, [message]);
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