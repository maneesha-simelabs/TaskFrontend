function readStoredValue(key) {
  const sessionValue = sessionStorage.getItem(key);
  if (sessionValue) return sessionValue;

  return localStorage.getItem(key);
}

function normalizeStoredToken(raw) {
  if (!raw) return null;

  try {
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      return parsed?.token || parsed?.accessToken || null;
    }
  } catch {}

  return raw;
}

export function getRawTokenFromStorage() {
  return normalizeStoredToken(readStoredValue("accessToken"));
}

export function getRefreshTokenFromStorage() {
  return normalizeStoredToken(readStoredValue("refreshToken"));
}

export function setStoredAuthValue(key, value, rememberMe) {
  if (rememberMe) {
    localStorage.setItem(key, value);
    sessionStorage.removeItem(key);
    return;
  }

  sessionStorage.setItem(key, value);
  localStorage.removeItem(key);
}

export function clearStoredAuthValues() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("taskmanagement_user");
  localStorage.removeItem("rememberMe");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("taskmanagement_user");
}

export function isTokenExpired(tokenOrStored) {
  const token = tokenOrStored || getRawTokenFromStorage();

  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
