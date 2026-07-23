export function getErrorMessage(error, fallbackMessage = "Something went wrong.") {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.userMessage) {
    return error.userMessage;
  }

  if (error.response) {
    return getApiErrorMessage(error);
  }

  return error.message || fallbackMessage;
}

export function getApiErrorMessage(error) {
  const status = error.response?.status;
  const serverMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.detail;

  if (serverMessage) {
    return serverMessage;
  }

  if (status === 400) {
    return "Please check the details and try again.";
  }

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "We could not find the requested resource.";
  }

  if (status >= 500) {
    return "The server is having trouble right now. Please try again soon.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Unable to connect. Please check your internet connection.";
  }

  return "Something went wrong. Please try again.";
}
