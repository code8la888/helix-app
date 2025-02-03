import {
  FETCH_STRAINS,
  FETCH_STRAIN,
  DELETE_MOUSE,
  RESTORE_MOUSE,
  DELETE_BREEDINGRECORD,
  RESTORE_BREEDINGRECORD,
  DELETE_STRAIN,
  RESTORE_STRAIN,
} from "../actions/types";

const initialState = {
  list: [], // 所有品系列表
  selectedStrain: null,
  mice: [],
  breedingRecords: [],
  users: [],
};

export default function strainReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STRAINS:
      return { ...state, list: action.payload };
    case FETCH_STRAIN:
      return {
        ...state,
        selectedStrain: action.payload.strain,
        mice: action.payload.mice || [],
        breedingRecords: action.payload.breedingRecords || [],
        users: action.payload.users || [],
      };
    case DELETE_MOUSE:
      return {
        ...state,
        mice: state.mice.filter((mouse) => mouse._id !== action.payload),
      };
    case RESTORE_MOUSE:
      return {
        ...state,
        mice: [...state.mice, { _id: action.payload, restored: true }],
      };
    case DELETE_BREEDINGRECORD:
      return {
        ...state,
        breedingRecords: state.breedingRecords.filter(
          (breedingRecord) => breedingRecord._id !== action.payload
        ),
      };
    case RESTORE_BREEDINGRECORD:
      return {
        ...state,
        breedingRecords: [
          ...state.breedingRecords,
          { _id: action.payload, restored: true },
        ],
      };
    case DELETE_STRAIN:
      return {
        ...state,
        list: state.list.filter((strain) => strain._id !== action.payload),
      };
    case RESTORE_STRAIN:
      return {
        ...state,
        list: [...state.list, { _id: action.payload, restored: true }],
      };
    default:
      return state;
  }
}
