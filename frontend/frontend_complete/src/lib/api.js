import i18n from "../i18n/index.js";

const BASE = "/api";

// Maps the fixed set of English strings the backend can return to i18n keys,
// so validation/auth error messages also follow the visitor's selected
// language. The backend itself is left untouched — this is a display-layer
// translation of a known, finite set of server response strings.
const ERROR_MESSAGE_KEYS = {
  "Please enter your name.": "apiErrors.nameRequired",
  "Please enter your full name.": "apiErrors.fullNameRequired",
  "Please enter a valid email address.": "apiErrors.invalidEmail",
  "Please enter a valid phone number.": "apiErrors.invalidPhone",
  "Password must be at least 8 characters.": "apiErrors.passwordTooShort",
  "Message could not be sent.": "apiErrors.messageNotSent",
  "Invalid page view data.": "apiErrors.invalidPageViewData",
  "Invalid search data.": "apiErrors.invalidSearchData",
  "An account with this email already exists.": "apiErrors.emailAlreadyExists",
  "Please enter a valid email and password.": "apiErrors.invalidEmailAndPassword",
  "Invalid email or password.": "apiErrors.invalidEmailOrPassword",
  "Your account is awaiting admin approval. Please check back soon.": "apiErrors.accountAwaitingApproval",
  "Your account registration was not approved. Please contact us for details.": "apiErrors.accountNotApproved",
  "Username and password are required.": "apiErrors.usernamePasswordRequired",
  "Invalid admin credentials.": "apiErrors.invalidAdminCredentials",
  "Not authenticated.": "apiErrors.notAuthenticated",
  "Session expired. Please log in again.": "apiErrors.sessionExpired",
  "Not a customer session.": "apiErrors.notCustomerSession",
  "Account not found.": "apiErrors.accountNotFound",
};

function localizeErrorMessage(message) {
  const key = ERROR_MESSAGE_KEYS[message];
  return key ? i18n.t(key) : message;
}

let accessToken = null;
let adminAccessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}
export function setAdminAccessToken(token) {
  adminAccessToken = token;
}
export function getAccessToken() {
  return accessToken;
}
export function getAdminAccessToken() {
  return adminAccessToken;
}

async function request(path, { method = "GET", body, auth = false, admin = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (admin && adminAccessToken) headers.Authorization = `Bearer ${adminAccessToken}`;
  else if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error ? localizeErrorMessage(data.error) : i18n.t("apiErrors.genericError");
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Public
  getProjects: () => request(`/projects?lang=${encodeURIComponent(i18n.language)}`),
  getProject: (slug) => request(`/projects/${slug}?lang=${encodeURIComponent(i18n.language)}`),
  getContent: () => request(`/content?lang=${encodeURIComponent(i18n.language)}`),
  submitLead: (payload) => request("/leads", { method: "POST", body: payload }),
  submitBroker: (payload) => request("/brokers", { method: "POST", body: payload }),
  chatbotMessage: (payload) => request("/chatbot/message", { method: "POST", body: payload }),
  trackPageView: (payload) =>
    request("/tracking/pageview", { method: "POST", body: payload }).catch(() => null),
  trackSearch: (payload) =>
    request("/tracking/search", { method: "POST", body: payload }).catch(() => null),

  // Customer auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me", { auth: true }),
  myEnquiries: () => request("/my-enquiries", { auth: true }),

  // Admin auth
  adminLogin: (payload) => request("/auth/admin/login", { method: "POST", body: payload }),
  adminLogout: () => request("/auth/admin/logout", { method: "POST" }),

  // Admin data
  adminDashboard: () => request("/admin/dashboard", { admin: true }),
  adminLeads: () => request("/admin/leads", { admin: true }),
  adminUpdateLead: (id, status) =>
    request(`/admin/leads/${id}`, { method: "PATCH", body: { status }, admin: true }),
  adminBrokers: () => request("/admin/brokers", { admin: true }),
  adminUpdateBroker: (id, status) =>
    request(`/admin/brokers/${id}`, { method: "PATCH", body: { status }, admin: true }),
  adminProjects: () => request("/admin/projects", { admin: true }),
  adminUpdateProject: (id, payload) =>
    request(`/admin/projects/${id}`, { method: "PATCH", body: payload, admin: true }),
  adminContent: () => request("/admin/content", { admin: true }),
  adminUpdateContent: (key, value) =>
    request(`/admin/content/${key}`, { method: "PATCH", body: { value }, admin: true }),
  adminUsers: (status) =>
    request(`/admin/users${status ? `?status=${status}` : ""}`, { admin: true }),
  adminApproveUser: (id) =>
    request(`/admin/users/${id}/approve`, { method: "PATCH", admin: true }),
  adminRejectUser: (id) =>
    request(`/admin/users/${id}/reject`, { method: "PATCH", admin: true }),
  adminResetUser: (id) =>
    request(`/admin/users/${id}/reset`, { method: "PATCH", admin: true }),
  adminConversations: () => request("/admin/chatbot/conversations", { admin: true }),
  adminPageViews: () => request("/admin/visitors/pageviews", { admin: true }),
  adminSearchQueries: () => request("/admin/visitors/searches", { admin: true }),
};
