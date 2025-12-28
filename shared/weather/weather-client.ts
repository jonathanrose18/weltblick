import axios from "axios";

export const weatherClient = axios.create({
  baseURL: `https://api.open-meteo.com/v1`,
});
