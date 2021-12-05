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
      }
      // } else if (error.request) {
      //   throw error;
      // } else {
      //   throw error;
      // }
    }
  }

  static signup(email, password, username) {}

  static verifyEmail() {}

  static changePassword() {}

  static resetPassword() {}

  /*
   * General API request method for all API methods
   */
  async _request(config) {
    try {
      const response = await this._client.request(config);
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

  async getMe() {
    return await this._request({
      method: "get",
      url: Endpoints.usersMe,
    });
  }

  async getUsers() {
    return await this._request({
      method: "get",
      url: Endpoints.users,
    });
  }

  async getLinks() {
    return await this._request({
      method: "get",
      url: Endpoints.links,
    });
  }

  async createLink(to_url) {
    return await this._request({
      method: "post",
      url: Endpoints.links,
      data: {
        to_url: to_url,
      },
    });
  }

  viewLink() {}

  changeLink() {}

  deleteLink() {}
}

export default RedirinkApiClient;
