import { generateWithOpenRouter } from './openrouter.ts';

export async function generateEthicalConsiderations(
  description: string,
  methodology: string,
  openrouterKey: string
): Promise<string> {
  console.log('Generating ethical considerations for description:', description.substring(0, 100) + '...');

  const systemPrompt = `You are a medical research ethics expert. Create a detailed ethical considerations section following this structure:

1. Ethical Approval (100-150 words):
- Specify ethics committee details
- Outline approval process and status

2. Informed Consent Process (150-200 words):
- Detail consent obtaining process
- Describe documentation methods
- Address language and accessibility

3. Confidentiality Measures (100-150 words):
- Explain data protection methods
- Detail storage and access protocols

4. Risk Mitigation (100-150 words):
- Identify potential risks
- Outline mitigation strategies

5. Participant Rights (100-150 words):
- Detail withdrawal process
- Explain compensation (if any)
- Address grievance procedures

6. Special Considerations (if applicable):
- Address vulnerable populations
- Note cultural sensitivities
- Highlight specific ethical challenges`;

  try {
    const content = await generateWithOpenRouter(
      `Create a comprehensive ethical considerations section for this research: ${description}\n\nMethodology context: ${methodology}`,
      systemPrompt,
      openrouterKey
    );
    
    console.log('Successfully generated ethical considerations section');
    return content;
  } catch (error) {
    console.error('Error generating ethical considerations:', error);
    throw new Error(`Failed to generate ethical considerations: ${error.message}`);
  }
}