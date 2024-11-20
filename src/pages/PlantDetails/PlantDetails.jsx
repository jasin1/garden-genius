import './plantdetail.css';
import Navigation from "../../components/Navigation/Navigation.jsx";
import {useParams, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {PlantContext} from '../../context/PlantContext.jsx';
import axios from "axios";
import Footer from "../../components/Footer/Footer.jsx";
import WateringIcon from "../../assets/icon-watering.svg";
import SunIcon from "../../assets/icon-sun.svg";
import CycleIcon from "../../assets/icon-cycle.svg";
import placeholderImage from '../../assets/placeholder-plant.jpg';
import Arrow from "../../components/Arrow/Arrow.jsx";
import Button from '../../components/Button/Button.jsx';
import Notification from "../../components/Notification/Notification.jsx";



function PlantDetails() {
    const { plantData: { userPlants, savePlant, unsavePlant, loadingUserPlants } } = useContext(PlantContext);

    const {id} = useParams();
    const [plant, setPlant] = useState();
    const [error, setError] = useState(null);
    const numericId = parseInt(id, 10);
    const isLiked = userPlants.includes(String(numericId));
    // const [buttonText, setButtonText] = useState(isLiked ? "Remove from collection" : "Add to collection");
    const navigate = useNavigate();


    const goBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    useEffect(() => {
        async function fetchDetailData() {
            try {
                const response = await axios.get(`https://perenual.com/api/species/details/${id}?key=sk-nmqA66236192cd6f53490`);
                setPlant(response.data);
            } catch (e) {
                console.error(e);
                setError('Het ophalen van plant detail data is mislukt')
            }
        }

        fetchDetailData();

    }, [id]);

    const handleButtonClick = () => {
        if (isLiked) {
            unsavePlant(numericId);
        } else {
            savePlant(numericId);
        }
    };
    

    const handleCloseNotification = () =>{
        setError(null);
    }

    if (loadingUserPlants) {
        return <p>Loading plant details...</p>;
    }
    if (error) {
        return <Notification message={error} onClose={handleCloseNotification} />;
    }

    return (
        <main>
            <article>
                <Navigation/>
                <section className="green-bg">
                    {error ? (
                        <p>{error}</p>) : (
                        <div className="plant-detail-wrapper">
                            <div className="plant-top">
                                <Button type="button" variant="arrow" onClick={goBack}>
                                    <Arrow pathClassName="svg-path-color"/>
                                    Back
                                </Button>

                                <Button type="button" variant={isLiked ? 'grey' : 'orange'} onClick={handleButtonClick}>
    {isLiked ? "Remove from collection" : "Add to collection"}
</Button>
                            </div>
                            {plant && (
                                <div className="plant-detail-container">
                                    <div className="plant-image-wrapper">
                                        <img
                                            src={plant && plant.default_image ? plant.default_image.medium_url : placeholderImage}
                                            alt="main plant image"/>
                                    </div>
                                    <div className="plant-detail-content">
                                        <div className="plant-header">
                                            <h1>{plant.common_name}</h1>
                                            <p><span className="plant-sub-name">{plant.scientific_name}</span></p>
                                        </div>
                                        <div className="plant-txt">
                                            <p>
                                                {plant.description}
                                            </p>
                                        </div>

                                        <div className="plant-features">
                                            <div className="plant-feature">
                                                <div className="plant-icon-wrapper">
                                                    <img src={WateringIcon} alt="Plant Watering Icon"/>
                                                </div>
                                                <div className="plant-feature-txt-wrapper">
                                                    <p><span className="plant-feature-name">Watering</span></p>
                                                    <p><span className="plant-feature-option">{plant.watering}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="plant-feature">
                                                <div className="plant-icon-wrapper">
                                                    <img src={SunIcon} alt="Sun Icon"/>
                                                </div>
                                                <div className="plant-feature-txt-wrapper">
                                                    <p><span className="plant-feature-name">Sun</span></p>
                                                    <p>
                                                        {plant.sunlight.map((item, index) => (
                                                            <span key={index} className="plant-feature-option">
                                                    {item}
                                                                {index < plant.sunlight.length - 1 && ", "}
                                                </span>

                                                        ))}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="plant-feature">
                                                <div className="plant-icon-wrapper">
                                                    <img src={CycleIcon} alt="Cycling Icon"/>
                                                </div>
                                                <div className="plant-feature-txt-wrapper">
                                                    <p><span className="plant-feature-name">Cycle</span></p>
                                                    <p><span className="plant-feature-option">{plant.cycle}</span></p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
                <Footer/>
                {error && (
                    <Notification
                        message={error}
                        onClose={handleCloseNotification}
                    />
                )}
            </article>
        </main>
    )
}

export default PlantDetails;