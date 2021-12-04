import { ApiClientError } from "redirink-node-client";

export class TokenIsNull extends ApiClientError {
  constructor(message) {
    super(message);
    this.name = "TokenIsNull";
  }
}
