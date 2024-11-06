import {createContext, useState, useContext} from "react";
import {AuthContext} from "./AuthContext.jsx";

export const PlantContext = createContext({});

function PlantContextProvider({children}) {
    const [LikedPlantIds, setLikedPlantIds] = useState([]);
    const {updateUserInfo} = useContext(AuthContext);


    const likePlant = (plantId) => {
        setLikedPlantIds((prevLikedPlantIds) => {
            const updatedLikedPlantIds = [...prevLikedPlantIds, plantId];
            updateUserInfo(updatedLikedPlantIds);
            return updatedLikedPlantIds;
        });

    };

    const unlikedPlant = async (plantId) => {
        try {

            setLikedPlantIds((prevLikedPlantIds) => {
                const updatedLikedPlantIds = prevLikedPlantIds.filter((id) => id !== plantId);
                updateUserInfo(updatedLikedPlantIds);

                return updatedLikedPlantIds;
            });

            await updateUserInfo();


        } catch (error) {
            console.error('Error updating user info', error);
        }

    };


    const data = {
        likedPlantIds: LikedPlantIds,
        likePlant: likePlant,
        unlikedPlant: unlikedPlant,
    };


    return (
        <PlantContext.Provider value={data}>
            {children}
        </PlantContext.Provider>
    )
}

export default PlantContextProvider;