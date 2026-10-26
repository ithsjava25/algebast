const API_URL = "/api";

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registrering misslyckades");
  }
  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Inloggning misslyckades");
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch("/api/users/me");

  if (response.status === 401) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Kunde inte hämta användaren"
    );
  }

  return data;
}

export async function logoutUser() {
  const response = await fetch("/api/users/logout", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Kunde inte logga ut"
    );
  }

  return data;
}

export async function getUserResults() {
  const response = await fetch("/api/users/me/results");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Kunde inte hämta provhistoriken"
    );
  }

  return data;
}