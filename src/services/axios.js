import axios from "axios";
import { getRawTokenFromStorage, isTokenExpired } from "../utils/token";
import { getApiErrorMessage } from "../utils/errorHandler";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

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

export const login = async ({ email, password }) => {
  try {
    const results = await api.post(`/auth/login`, {
      email,
      password,
      //   email: "admin@taskflow.com",
      //   password: "Admin1234",
    });

    return results.data;
  } catch (e) {
    console.log(e);
  }
};
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
  return result.data;
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

  return result.data;
};

export async function getUsers() {
  const response = await api.get(`/users`);

  return response.data.data.users;
}

export async function getTasks() {
  const response = await api.get(`/tasks`);

  return response.data.data.tasks;
}

export async function getMyTasks() {
  const response = await api.get(`/tasks/me`);

  return response.data.data.tasks;
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
  return result.data;
}

export async function updateTask(task) {
  const result = await api.put("/tasks/" + task.id, task, {
    headers: {
      Authorization: `Bearer ${getRawTokenFromStorage()}`,
    },
  });
  return result.data;
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) return null;

  try {
    const res = await api.post("/api/auth/refresh-token", {
      refreshToken,
    });

    const newAccessToken = res.data.accessToken;

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }

    return newAccessToken;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
}

// export { refreshAccessToken };
// export default api;
