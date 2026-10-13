const API_URL = "/api";

export async function getQuestions(categories, count = 10) {
    const params = new URLSearchParams({
        categories: categories.join(","),
        count: count.toString(),
    });

    const response = await fetch(
        `${API_URL}/questions?${params}`
    );

    if (!response.ok) {
        throw new Error(`Kunde inte hämta frågor: ${response.status}`);
    }

    return await response.json();
}