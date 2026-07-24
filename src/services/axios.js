import axios from "axios";
import {
  getRawTokenFromStorage,
  getRefreshTokenFromStorage,
  isTokenExpired,
} from "../utils/token";
import { getApiErrorMessage } from "../utils/errorHandler";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const unwrapResponseData = (response) => {
  const body = response?.data ?? response;

  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    body.data !== undefined
  ) {
    return body.data;
  }

  return body;
};

api.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};
  const token = getRawTokenFromStorage();

  if (token && isTokenExpired(token)) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`;
    }

    return config;
  }

  // save token in header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      originalRequest.headers = originalRequest.headers || {};

      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    error.userMessage = getApiErrorMessage(error);

    return Promise.reject(error);
  },
);

// export const login = async ({ email, password }) => {
//   try {
//     const results = await api.post(`/auth/login`, {
//       email,
//       password,
//       //   email: "admin@taskflow.com",
//       //   password: "Admin1234",
//     });

//     return unwrapResponseData(results);
//   } catch (e) {
//     console.log(e);
//   }
// };
export const userLogin = async (userCreds) => {
  const email = userCreds?.username || userCreds?.email || "emilys";
  const password = userCreds?.password || "emilyspass";

  const result = await api.post(
    "/auth/login",
    {
      email,
      password,
      //   expiresInMins: 30,
    },
    {
      // Optional configurations go in the THIRD argument
      //   withCredentials: true,
    },
  );
  return unwrapResponseData(result);
};

export const forgotPassword = async (email) => {
  const result = await api.post(
    "/auth/forgot-password",
    {
      email,
    },
    {},
  );
  return unwrapResponseData(result);
};
export const resetPassword = async (token, password) => {
  const result = await api.post(
    "/auth/reset-password",
    {
      token,
      password,
    },
    {},
  );
  return unwrapResponseData(result);
};

export const myProfile = async () => {
  /* providing accessToken in bearer */
  const result = await api.get("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getRawTokenFromStorage()}`, // Pass JWT via Authorization header
    },
    credentials: "include", // Include cookies (e.g., accessToken) in the request
  });

  return unwrapResponseData(result);
};

const normalizeTaskPayload = (payload) => {
  if (Array.isArray(payload)) {
    return { tasks: payload, pagination: null };
  }

  const data = payload?.data ?? payload;

  if (Array.isArray(data)) {
    return { tasks: data, pagination: null };
  }

  if (Array.isArray(data?.tasks)) {
    return { tasks: data.tasks, pagination: data.pagination ?? null };
  }

  if (Array.isArray(data?.data)) {
    return { tasks: data.data, pagination: data.pagination ?? null };
  }

  if (Array.isArray(data?.items)) {
    return { tasks: data.items, pagination: data.pagination ?? null };
  }

  return { tasks: [], pagination: null };
};

export async function getUsers(signal) {
  const response = await api.get(`/users`, { signal });
  const payload = unwrapResponseData(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

export async function getTasks(page, signal) {
  const response = await api.get(`/tasks?page=${page}`, { signal });
  const payload = unwrapResponseData(response);

  if (Array.isArray(payload)) return { tasks: payload, pagination: null };
  if (Array.isArray(payload?.tasks)) return { tasks: payload.tasks, pagination: payload.pagination ?? null };
  if (Array.isArray(payload?.data?.tasks)) return { tasks: payload.data.tasks, pagination: payload.data.pagination ?? null };
  if (Array.isArray(payload?.data)) return { tasks: payload.data, pagination: null };

  return { tasks: [], pagination: null };
}

export async function getMyTasks(signal) {
  const response = await api.get(`/tasks/me`, { signal });
  const payload = unwrapResponseData(response);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload?.data?.tasks)) return payload.data.tasks;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

export async function createTask(task) {
  //  const email = userCreds?.username || userCreds?.email || "emilys";
  //   const password = userCreds?.password || "emilyspass";

  const result = await api.post("/tasks", task, {
    // Optional configurations go in the THIRD argument
    //   withCredentials: true,
    headers: {
      Authorization: `Bearer ${getRawTokenFromStorage()}`, // Pass JWT via Authorization header
    },
  });
  return unwrapResponseData(result);
}

export async function updateTask(task) {
  const result = await api.put("/tasks/" + task.id, task, {
    headers: {
      Authorization: `Bearer ${getRawTokenFromStorage()}`,
    },
  });
  return unwrapResponseData(result);
}

export async function getCategories() {
  const response = await api.get(`/categories`);

  return response.data.data.categories;
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshTokenFromStorage();

  if (!refreshToken) return null;

  const res = await refreshApi.post("/auth/refresh-token", {
    refreshToken,
  });

  const payload = unwrapResponseData(res);
  const accessToken = payload?.accessToken;

  if (accessToken) {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const storageKey = rememberMe ? "accessToken" : "accessToken";
    if (rememberMe) {
      localStorage.setItem(storageKey, accessToken);
      sessionStorage.removeItem(storageKey);
    } else {
      sessionStorage.setItem(storageKey, accessToken);
      localStorage.removeItem(storageKey);
    }
  }

  return accessToken;
}

// export async function refreshAccessToken() {
//   const refreshToken = localStorage.getItem("refreshToken");

//   if (!refreshToken) return null;

//   try {
//     const res = await api.post("/auth/refresh-token", {
//       refreshToken,
//     });

//     const payload = unwrapResponseData(res);
//     const newAccessToken = payload?.accessToken;

//     if (newAccessToken) {
//       localStorage.setItem("accessToken", newAccessToken);
//     }

//     return newAccessToken;
//   } catch (err) {
//     console.error("Failed to refresh token", err);
//     return null;
//   }
// }

// export { refreshAccessToken };
// export default api;
