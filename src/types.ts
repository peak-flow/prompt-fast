export type View = 'editor' | 'library' | 'dashboard';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  tags: string[];
  likes: number;
  dislikes: number;
  rating: number;
  updatedAt: string;
}

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'PRMPT_082',
    title: 'Learn {{topic}} fast',
    description: 'Generates a comprehensive structured learning path for any technical subject. Optimized for Claude 3.5 Sonnet logic processing.',
    body: '// System Instruction\n\nAct as an elite technical educator. Your goal is to simplify {{topic}} using the Feynman technique.\n\nBreak down complex mental models into a hierarchy of atomic units. After the explanation, provide a concrete implementation using the {{framework}} framework.\n\nEnsure the tone is {{tone}} and focus heavily on edge cases. If {{difficulty}} is set to \'expert\', omit introductory definitions.',
    category: 'Education',
    tags: ['learning', 'feynman', 'structured'],
    likes: 1204,
    dislikes: 12,
    rating: 4.5,
    updatedAt: '2h ago',
  },
  {
    id: 'PRMPT_144',
    title: 'Refactor SQL {{query}}',
    description: 'Converts legacy SQL queries into optimized PostgreSQL syntax with proper indexing suggestions and performance analysis.',
    body: '// System Instruction\n\nAnalyze the provided SQL query: {{query}}.\n\nIdentify performance bottlenecks and refactor for PostgreSQL 16 standards. Focus on CTE readability and index utilization.',
    category: 'Database',
    tags: ['sql', 'postgres', 'optimization'],
    likes: 843,
    dislikes: 2,
    rating: 5,
    updatedAt: '1d ago',
  },
  {
    id: 'PRMPT_009',
    title: 'Tailwind UI Generator',
    description: 'Generate clean, semantic HTML with Tailwind CSS v3 utility classes based on high-level UI descriptions or wireframe text.',
    body: '// System Instruction\n\nGenerate a responsive UI component based on: {{description}}.\n\nUse semantic HTML5 and Tailwind CSS utility classes. Ensure accessibility (ARIA) and dark mode support.',
    category: 'Frontend',
    tags: ['tailwind', 'ui', 'react'],
    likes: 5112,
    dislikes: 128,
    rating: 4,
    updatedAt: '3d ago',
  }
];
