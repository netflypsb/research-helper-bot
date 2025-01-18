export type ProposalComponentType = 
  | 'title_and_objectives'
  | 'abstract'
  | 'introduction'
  | 'literature_review'
  | 'methodology'
  | 'ethical_considerations'
  | 'references';

export interface ProposalComponent {
  id: string;
  component_type: ProposalComponentType;
  content: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  reference_data?: any; // Adding this field for references
}