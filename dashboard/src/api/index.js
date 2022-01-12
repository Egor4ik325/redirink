// API client cares about:
//
// 1. Authentication and configuration (headers)
// 2. Data deserialization (native types, names, form)
// 3. Error handling (custom exceptions)
import ApiClientLocalStorage from "./client.js";
export { default } from "./client.js";
export { TokenIsNull } from "./exceptions.js";
export { ApiClientLocalStorage };

// API client singleton (functions packed in the class) object
export const client = new ApiClientLocalStorage();
