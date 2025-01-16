import { synthesizeLiteratureReview } from '../literatureReview.ts';
import { generateTitleAndObjectives } from '../titleAndObjectives.ts';
import { generateMethodology } from '../methodology.ts';
import { generateAbstract } from '../abstract.ts';
import { generateIntroduction } from '../introduction.ts';
import { ApiKeys } from '../types.ts';

export async function generateProposalComponents(
  description: string,
  searchResults: any[],
  requestId: string,
  apiKeys: ApiKeys,
  supabaseClient: any
) {
  // Generate literature review
  const literatureReview = await synthesizeLiteratureReview(
    searchResults,
    description,
    apiKeys.openrouterKey
  );

  await supabaseClient
    .from('research_proposal_components')
    .insert({
      research_request_id: requestId,
      component_type: 'literature_review',
      content: literatureReview,
      status: 'completed'
    });

  // Generate title and objectives
  const titleAndObjectives = await generateTitleAndObjectives(
    description,
    literatureReview,
    apiKeys.openrouterKey
  );

  await supabaseClient
    .from('research_proposal_components')
    .insert({
      research_request_id: requestId,
      component_type: 'title_and_objectives',
      content: titleAndObjectives,
      status: 'completed'
    });

  // Generate introduction
  const introduction = await generateIntroduction(
    description,
    literatureReview,
    titleAndObjectives,
    apiKeys.openrouterKey
  );

  await supabaseClient
    .from('research_proposal_components')
    .insert({
      research_request_id: requestId,
      component_type: 'introduction',
      content: introduction,
      status: 'completed'
    });

  // Generate methodology
  const methodology = await generateMethodology(
    description,
    apiKeys.openrouterKey
  );

  await supabaseClient
    .from('research_proposal_components')
    .insert({
      research_request_id: requestId,
      component_type: 'methodology',
      content: methodology,
      status: 'completed'
    });

  // Generate abstract
  const abstract = await generateAbstract(
    titleAndObjectives,
    literatureReview,
    apiKeys.openrouterKey
  );

  await supabaseClient
    .from('research_proposal_components')
    .insert({
      research_request_id: requestId,
      component_type: 'abstract',
      content: abstract,
      status: 'completed'
    });
}