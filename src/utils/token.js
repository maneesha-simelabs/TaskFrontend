export function getRawTokenFromStorage() {
  const raw = localStorage.getItem("accessToken");

  if (!raw) return null;

  try {
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      return parsed?.token || parsed?.accessToken || null;
    }
  } catch (e) {}

  return raw;
}

export function isTokenExpired(tokenOrStored) {
  const token = tokenOrStored || getRawTokenFromStorage();

  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
}
