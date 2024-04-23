import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});
