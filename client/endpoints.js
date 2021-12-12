const API_ORIGIN = "http://localhost:8000";

const Endpoints = {
  // Authentication
  signin: `${API_ORIGIN}/auth/login/`,
  logout: `${API_ORIGIN}/auth/login/`,
  signup: `${API_ORIGIN}/auth/signup/`,
  confirmEmail: `${API_ORIGIN}/auth/signup/account-confirm-email/`,
  resendEmail: `${API_ORIGIN}/auth/signup/resend-email/`,
  verifyEmail: `${API_ORIGIN}/auth/signup/verify-email/`,
  // Password
  passwordChange: `${API_ORIGIN}/auth/password/change/`,
  passwordReset: `${API_ORIGIN}/auth/password/reset/`,
  passwordResetConfirm: `${API_ORIGIN}/auth/password/reset/confirm/`,
  // Users
  users: `${API_ORIGIN}/api/users/`,
  usersMe: `${API_ORIGIN}/api/users/me/`,
  // Links
  links: `${API_ORIGIN}/api/links/`,
  // Insights
  insights: `${API_ORIGIN}/api/insights/`,
};

export default Endpoints;
