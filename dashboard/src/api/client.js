import axios from "axios";
import RedirinkApiClient, { ApiClientError } from "redirink-node-client";
import { TokenIsNull } from "./exceptions.js";

class ApiClientLocalStorage extends RedirinkApiClient {
  // Override constructor to do nothing
  constructor(...args) {
    super();
  }

  // Override general request to get token from local storage on every request
  async _request(config) {
    const token = localStorage.getItem("token");
    if (token === null) {
      throw TokenIsNull("Token is not saved in local storage.");
    }

    // Partial update headers to set token
    const headers = { ...config.headers, Authorization: `Token ${token}` };
    try {
      // Try to perform request
      const response = await axios.request({ ...config, headers: headers });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Throw detailed information about exception
        if ("detail" in error.response.data) {
          throw new ApiClientError(error.response.data.detail);
        }
        throw new ApiClientError("Unable to signin with provided credentials.");
      } else if (error.request) {
        throw new Error("No response received.");
      } else {
        throw new Error(error.message);
      }
    }
  }
}

export default ApiClientLocalStorage;
