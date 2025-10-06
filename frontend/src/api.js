import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5111/api" // Your .NET backend
});

export const getImages = () => API.get("/Images");
