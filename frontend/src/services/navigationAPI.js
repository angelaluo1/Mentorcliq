import axios from "axios";

export async function requestNavigationGuidance(question) {
  const response = await axios.post("/api/navigate", { question });
  return response.data;
}
