// PlantContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../config/supabaseClient.js";

const PlantContext = createContext({});

const PlantProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userPlants, setUserPlants] = useState(() => {
    const storedPlants = localStorage.getItem("userPlants");
    return storedPlants ? JSON.parse(storedPlants) : [];
  });
  const [loadingUserPlants, setLoadingUserPlants] = useState(true); // NEW: Track loading state

  useEffect(() => {
    const fetchUserPlants = async () => {
      if (!user) {
        console.warn("No user is logged in. Skipping fetch.");
        setUserPlants([]);
        setLoadingUserPlants(false);
        return;
      }

      const storedPlants = localStorage.getItem("userPlants");
      if (storedPlants) {
        console.log("Loaded from localStorage:", storedPlants);
        const parsedData = JSON.parse(storedPlants);
        setUserPlants(parsedData.map(String));
        setLoadingUserPlants(false);
        return;
      }

      console.log("Fetching saved plants from Supabase...");

      try {
        const { data, error } = await supabase
          .from("user_plants")
          .select("plant_id")
          .eq("user_id", user.id);

        if (error) throw error;

        const plantIds = data?.map((item) => item.plant_id) || [];
        setUserPlants(plantIds);

        // Sync to localStorage for offline persistence
        localStorage.setItem("userPlants", JSON.stringify(plantIds));
      } catch (error) {
        console.error("Error fetching user plants:", error.message);
      } finally {
        setLoadingUserPlants(false);
      }
    };

    fetchUserPlants();
  }, [user]);

  const savePlant = async (plantId) => {
    try {
      // Optimistically update
      const updatedPlants = [...userPlants, String(plantId)];
      setUserPlants(updatedPlants);
      localStorage.setItem("userPlants", JSON.stringify(updatedPlants));

      // Save to Supabase
      const { error } = await supabase
        .from("user_plants")
        .insert([{ user_id: user.id, plant_id: plantId }]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving plant:", error.message);
      // Rollback optimistic update
      setUserPlants((prev) => prev.filter((id) => id !== String(plantId)));
    }
  };

  const unsavePlant = async (plantId) => {
    try {
      // Optimistically update
      const updatedPlants = userPlants.filter((id) => id !== String(plantId));
      setUserPlants(updatedPlants);
      localStorage.setItem("userPlants", JSON.stringify(updatedPlants));

      // Remove from Supabase
      const { error } = await supabase
        .from("user_plants")
        .delete()
        .eq("user_id", user.id)
        .eq("plant_id", plantId);

      if (error) throw error;
    } catch (error) {
      console.error("Error unsaving plant:", error.message);
      // Rollback optimistic update
      setUserPlants((prev) => [...prev, String(plantId)]);
    }
  };

  const plantData = {
    userPlants,
    savePlant,
    unsavePlant,
    loadingUserPlants,
  };

  return (
    <PlantContext.Provider value={{ plantData }}>
      {children}
    </PlantContext.Provider>
  );
};

export { PlantContext, PlantProvider };
