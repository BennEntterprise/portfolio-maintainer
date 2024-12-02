export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  updated_at: string | null;
  open_issues_count: number;
  stargazers_count: number;
  readme?: string;
  pulls_count?: number;
  private: boolean;
  size: number
  organization?: string;
  archived: boolean;
  active: boolean;
  hasTodo: boolean;
  license: string;
  hasDockerfile: boolean;
  hasDevcontainer: boolean;
}

export interface SortOption {
  label: string;
  value: 'pulls' | 'updated' | 'stars' | 'issues';
  direction: 'asc' | 'desc';
}