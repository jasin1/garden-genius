import './onboarding.css';
import logo from '../../assets/main-logo.svg';
import {Link} from "react-router-dom";
import Button from '../../components/Button/Button.jsx';

function onboarding() {
    return (
        <main className="main-onboarding">
            <article>
                <section>
                    <div className="onboarding-wrapper">
                        <div className="onboarding-header">
                            <div className="logo-wrapper">
                                <img src={logo} alt="GardenGenius main logo"/>
                            </div>
                            <div className="header-txt">
                                <p>
                                    Welcome to GardenGenius, your gardening companion app! Whether you&apos;re a
                                    seasoned
                                    green
                                    thumb or just starting out, this app is here to help you plan and maintain your
                                    dream
                                    garden
                                    with ease.
                                </p>
                            </div>
                        </div>
                        <div className="onboarding-content">
                            <p>With our user-friendly interface and comprehensive plant database, you can effortlessly
                                discover
                                the perfect plants for your garden based on your location and the current season. Say
                                goodbye to
                                guesswork and hello to thriving greenery!<br/><br/>

                                Explore thousands of plant species, access detailed care guides, and save your favorite
                                finds
                                for future reference. From colorful blooms to lush foliage, our app has everything you
                                need
                                to
                                bring your garden vision to life.
                            </p>
                            <div className="button-wrapper">
                                <Link to="/search">
                                    <Button type="button" variant="wide"> Start </Button>
                                </Link>
                            </div>

                        </div>

                    </div>
                </section>
            </article>
        </main>
    )
}

export default onboarding;