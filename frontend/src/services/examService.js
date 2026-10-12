const API_URL = "/api";

export async function getExams() {
  const response = await fetch(`${API_URL}/exams`);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta prov: ${response.status}`);
  }

  return await response.json();
}

export async function getSubtests(examId) {
  const response = await fetch(`${API_URL}/exams/${examId}/subtests`);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta delprov: ${response.status}`);
  }
  return await response.json();
}
