const API_BASE = "http://127.0.0.1:8000/api";

export function getAccessToken() {
  return localStorage.getItem("access") || "";
}

export function setTokens({ access, refresh }) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

async function request(path, options = {}) {
  const token = getAccessToken();

  // Build headers safely (prevents overwriting Content-Type)
  const headers = new Headers(options.headers || {});
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.detail || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // AUTH
  register: (payload) =>
    request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: async (username, password) => {
    // Force JSON body + JSON header
    const data = await request("/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setTokens(data);
    return data;
  },

  logout: () => clearTokens(),

  // USER
  me: () => request("/me/"),

  // APP
  listCourses: () => request("/courses/"),
  myEnrollments: () => request("/my/enrollments/"),
  enroll: (courseId) =>
    request("/enroll/", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    }),
  drop: (courseId) =>
    request("/drop/", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    }),

  // PASSWORD RESET
  passwordResetRequest: (email) =>
  request("/auth/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  }),

  passwordResetConfirm: (uid, token, new_password) =>
  request("/auth/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify({ uid, token, new_password }),
  }),

};

