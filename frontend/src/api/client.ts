import axios from "axios";
import { fromAxiosError } from "./ApiError";

const client = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    // rethrow as ApiError so callers/hooks can rely on a single shape
    throw fromAxiosError(err);
  }
);

export default client;