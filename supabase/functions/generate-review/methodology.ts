import { generateWithOpenRouter } from './openrouter.ts';

export async function generateMethodology(
  description: string,
  openrouterKey: string
): Promise<string> {
  console.log('Generating methodology for description:', description.substring(0, 100) + '...');

  const systemPrompt = `You are a medical research methodology expert. Create a detailed methodology section following this structure:

1. Study Design (150-200 words):
- Specify and justify the type of study
- Explain the rationale for chosen design
- Outline key methodological considerations

2. Population and Sampling (200-250 words):
- Define target population characteristics
- Detail inclusion/exclusion criteria
- Explain sampling technique
- Provide sample size calculation/justification

3. Data Collection Methods (150-200 words):
- List all variables to be measured
- Describe measurement tools/instruments
- Explain data collection procedures
- Address quality control measures

4. Statistical Analysis Plan (150-200 words):
- Specify statistical methods for each objective
- Describe data handling procedures
- Define significance levels
- Name statistical software to be used

5. Ethical Considerations (100-150 words):
- Address potential ethical issues
- Mention required approvals/permissions
- Discuss participant privacy/confidentiality`;

  try {
    const content = await generateWithOpenRouter(
      `Create a comprehensive methodology section for this research: ${description}`,
      systemPrompt,
      openrouterKey
    );
    
    console.log('Successfully generated methodology section');
    return content;
  } catch (error) {
    console.error('Error generating methodology:', error);
    throw new Error(`Failed to generate methodology: ${error.message}`);
  }
}