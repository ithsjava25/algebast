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

// Uppdatera användarens profil (användarnamn, förnamn, efternamn, e-post)
export async function updateUser(userData) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte uppdatera profilen.");
  }

  return data;
}

// Uppdatera användarens lösenord
export async function changePassword(passwordData) {
  const response = await fetch(`${API_URL}/users/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte byta lösenord.");
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

// Hämtar användarens övningshistorik för en kategori
export async function getExerciseHistory(category) {
  const response = await fetch(
    `/api/users/me/exercise-history/${encodeURIComponent(category)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta övningshistoriken");
  }

  return await response.json();
}

// Hämta användarens pokaler
export async function getUserBadges() {
  const response = await fetch("/api/badges");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte hämta användarens badges");
  }

  return data;
}

// Hämta detaljerat provresultat för granskning
export async function getUserResultDetail(attemptId) {
  const response = await fetch(`${API_URL}/users/me/results/${attemptId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte hämta provdetaljer");
  }

  return data;
}

// Radera användarens konto
export async function deleteAccount(password) {
  const response = await fetch("/api/users/me", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Kunde inte radera kontot");
  }

  return data;
}
