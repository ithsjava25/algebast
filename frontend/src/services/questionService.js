const API_URL = "/api";

// Hämta frågorna från ett valt prov
export async function getQuestionsByExam(examId) {
  const response = await fetch(`${API_URL}/exams/${examId}/questions`);

  if (!response.ok) {
    throw new Error(
      `Kunde inte hämta frågor för prov ${examId}: ${response.status}`,
    );
  }

  return await response.json();
}

// Hämta ett slumpmässigt urval av frågor från en eller flera valda kategorier
export async function getRandomQuestionsByCategories(categories, count = 10) {
  const params = new URLSearchParams({
    categories: categories.join(","),
    count: count.toString(),
  });

  const response = await fetch(`${API_URL}/questions?${params}`);

  if (!response.ok) {
    throw new Error(`Kunde inte hämta frågor: ${response.status}`);
  }

  return await response.json();
}

export async function turnInAnswers(answers, { examId, timeSpentSeconds } = {}) {
  const body = { answers };
  if (examId !== undefined) {
    body.examId = examId;
    body.timeSpentSeconds = timeSpentSeconds ?? null;
  }

  const response = await fetch("/api/questions/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Kunde inte skicka in svaren");
  }
  return data;
}
