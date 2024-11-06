import './profile.css';
import Navigation from "../../components/Navigation/Navigation.jsx";
import Hero from "../../assets/profile-hero.jpg";
import Footer from "../../components/Footer/Footer.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import {useContext, useState, useEffect} from "react";
import Header from "../../components/Headers/Header.jsx";

function Profile() {

    const { user } = useContext(AuthContext);
    const [numSavedPlants, setNumSavedPlants] = useState(0);

    const userName = user ? user.username : null;
    const userEmail = user ? user.email : null;

    useEffect(() => {
        if(user && user.info){
            const userInfo = JSON.parse(user.info);
            setNumSavedPlants(userInfo.length);
        }else{
            setNumSavedPlants(0);
        }

    }, [user]);


    return (
        <main>
            <article>
                <Navigation/>
                <header className="hero">
                    <img src={Hero} alt="Hero image for the profile page"/>
                </header>
                <section className="suggested">
                    <div className="block-top">
                        <div className="heading-block">
                            {userName ?(
                                <Header Tag={"h1"}>Welcome, {userName}!</Header>
                            ): (
                                <Header Tag="h1">Please log in to view your profile</Header>
                            )}
                            <Header Tag="h2">Your Email address is <span className="coloredTxt">{userEmail}</span></Header>
                            <Header Tag="h2">Number of Saved Plants is <span className="coloredTxt">{numSavedPlants}</span></Header>
                        </div>

                    </div>

                </section>
                <Footer/>
            </article>
        </main>
    )
}

export default Profile;
