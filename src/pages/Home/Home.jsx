import './home.css';
import whiteLogo from "../../assets/white-logo.svg";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Button from '../../components/Button/Button.jsx';
import Notification from "../../components/Notification/Notification.jsx";
import {useState} from "react";


function Home() {
    const {register, handleSubmit} = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);


    async function handleFormSubmit(data) {
        console.log('formulier gegevens: ', data);
        try {
            await axios.post('https://api.datavortex.nl/gardengenius/users', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': import.meta.env.VITE_AUTH_API_KEY
                }

            });

        } catch (error) {
            console.error('Registratiefout: ', error);
            setError('Registratiefout');
        }

    }

    function handleNavigate(){
        navigate('/login');
    }

    const handleCloseNotification = () =>{
        setError(null);
    }

    return (
        <main>
            <section className="login-splash">
                <div className="main-image-wrapper">
                    <div className="overlay">
                        <div className="login-whitelogo-wrapper">
                            <img src={whiteLogo} alt="main logo"/>
                        </div>
                        <p>
                            Our platform is your gateway to discovering the perfect plants for your garden oasis.
                            Whether you are a seasoned gardener or just starting out, GardenGenius is here to help
                            you bring your gardening dreams to life.
                        </p>
                    </div>
                </div>

                <div className="intro-container">
                    <div className="intro-wrapper">
                        <div className="intro-header">
                            <h1 className="intro-welcome-txt">Sign up!</h1>

                            <p>
                                Embark on your green journey with! Sign up today and discover a world of botanical
                                beauty.
                            </p>
                        </div>
                        <div className="form-wrapper">
                            <form onSubmit={handleSubmit(handleFormSubmit)}>
                                <div className="form-container">
                                    <label htmlFor="name-filed">
                                        Name
                                        <input
                                            type="text"
                                            id="name-field"
                                            placeholder="Enter your name"
                                            {...register("username")}
                                        />
                                    </label>
                                    <label htmlFor="email-field">
                                        Email
                                        <input
                                            type="email"
                                            id="email-field"
                                            placeholder="Enter your email"
                                            {...register("email")}
                                        />
                                    </label>
                                    <label htmlFor="password-field">
                                        password
                                        <input
                                            type="password"
                                            id="password-field"
                                            placeholder="Enter your password"
                                            {...register("password")}
                                        />
                                    </label>
                                    <div className="btn-wrapper">
                                        <Button type="submit" variant="alt">Sign up Now</Button>
                                    </div>
                                    <div className="register-wrapper">
                                        <p>Already have an account? </p>

                                        <Button type="button" variant="orange" onClick={handleNavigate}> Login </Button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {error && (
                    <Notification
                        message={error}
                        onClose={handleCloseNotification}
                    />
                )}
            </section>
        </main>
    );
}

export default Home;

