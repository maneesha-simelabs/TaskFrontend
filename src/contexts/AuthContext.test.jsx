import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthProvider } from "../contexts/AuthContext";
import useAuth from "../hooks/useAuth";

import { userLogin } from "../services/axios";

jest.mock("../services/axios");

jest.mock("../utils/token", () => ({
  setStoredAuthValue: jest.fn(),
  clearStoredAuthValues: jest.fn(),
  getRawTokenFromStorage: jest.fn(() => null),
  getRefreshTokenFromStorage: jest.fn(),
  isTokenExpired: jest.fn(() => false),
}));

userLogin.mockResolvedValue({
  data: {
    accessToken: "abc123",
    refreshToken: "xyz456",
    user: {
      name: "Maneesha",
      role: "Admin",
    },
  },
});

test("initial user is null", async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });

  await waitFor(() => {
    expect(result.current.authReady).toBe(true);
  });

  expect(result.current.user).toBeNull();
});

test("login updates user", async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });

  await act(async () => {
    await result.current.login({
      email: "abc@gmail.com",
      password: "123456",
      rememberMe: false,
    });
  });

  await waitFor(() => {
    expect(result.current.user).toEqual({
      name: "Maneesha",
      role: "Admin",
    });
  });
});

test("logout clears user", async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });

  userLogin.mockResolvedValue({
    data: {
      accessToken: "abc",
      refreshToken: "xyz",
      user: {
        name: "Maneesha",
      },
    },
  });

  await act(async () => {
    await result.current.login({
      email: "abc@gmail.com",
      password: "123456",
    });
  });

  act(() => {
    result.current.logout();
  });

  expect(result.current.user).toBeNull();
});
