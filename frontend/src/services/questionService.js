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
