import axios from 'axios';

export const fetchPlants = async (token, page = 1) => {
  const url = `https://trefle.io/api/v1/plants?token=${token}&page=${page}`;

  try {
    // Use axios instead of fetch
    const response = await axios.get(url);
    return response.data.data; // With axios, response.data gives the plant data
  } catch (error) {
    console.error("Error fetching plant data:", error);
    throw error;
  }
};