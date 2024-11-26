import "./search.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { PlantContext } from "../../context/PlantContext.jsx";

import Navigation from "../../components/Navigation/Navigation.jsx";
import PlantCard from "../../components/PlantCard/PlantCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import SearchBar from "../../components/SeachBar/SearchBar.jsx";
import Dropdown from "../../components/Dropdown/Dropdown.jsx";
import countries from "../../assets/countries.json";
import Header from "../../components/Headers/Header.jsx";
import Notification from "../../components/Notification/Notification.jsx";
// import Modal from "../../components/Modal/Modal.jsx";

function Search() {
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [InputSearch, setInputSearch] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loadingPlants, setLoadingPlants] = useState(false); // For plant data loading

  // Access the plant data and functions from context
  const { plantData } = useContext(PlantContext);
  const {
    userPlants = [], // Ensure userPlants is an array by default
    savePlant,
    unsavePlant,
    loadingUserPlants,
  } = plantData;

  const handleCountryChange = (countryName) => {
    const selectedCountryObject = countries.find(
      (country) => country.name === countryName,
    );
    setSelectedCountry(selectedCountryObject);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const hardinessQuery = selectedCountry
          ? selectedCountry.zones.join(",")
          : "";
        const response = await axios.get(
          `https://perenual.com/api/species-list?key=${
            import.meta.env.VITE_API_KEY
          }&hardiness=${hardinessQuery}`,
        );
        setData(response.data.data || []); // Ensure data is always an array
        setLoadingPlants(false); // Stop loading state
      } catch (error) {
        console.error("Error fetching data: ", error.response.status);
        setError("Het ophalen van de data is mislukt!");
        setLoadingPlants(false); // Stop loading state even on error
      }
    }

    fetchData();
  }, [selectedCountry]);

  const handleSearch = async (searchTerm) => {
    setIsSearching(!!searchTerm.trim());
    setInputSearch(searchTerm);
    setNoResults(false); // Reset noResults state for new searches
    try {
      setLoadingPlants(true); // Start loading state for search
      const response = await axios.get(
        `https://perenual.com/api/species-list?key=${
          import.meta.env.VITE_API_KEY
        }&q=${searchTerm}`,
      );
      const searchResults = response.data.data || [];
      setSearchResults(searchResults);
      setNoResults(searchResults.length === 0);
      setLoadingPlants(false); // Stop loading state
    } catch (error) {
      console.error("Error searching for plants:", error);
      setError("Search failed. Please try again.");
      setLoadingPlants(false); // Stop loading state even on error
    }
  };

  const handleCloseNotification = () => {
    setError(null);
  };

  return (
    <main>
      <article>
        <Navigation />
        <section className="search-container">
          <header className="search-header">
            <h1 className="search-h1">Unleash the superpowers of plants</h1>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for plants..."
            />
            <div className="indicator-txt-wrapper">
              <p>
                Need inspiration? Give <span>banana</span> a try!{" "}
              </p>
            </div>
          </header>
        </section>

        <section className="suggested">
          <div className="container">
            <div className="indicator-header">
              <Header Tag="h2" className={noResults ? "no-result" : ""}>
                {noResults
                  ? `No results for ${InputSearch}`
                  : `${isSearching ? "Search results" : "Suggested plants"}`}
                {InputSearch && !noResults && (
                  <span className="searchTerm"> for {InputSearch}</span>
                )}
              </Header>

              {!isSearching && (
                <Dropdown
                  options={countries.map((country) => country.name)}
                  onSelect={handleCountryChange}
                  selectedOption={
                    selectedCountry ? selectedCountry.name : "Choose a country"
                  }
                />
              )}
            </div>
            {loadingPlants || loadingUserPlants ? ( // Loading for plants or user data
              <p>Loading plants...</p>
            ) : (
              <div className="grid">
                {error && <p>{error}</p>}
                {(searchResults.length > 0 ? searchResults : data).map(
                  (plant) =>
                    plant.id && (
                      <PlantCard
                        key={plant.id}
                        id={plant.id}
                        plantName={plant.common_name}
                        subName={plant.scientific_name.join(", ")}
                        image={
                          plant.default_image?.small_url ||
                          "fallback_image_url"
                        }
                        isLiked={userPlants.includes(String(plant.id))} // Check if plant is liked
                        onToggleLike={() =>
                          userPlants.includes(String(plant.id))
                            ? unsavePlant(plant.id)
                            : savePlant(plant.id)
                        } // Toggle save/unsave
                      />
                    ),
                )}
              </div>
            )}
          </div>
        </section>
        <Footer />
        {error && (
          <Notification message={error} onClose={handleCloseNotification} />
        )}

      </article>
    </main>
  );
}

export default Search;
