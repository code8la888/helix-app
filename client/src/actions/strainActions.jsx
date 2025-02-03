import { FETCH_STRAINS, FETCH_STRAIN } from "./types";
import { fetchData } from "../utils/fetchData";

export const fetchStrains = () => async (dispatch) => {
  try {
    const res = await fetchData("/api/strains");
    dispatch({ type: FETCH_STRAINS, payload: res });
  } catch (error) {
    console.error("Error fetching strains:", error);
  }
};

export const fetchStrain = (id) => async (dispatch) => {
  try {
    const res = await fetchData(
      `/api/strains/${id}?timestamp=${new Date().getTime()}`
    );
    console.log(res);

    dispatch({
      type: FETCH_STRAIN,
      payload: {
        strain: res.strain,
        mice: res.mice,
        breedingRecords: res.breedingRecords,
        users: res.users,
      },
    });
  } catch (error) {
    console.error(`Error fetching strain ${id}:`, error);
  }
};
