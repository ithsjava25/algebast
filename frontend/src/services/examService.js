const API_URL = "/api";

// Hämta tillgängliga prov
export async function getExams() {
  const response = await fetch(`${API_URL}/exams`);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta prov: ${response.status}`);
  }

  return await response.json();
}
