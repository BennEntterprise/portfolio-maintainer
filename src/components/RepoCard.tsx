import { 
  BookOpenCheck, 
  Copyright, 
  GitPullRequest, 
  Star,
  Container, 
  Clock, 
  ListTodo,
  MemoryStick, 
  Unplug,
} from 'lucide-react';
import { Repository } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { useMemo } from 'react';

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const readmeTooltipId = useMemo(() => `tooltip-BookOpenCheck-${repo.name}`, [repo.name]);
  const todoTooltipId = useMemo(() => `tooltip-ListTodo-${repo.name}`, [repo.name]);
  const licenseTooltipId = useMemo(() => `tooltip-Copyright-${repo.name}`, [repo.name]);
  const sizeTooltipId = useMemo(() => `tooltip-MemoryStick-${repo.name}`, [repo.name]);
  const dockerizedTooltipId = useMemo(() => `tooltip-Container-${repo.name}`, [repo.name]);
  const devcontainerTooltipId = useMemo(() => `tooltip-Unplug-${repo.name}`, [repo.name]);

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

      <div className="flex flex-row">
        <BookOpenCheck data-tooltip-id={readmeTooltipId} data-tooltip-content="README.md"/>
        <Tooltip id={readmeTooltipId} />
        <span className="px-2">{repo.readme ? "✅" : "❌"}</span>
      </div>

      <div className="flex flex-row">
        <ListTodo data-tooltip-id={todoTooltipId} data-tooltip-content="TODO.md"/>
        <Tooltip id={todoTooltipId} />
        <span className="px-2">{repo.hasTodo ? "✅" : "❌"}</span>
      </div>

      <div className="flex flex-row">
        <Copyright data-tooltip-id={licenseTooltipId} data-tooltip-content="License" />
        <Tooltip id={licenseTooltipId} />
        <span className="px-2">{repo.license !== 'None' ? '✅' : '❌'}</span>
      </div>


      <div className="flex flex-row">
        <MemoryStick data-tooltip-id={sizeTooltipId} data-tooltip-content="Size"/>
        <Tooltip id={sizeTooltipId} />
        <span className="px-2">{repo.size / 1000} KB </span>
      </div>

      <div className="flex flex-row">
        <Container data-tooltip-id={dockerizedTooltipId} data-tooltip-content="Dockerize with Dockerfile"/>
        <Tooltip id={dockerizedTooltipId} />
        <span className="px-2">{repo.hasDockerfile ? '✅' : '❌'}</span>
      </div>

      <div className="flex flex-row">
        <Unplug data-tooltip-id={devcontainerTooltipId} data-tooltip-content="Has .devcontainer"/>
        <Tooltip id={devcontainerTooltipId} />
        <span className="px-2">{repo.hasDevcontainer ? '✅' : '❌'}</span>
      </div>

      <div className="flex justify-end items-center text-sm text-gray-500">
        <Clock className="w-4 h-4 mr-1" />
        Last updated {repo.updated_at ? formatDistanceToNow(new Date(repo.updated_at)): '???'} ago
      </div>
    </div>
  );
}
