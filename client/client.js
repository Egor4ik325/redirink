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
    }
  }

  static signup(email, password, username) {}

  static verifyEmail() {}

  static changePassword() {}

  static resetPassword() {}

  /*
   * General API request method for all API methods.
   */
  async _request(config) {
    try {
      const response = await this._client.request(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new ApiClientError(`Request error: ${error.message}`);
      } else if (error.request) {
        throw new Error("No response received.");
      } else {
        throw new Error(error.message);
      }
    }
  }

  // Serialize user object
  _serializeUser(user) {
    return {
      name: user.name,
      username: user.username,
      url: user.url,
    };
  }

  /*
   * Serialize object (link) to the native datatype and name convention.
   */
  _serializeLink(link) {
    return {
      pk: link.pk,
      fromUrl: link.from_url,
      toUrl: link.to_url,
      createTime: link.create_time,
    };
  }

  _serializeInsight(insight) {
    return {
      link: insight.link,
      visitorId: insight.visitor_id,
      time: insight.time,
    };
  }

  async getMe() {
    return await this._request({
      method: "get",
      url: Endpoints.usersMe,
    });
  }

  async getUsers() {
    const users = await this._request({
      method: "get",
      url: Endpoints.users,
    });
    // Serialize users
    return [users.map((user) => this._serializeUser(user))];
  }

  async getLinks() {
    const links = await this._request({
      method: "get",
      url: Endpoints.links,
    });
    // Serialize response
    return {
      count: links.count,
      next: links.next,
      previous: links.previous,
      results: links.results.map((link) => this._serializeLink(link)),
    };
  }

  async createLink(toUrl) {
    return await this._request({
      method: "post",
      url: Endpoints.links,
      data: {
        to_url: toUrl,
      },
    });
  }

  async viewLink(pk) {
    const link = await this._request({
      method: "get",
      url: `${Endpoints.links}${pk}/`,
    });

    return this._serializeLink(link);
  }

  async changeLink(pk, toUrl) {
    const link = await this._request({
      method: "patch",
      url: `${Endpoints.links}${pk}/`,
      data: {
        to_url: toUrl,
      },
    });

    return this._serializeLink(link);
  }

  async deleteLink(pk) {
    await this._request({
      method: "delete",
      url: `${Endpoints.links}${pk}/`,
    });
  }

  async getInsights(params = {}) {
    const insights = await this._request({
      method: "get",
      url: Endpoints.insights,
      params: params,
    });
    // Serialize insights
    return {
      count: insights.count,
      next: insights,
      previous: insights.previous,
      results: insights.results.map((insight) =>
        this._serializeInsight(insight)
      ),
    };
  }
}

export default RedirinkApiClient;
