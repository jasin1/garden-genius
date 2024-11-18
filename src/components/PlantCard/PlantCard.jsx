import "./PlantCard.css";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import placeholderImage from "../../assets/placeholder-plant.jpg";
import LikeButton from "../LikeButton/LikeButton.jsx";
import { PlantContext } from "../../context/PlantContext.jsx";

function PlantCard({ plantName, subName, image, id }) {
  const { plantData } = useContext(PlantContext);
  const { userPlants, savePlant, unsavePlant } = plantData;
  const [isLiked, setIsLiked] = useState(false);
  // const isLiked = userPlants.includes(id);

  useEffect(() => {
    setIsLiked(userPlants.includes(id));
    console.log("PlantProvider userPlants:", userPlants);
  }, [userPlants, id]);

  const handleLikeClick = async () => {
    if (!isLiked) {
      await savePlant(id); // Save the plant
    } else {
      await unsavePlant(id); // Unsave the plant
    }
    setIsLiked(!isLiked); // Immediately reflect the change
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
