"use client";

const TOKEN_KEY = "accessToken";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  window.sessionStorage.removeItem(TOKEN_KEY);
}
