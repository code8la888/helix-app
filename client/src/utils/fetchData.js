import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const fetchData = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching strains data:", error);
    throw error;
  }
};
