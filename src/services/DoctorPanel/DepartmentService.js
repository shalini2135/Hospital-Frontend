import axios from "axios";

const API_BASE = "https://doctorpanel-backend.onrender.com/api/departments";

export const fetchDepartments = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};
