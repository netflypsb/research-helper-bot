import { generateWithOpenRouter } from './openrouter.ts';

export async function generateMethodology(
  description: string,
  openrouterKey: string
): Promise<string> {
  const systemPrompt = `You are a medical research methodology expert. Create a comprehensive methodology section for a research proposal following this structure:

1. Study Design (150 words):
- Type of study (e.g., RCT, cohort, case-control)
- Justification for chosen design
- Key methodological considerations

2. Population and Sampling (150 words):
- Target population description
- Inclusion/exclusion criteria
- Sample size calculation
- Sampling technique

3. Data Collection Methods (100 words):
- Primary and secondary outcomes
- Measurement tools and procedures
- Quality control measures

4. Statistical Analysis Plan (100 words):
- Statistical methods
- Handling of missing data
- Significance levels
- Software to be used`;

  return await generateWithOpenRouter(
    `Create a detailed methodology section for this research: ${description}`,
    systemPrompt,
    openrouterKey
  );
}