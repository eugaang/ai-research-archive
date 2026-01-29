export type Organization =
  | 'DeepSeek'
  | 'DeepMind'
  | 'Alibaba'
  | 'OpenAI'
  | 'Anthropic'
  | 'Meta';

export type Domain =
  | 'LLM'
  | 'Reasoning'
  | 'Vision'
  | 'Multimodal'
  | 'Robotics'
  | 'Agent'
  | 'RAG'
  | 'Science'
  | 'Healthcare'
  | 'Efficiency';

export interface Paper {
  id: string;
  title: string;
  titleKo?: string;
  organization: Organization;
  date: string; // YYYY-MM format
  arxivUrl?: string;
  githubUrl?: string;

  // 핵심 메타 정보
  summary: string;
  keyInnovation: string;
  practicalInsight: string;

  // 분류
  domains: Domain[];
  tags: string[];

  // 관계
  relatedPapers?: string[];
  buildUpon?: string[];
}
