import "./profile.css";
import Navigation from "../../components/Navigation/Navigation.jsx";
import Hero from "../../assets/profile-hero.jpg";
import Footer from "../../components/Footer/Footer.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { PlantContext } from "../../context/PlantContext.jsx";
import { useContext } from "react";
import Header from "../../components/Headers/Header.jsx";

function Profile() {
  const { user } = useContext(AuthContext);
  const { plantData } = useContext(PlantContext);
  const { userPlants, loadingUserPlants } = plantData;

  const userEmail = user ? user.email : "N/A";
  const numSavedPlants = userPlants.length;

  if (loadingUserPlants) {
    return <p>Loading your saved plants...</p>; // Show a loading state
}

  return (
    <main>
      <article>
        <Navigation />
        <header className="hero">
          <img src={Hero} alt="Hero image for the profile page" />
        </header>
        <section className="suggested">
          <div className="block-top">
            <div className="heading-block">
              {user ? (
                <>
                  <Header Tag="h1">Welcome, {user.email.split("@")[0]}!</Header>
                  <Header Tag="h2">
                    Your Email address is{" "}
                    <span className="coloredTxt">{userEmail}</span>
                  </Header>
                  <Header Tag="h2">
                    Number of Saved Plants is{" "}
                    <span className="coloredTxt">{numSavedPlants}</span>
                  </Header>
                </>
              ) : (
                <Header Tag="h1">Please log in to view your profile</Header>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </article>
    </main>
  );
}

export default Profile;
