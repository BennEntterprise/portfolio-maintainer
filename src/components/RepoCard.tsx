import React from 'react';
import { GitPullRequest, Star, Clock } from 'lucide-react';
import { Repository } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <div className="flex items-center space-x-4 text-gray-600">
          <span className="flex items-center">
            <GitPullRequest className="w-4 h-4 mr-1" />
            {repo.pulls_count || 0}
          </span>
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {repo.stargazers_count}
          </span>
        </div>
      </div>
      
      {repo.description && (
        <p className="text-gray-600 mb-4">{repo.description}</p>
      )}
      
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="w-4 h-4 mr-1" />
        Last updated {formatDistanceToNow(new Date(repo.updated_at))} ago
      </div>
    </div>
  );
}