// API client cares about:
//
// 1. Authentication and configuration
// 2. Data deserialization
// 3. Error handling
import ApiClientLocalStorage from "./client.js";
export { default } from "./client.js";
export { TokenIsNull } from "./exceptions.js";

// API client singleton (functions packed in the class) object
export const client = new ApiClientLocalStorage();
