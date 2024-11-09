export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  updated_at: string;
  open_issues_count: number;
  stargazers_count: number;
  readme?: string;
  pulls_count?: number;
}

export interface SortOption {
  label: string;
  value: 'pulls' | 'updated' | 'stars';
  direction: 'asc' | 'desc';
}