import { BookOpenCheck, Copyright, GitPullRequest, Star, Clock, ListTodo, MemoryStick, Eye, EyeOff } from 'lucide-react';
import { Repository } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const showMeta = false;
  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow min-h-48">
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

      {showMeta && <div>
        <div className="flex flex-row">
          <span><ListTodo  /></span><span className='px-2'>Has Todo.md</span>
        </div>
        <div className='flex flex-row'>
          <span><BookOpenCheck /></span><span className='px-2'>Has README.md</span>
        </div>
        <div className='flex flex-row'>
          <span><Copyright /></span><span className='px-2'>Has License</span>
        </div>
        <div className='flex flex-row'>
          <span><MemoryStick /></span><span className='px-2'>{(repo.size/1000)} KB </span>
        </div>
        <div className='flex flex-row'>
          <span><Eye /></span><span><EyeOff/></span><span className='px-2'>{(repo.size/1000)} KB </span>
        </div>
      </div>}
      
      <div className="flex justify-end items-center text-sm text-gray-500">
        <Clock className="w-4 h-4 mr-1" />
        Last updated {formatDistanceToNow(new Date(repo.updated_at))} ago
      </div>
    </div>
  );
}