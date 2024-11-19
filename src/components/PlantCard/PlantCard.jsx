import "./PlantCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import placeholderImage from "../../assets/placeholder-plant.jpg";
import LikeButton from "../LikeButton/LikeButton.jsx";
import { PlantContext } from "../../context/PlantContext.jsx";

function PlantCard({ plantName, subName, image, id }) {
  const { plantData } = useContext(PlantContext);
  const { userPlants, savePlant, unsavePlant } = plantData;
  // const [isLiked, setIsLiked] = useState(false);
  const isLiked = userPlants.includes(String(id)); // Ensure the ID is compared as a string

  const handleLikeClick = async () => {
    if (isLiked) {
      await unsavePlant(id); // Remove the plant
    } else {
      await savePlant(id); // Add the plant
    }
  };
  return (
    <div className="card-wrapper">
      <div className="plant-save">
        <LikeButton isLiked={isLiked} onClick={handleLikeClick} />
      </div>
      <Link to={`/plantdetail/${id}`} className="card-link">
        <div className="card" key={id}>
          <div className="card-img-wrapper">
            {image ? (
              <img src={image} alt="Plant Thumbnail" />
            ) : (
              <img src={placeholderImage} alt="placeholder" />
            )}
          </div>
          <div className="card-description">
            <div className="plant-title">
              <h3>{plantName ? plantName : "No available plant name"}</h3>

              <p>{subName ? subName : "No available sub name"}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PlantCard;
