import axios from "axios";

import { API_ORIGIN, Endpoints } from "./constants";

// Authentication API methods

// Attempt to sign in with the provided credentials
// - on 2xx return data
// - on 4xx raise Axios exception
// - on 5xx raise Axios exception
export const signin = async (username, password) => {
  const response = await axios.post(`${API_ORIGIN}${Endpoints.Signin}`, {
    username: username,
    password: password,
  });

  return response.data;
};
