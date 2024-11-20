import "./saved.css";
import Navigation from "../../components/Navigation/Navigation.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import PlantCard from "../../components/PlantCard/PlantCard.jsx";
import { PlantContext } from "../../context/PlantContext.jsx";
import Hero3 from "../../assets/hero-bg-03.jpg";
import emptyPot from "../../assets/leegpotje.svg";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
// import { AuthContext } from "../../context/AuthContext.jsx";
import Header from "../../components/Headers/Header.jsx";
import Notification from "../../components/Notification/Notification.jsx";

function Saved() {
  const {
    plantData: { userPlants, loadingUserPlants },
  } = useContext(PlantContext);
  const [savedPlants, setSavedPlants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPlants = async () => {
        if (userPlants.length === 0) {
            setSavedPlants([]);
            return;
        }

        try {
            // Fetch plant details for all saved plant IDs
            const plantRequests = userPlants.map((id) =>
                axios.get(`https://perenual.com/api/species/details/${id}?key=${import.meta.env.VITE_API_KEY}`)
            );

            const responses = await Promise.all(plantRequests);
            const plantData = responses.map((response) => response.data);

            setSavedPlants(plantData);
        } catch (err) {
            console.error('Error fetching saved plants:', err);
            setError('Unable to load your saved plants. Please try again later.');
        }
    };

    fetchSavedPlants();
}, [userPlants]);

const handleCloseNotification = () => {
    setError(null);
};

return (
    <main>
        <article>
            <Navigation />
            <header className="hero">
                <img src={Hero3} alt="Hero image for the profile page" />
            </header>
            <section className="suggested">
                <div className="container">
                    <Header Tag="h2">Saved Plants</Header>

                    {loadingUserPlants ? (
                        <div>Loading...</div>
                    ) : savedPlants.length === 0 ? (
                        <div className="NoPlants">
                            <div className="potWrapper">
                                <img src={emptyPot} alt="Empty pot illustration" />
                            </div>
                            <p>No saved plants, start collecting your favorite plants!</p>
                        </div>
                    ) : (
                        <div className="grid">
                            {savedPlants.map((plant) => (
                                <PlantCard
                                    key={plant.id}
                                    id={plant.id}
                                    plantName={plant.common_name}
                                    subName={plant.scientific_name.join(", ")}
                                    image={plant.default_image?.small_url}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
            {error && (
                <Notification
                    message={error}
                    onClose={handleCloseNotification}
                />
            )}
        </article>
    </main>
);
}

export default Saved;