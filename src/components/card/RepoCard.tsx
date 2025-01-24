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
  EyeIcon,
  EyeOff,
  Archive,
  CircleDot,
  ShieldQuestion,
  AlarmClockOff,
} from 'lucide-react';
import { Repository } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { TooltipIcon } from './ToolTipIcon';
import { useDispatch } from 'react-redux';
import { addExcludedRepo } from '../../redux/settingsSlice';

export interface RepoCardProps {
  repo: Repository;
}

const iconConfig = {
  hasReadme: true,
  hasTodo: true,
  license: true,
  hasDockerfile: true,
  hasDevcontainer: true,
  size: true,
  pulls_count: true,
  stargazers_count: true,
  open_issues_count: true,
  private: true,
  archived: true,
};

export function RepoCard({ repo }: RepoCardProps) {
  const dispatch = useDispatch();
  const readmeTooltipId = useMemo(() => `tooltip-BookOpenCheck-${repo.name}`, [repo]);
  const todoTooltipId = useMemo(() => `tooltip-ListTodo-${repo.name}`, [repo]);
  const licenseTooltipId = useMemo(() => `tooltip-Copyright-${repo.name}`, [repo]);
  const sizeTooltipId = useMemo(() => `tooltip-MemoryStick-${repo.name}`, [repo]);
  const dockerizedTooltipId = useMemo(() => `tooltip-Container-${repo.name}`, [repo]);
  const devcontainerTooltipId = useMemo(() => `tooltip-Unplug-${repo.name}`, [repo]);
  const privateRepoTooltipId = useMemo(() => `tooltip-EyeOff-${repo.name}`, [repo]);
  const publicRepoTooltipId = useMemo(() => `tooltip-EyeIcon-${repo.name}`, [repo]);
  const archivedRepoTooltipId = useMemo(() => `tooltip-Archive-${repo.name}`, [repo]);
  const gitPullRequestTooltipId = useMemo(() => `tooltip-GitPullRequest-${repo.name}`, [repo]);
  const starGazerTooltipId = useMemo(() => `tooltip-Star-${repo.name}`, [repo]);
  const issueCountTooltipId = useMemo(() => `tooltip-CircleDot-${repo.name}`, [repo]);
  const AlarmClockOffTooltipId = useMemo(() => `tooltip-AlarmClockOff-${repo.name}`, [repo]);

  const handleSnooze = useCallback(() => {
    dispatch(addExcludedRepo(repo.name))
  }, [dispatch, repo.name])

  return (
    <div
      className="flex flex-col justify-between h-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow min-h-48"
      style={{ backgroundColor: "var(--component-bg-color)"}}
    >
      <div className="flex justify-between items-center mb-4">
        {iconConfig.archived && repo.archived && (
          <TooltipIcon
            id={archivedRepoTooltipId}
            content="This repo is archived"
            icon={<Archive height="1em" />}
          />
        )}

        <h2 className="font-semibold text-blue-600 hover:text-blue-800 flex justify-start">
          <TooltipIcon
            id={AlarmClockOffTooltipId}
            content="Last updated"
            icon={<AlarmClockOff className="w-4 h-4 mr-1" onClick={handleSnooze} />}
            />
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h2>

        <div className="flex items-center space-x-4 text-gray-600">
          {iconConfig.pulls_count && (
            <span className="flex items-center">
              <TooltipIcon
                id={gitPullRequestTooltipId}
                content={`${repo.pulls_count || 0} Pull Requests`}
                icon={<GitPullRequest className="w-4 h-4 mr-1" />}
              />
              {repo.pulls_count || 0}
            </span>
          )}

          {iconConfig.stargazers_count && (
            <span className="flex items-center">
              <TooltipIcon
                id={starGazerTooltipId}
                content={`${repo.stargazers_count} Stars`}
                icon={<Star className="w-4 h-4 mr-1" />}
              />
              {repo.stargazers_count}
            </span>
          )}

          {iconConfig.open_issues_count && (
            <span className="flex items-center">
              <TooltipIcon
                id={issueCountTooltipId}
                content={`${repo.open_issues_count} Open Issues`}
                icon={<CircleDot className="w-4 h-4 mr-1" />}
              />
              {repo.open_issues_count}
            </span>
          )}

          {iconConfig.private && repo.private ? (
            <TooltipIcon
              id={privateRepoTooltipId}
              content="This repo is private"
              icon={<EyeOff height="1em" />}
            />
          ) : (
            <TooltipIcon
              id={publicRepoTooltipId}
              content="This repo is public"
              icon={<EyeIcon height="1em" />}
            />
          )}
        </div>
      </div>

      {repo.description && (
        <p className="text-gray-600 mb-4">{repo.description}</p>
      )}

      {iconConfig.hasReadme && (
        <div className="flex flex-row">
          <TooltipIcon
            id={readmeTooltipId}
            content="README.md"
            icon={<BookOpenCheck />}
          />
          <span className="px-2">{repo.hasReadme ? "✅" : "❌"}</span>
        </div>
      )}

      {iconConfig.hasTodo && (
        <div className="flex flex-row">
          <TooltipIcon
            id={todoTooltipId}
            content="TODO.md"
            icon={<ListTodo />}
          />
          <span className="px-2">{repo.hasTodo ? "✅" : "❌"}</span>
        </div>
      )}

      {iconConfig.license && (
        <div className="flex flex-row">
          <TooltipIcon
            id={licenseTooltipId}
            content="License"
            icon={<Copyright />}
          />
          <span className="px-2">{repo.license !== "None" ? "✅" : "❌"}</span>
        </div>
      )}

      {iconConfig.hasDockerfile && (
        <div className="flex flex-row">
          <TooltipIcon
            id={dockerizedTooltipId}
            content="Dockerize with Dockerfile"
            icon={<Container />}
          />
          <span className="px-2">{repo.hasDockerfile ? "✅" : <ShieldQuestion />}</span>
        </div>
      )}

      {iconConfig.hasDevcontainer && (
        <div className="flex flex-row">
          <TooltipIcon
            id={devcontainerTooltipId}
            content="Has .devcontainer"
            icon={<Unplug />}
          />
          <span className="px-2">{repo.hasDevcontainer ? "✅" : <ShieldQuestion />}</span>
        </div>
      )}

      {iconConfig.size && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex flex-row">
            <TooltipIcon
              id={sizeTooltipId}
              content="Size"
              icon={<MemoryStick />}
            />
            <span className="px-2">{repo.size / 1000} KB </span>
          </div>
          <div className="flex items-center justify-end">
            <Clock className="w-4 h-4 mr-1" />
            <span>Last updated{" "}
              {repo.updated_at
                ? formatDistanceToNow(new Date(repo.updated_at))
                : "???"}{" "}
              ago</span>
          </div>
        </div>
      )}
    </div>
  );
}
