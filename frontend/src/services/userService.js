const API_URL = "/api";

// Registrera en ny användare
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

// Logga in användaren
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

// Hämta information om den inloggade användaren
export async function getCurrentUser() {
  const response = await fetch("/api/users/me");

  if (response.status === 401) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte hämta användaren");
  }

  return data;
}

// Logga ut användaren
export async function logoutUser() {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    signal: AbortSignal.timeout(10000),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte logga ut");
  }

  return data;
}

// Hämta användarens provhistorik
export async function getUserResults() {
  const response = await fetch("/api/users/me/results");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte hämta provhistoriken");
  }

  return data;
}

// Hämta användarens övningsstatistik
export async function getExterciseStats() {
  const response = await fetch("/api/users/me/exercise-stats");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte hämta övningsstatistik");
  }

  return data;
}
