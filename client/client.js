import axios from "axios";
import Endpoints from "./endpoints.js";
import { ApiClientError } from "./exceptions.js";

class RedirinkApiClient {
  constructor(token) {
    this._client = axios.create({
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }

  // Authentication

  static async signin(username, password) {
    try {
      const response = await axios.post(Endpoints.signin, {
        username: username,
        password: password,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new ApiClientError("Unable to signin with provided credentials.");
      } else if (error.request) {
        throw new Error("No response received.");
      } else {
        throw new Error(error.message);
      }
    }
  }

  static signup(email, password, username) {}

  verifyEmail() {}

  changePassword() {}

  resetPassword() {}

  // Users

  async getUsers() {
    try {
      const response = await this._client.get(Endpoints.users);
      return response.data;
    } catch (error) {
      throw new ApiClientError();
    }
  }

  // Links

  async getLinks() {
    try {
      const response = await this._client.get(Endpoints.links);
      return response.data;
    } catch (error) {
      throw new ApiClientError();
    }
  }

  async createLink(to_url) {
    try {
      const response = await this._client.post(Endpoints.links, {
        to_url: to_url,
      });
      return response.data;
    } catch (error) {
      throw new ApiClientError();
    }
  }

  viewLink() {}

  changeLink() {}

  deleteLink() {}
}

export default RedirinkApiClient;
