import { Github, Loader } from "lucide-react"
import { useGitHub } from "../hooks/useGitHub"

export const AppHeader = () => {
  const { loading, fetchRepos } = useGitHub();
  
  return (
    <header className="flex items-center justify-between mb-8 w-full">
      <div className="flex items-center justify-between w-full">
        <Github className="w-8 h-8 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">GitHub Explorer</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 flex flex-row items-center justify-center"
          onClick={fetchRepos}
        >
          <span>Fetch Repos</span>
          <span>
            {loading && (
              <Loader
                color="#fff"
                className="w-4 h-4 animate-spin text-blue-500 ml-2"
              />
            )}
          </span>
        </button>
      </div>
    </header>
  );
}