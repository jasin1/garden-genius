// PlantContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from "../config/supabaseClient.js";

const PlantContext = createContext({});

const PlantProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userPlants, setUserPlants] = useState([]);

  useEffect(() => {
    const fetchUserPlants = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_plants')
          .select('plant_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user plants:', error);
        } else {
          // console.log('fetched user plants: ',data)
          setUserPlants(data.map((item) => item.plant_id));
        }
      }
    };
    if(user){
      fetchUserPlants();
      
    }

  }, [user]);

  const savePlant = async (plantId) => {

    if(userPlants.includes(plantId)){
      console.warn('Plant is already saved');
      return;
    }


    setUserPlants((prev) => [...prev, plantId]); // Optimistic update
    const { error } = await supabase
      .from('user_plants')
      .insert([{ user_id: user.id, plant_id: plantId }]);

    if (error) {
      console.error('Error saving plant:', error);
      setUserPlants((prev) => prev.filter((id) => id !== plantId)); // Rollback
    }
  };

  const unsavePlant = async (plantId) => {
    setUserPlants((prev) => prev.filter((id) => id !== plantId)); // Optimistic update
    const { error } = await supabase
      .from('user_plants')
      .delete()
      .eq('user_id', user.id)
      .eq('plant_id', plantId);

    if (error) {
      console.error('Error removing plant:', error);
      setUserPlants((prev) => [...prev, plantId]); // Rollback
    }
  };

  const plantData ={
    userPlants,
    savePlant,
    unsavePlant,
  };

  return (
    <PlantContext.Provider value={{ plantData }}>
      {children}
    </PlantContext.Provider>
  );
};

export { PlantContext, PlantProvider };

