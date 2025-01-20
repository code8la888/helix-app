import axios from "axios";

export const fetchData = async (id) => {
  try {
    const res = await axios.get(`/api/strains/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching strains data:", error);
    throw error;
  }
};
