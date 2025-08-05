//
// API utility for interactions with the backend FastAPI service.
//
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"; // Set in .env

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}, authToken = null) {
  /**
   * Fetch a resource from the API, adding credentials and auth token if needed.
   */
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    { ...options, headers }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.message || "API Error");
  }
  return response.json();
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Log in and return tokens. */
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// PUBLIC_INTERFACE
export async function register(userData) {
  /** Register user and return user object */
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// PUBLIC_INTERFACE
export async function getProfile(authToken) {
  /** Get profile for logged-in user */
  return apiFetch("/users/me", {}, authToken);
}

// PUBLIC_INTERFACE
export async function getPosts(authToken, opts = {}) {
  /** Fetch all posts (admin: all, user: own & published) */
  let suffix = "";
  const params = [];
  if (opts.status) params.push(`status=${encodeURIComponent(opts.status)}`);
  if (opts.search) params.push(`search=${encodeURIComponent(opts.search)}`);
  if (params.length) suffix = `?${params.join("&")}`;
  return apiFetch(`/posts${suffix}`, {}, authToken);
}

// PUBLIC_INTERFACE
export async function getPost(postId, authToken) {
  /** Fetch a single post */
  return apiFetch(`/posts/${postId}`, {}, authToken);
}

// PUBLIC_INTERFACE
export async function createPost(post, authToken) {
  /** Create (draft) post */
  return apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify(post),
  }, authToken);
}

// PUBLIC_INTERFACE
export async function updatePost(postId, postUpdate, authToken) {
  /** Update a post (draft or published) */
  return apiFetch(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(postUpdate),
  }, authToken);
}

// PUBLIC_INTERFACE
export async function deletePost(postId, authToken) {
  /** Delete a post */
  return apiFetch(`/posts/${postId}`, {
    method: "DELETE",
  }, authToken);
}

// PUBLIC_INTERFACE
export async function generateAiContent(prompt, authToken) {
  /** Get AI-generated blog content suggestion */
  return apiFetch("/ai/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  }, authToken);
}

// PUBLIC_INTERFACE
export async function schedulePost(postId, scheduleAt, authToken) {
  /** Schedule a post for future publication */
  return apiFetch(`/posts/${postId}/schedule`, {
    method: "POST",
    body: JSON.stringify({ schedule_at: scheduleAt }),
  }, authToken);
}

// PUBLIC_INTERFACE
export async function getNotifications(authToken) {
  /** Get notification list */
  return apiFetch("/notifications", {}, authToken);
}

// PUBLIC_INTERFACE
export async function markNotificationAsRead(notificationId, authToken) {
  /** Mark a notification as read */
  return apiFetch(`/notifications/${notificationId}/read`, {
    method: "POST"
  }, authToken);
}

// PUBLIC_INTERFACE
export async function getAdminStats(authToken) {
  /** Admin analytics dashboard data */
  return apiFetch("/admin/stats", {}, authToken);
}

// PUBLIC_INTERFACE
export async function getUsers(authToken) {
  /** List all users (admin) */
  return apiFetch("/admin/users", {}, authToken);
}
