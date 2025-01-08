import { callOpenRouter } from "./openrouter.ts";

export async function generateReferences(searchResults: any[], openrouterKey: string): Promise<string> {
  const prompt = `
Generate a properly formatted reference list using the following search results. Each reference should include:
1. Title
2. Authors (if available)
3. Publication/Source
4. URL
5. Year (if available)

Format each reference in a clear, consistent style. Here are the search results to use:

${JSON.stringify(searchResults, null, 2)}

Please generate a well-formatted reference list that a researcher could use in their paper.`;

  const response = await callOpenRouter(prompt, openrouterKey);
  return response;
}