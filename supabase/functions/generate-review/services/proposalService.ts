import { synthesizeLiteratureReview } from '../literatureReview.ts';
import { generateTitleAndObjectives } from '../titleAndObjectives.ts';
import { generateMethodology } from '../methodology.ts';
import { generateAbstract } from '../abstract.ts';
import { generateIntroduction } from '../introduction.ts';
import { generateEthicalConsiderations } from '../ethicalConsiderations.ts';
import { generateAndStoreReferences } from './referenceService.ts';
import { ApiKeys } from '../types.ts';

async function insertProposalComponent(
  supabaseClient: any,
  requestId: string,
  componentType: string,
  content: string
) {
  console.log(`Inserting ${componentType} component`);
  const { error } = await supabaseClient
    .from('research_proposal_components')
    .insert({
      research_request_id: requestId,
      component_type: componentType,
      content: content,
      status: 'completed'
    });

  if (error) {
    console.error(`Error inserting ${componentType}:`, error);
    throw error;
  }
  console.log(`Successfully inserted ${componentType}`);
}

export async function generateProposalComponents(
  description: string,
  searchResults: any[],
  requestId: string,
  apiKeys: ApiKeys,
  supabaseClient: any
) {
  try {
    console.log('Starting proposal component generation');

    // Generate literature review
    console.log('Generating literature review...');
    const literatureReview = await synthesizeLiteratureReview(
      searchResults,
      description,
      apiKeys.openrouterKey
    );
    await insertProposalComponent(supabaseClient, requestId, 'literature_review', literatureReview);

    // Generate references after literature review
    console.log('Generating references...');
    await generateAndStoreReferences(
      description,
      literatureReview,
      requestId,
      apiKeys,
      supabaseClient
    );

    // Generate title and objectives
    console.log('Generating title and objectives...');
    const titleAndObjectives = await generateTitleAndObjectives(
      description,
      literatureReview,
      apiKeys.openrouterKey
    );
    await insertProposalComponent(supabaseClient, requestId, 'title_and_objectives', titleAndObjectives);

    // Generate introduction
    console.log('Generating introduction...');
    const introduction = await generateIntroduction(
      description,
      literatureReview,
      titleAndObjectives,
      apiKeys.openrouterKey
    );
    await insertProposalComponent(supabaseClient, requestId, 'introduction', introduction);

    // Generate methodology
    console.log('Generating methodology...');
    const methodology = await generateMethodology(
      description,
      apiKeys.openrouterKey
    );
    await insertProposalComponent(supabaseClient, requestId, 'methodology', methodology);

    // Generate ethical considerations after methodology
    console.log('Generating ethical considerations...');
    const ethicalConsiderations = await generateEthicalConsiderations(
      description,
      methodology,
      apiKeys.openrouterKey
    );
    await insertProposalComponent(supabaseClient, requestId, 'ethical_considerations', ethicalConsiderations);

    // Generate abstract last
    console.log('Generating abstract...');
    const abstract = await generateAbstract(
      titleAndObjectives,
      literatureReview,
      apiKeys.openrouterKey
    );
    await insertProposalComponent(supabaseClient, requestId, 'abstract', abstract);

    console.log('Successfully generated all proposal components');
  } catch (error) {
    console.error('Error in generateProposalComponents:', error);
    throw error;
  }
}