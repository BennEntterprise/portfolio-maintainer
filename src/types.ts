export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  updated_at: string | null;
  open_issues_count: number;
  stargazers_count: number;
  readme?: string; // This represents the README content, which we can use in as search targets in the search bar
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
  hasReadme: boolean;
}

export interface SortOption {
  label: string;
  value: 'alphabetical' | 'pulls' | 'updated' | 'stars' | 'issues';
  direction: 'asc' | 'desc';
}