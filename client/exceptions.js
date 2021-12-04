export class ApiClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "APIClientError";
  }
}
