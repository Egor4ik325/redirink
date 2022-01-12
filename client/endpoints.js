// const API_ORIGIN = "http://localhost:8000/api/";
const API_ORIGIN = "/api/";

const Endpoints = {
  // Authentication
  signin: `${API_ORIGIN}auth/login/`,
  logout: `${API_ORIGIN}auth/login/`,
  signup: `${API_ORIGIN}auth/signup/`,
  // Google authentication
  signinGoogle: `${API_ORIGIN}auth/signup/google/`,
  redirectGoogle: `${API_ORIGIN}auth/signup/google/redirect/`,
  // Email confirmation and verification
  resendEmail: `${API_ORIGIN}auth/signup/resend-email/`,
  // confirmEmail: `${API_ORIGIN}auth/signup/account-confirm-email/`, // handled by the server
  // verifyEmail: `${API_ORIGIN}auth/signup/verify-email/`, // handled by the server
  // Password
  passwordChange: `${API_ORIGIN}auth/password/change/`,
  passwordReset: `${API_ORIGIN}auth/password/reset/`,
  passwordResetConfirm: `${API_ORIGIN}auth/password/reset/confirm/`,
  // Users
  users: `${API_ORIGIN}users/`,
  usersMe: `${API_ORIGIN}users/me/`,
  // Links
  links: `${API_ORIGIN}links/`,
  // Insights
  insights: `${API_ORIGIN}insights/`,
};

export default Endpoints;
