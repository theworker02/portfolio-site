import { startTransition, useEffect, useState } from 'react';
import { fetchGitHubProfile, fetchRepositories, getFeaturedProjects, portfolioProfile } from '../api/github';

const initialState = {
  profile: portfolioProfile,
  repositories: [],
  featuredProjects: [],
  stats: {
    repoCount: 0,
    languageCount: 0,
    latestUpdate: '',
    totalStars: 0,
  },
  status: 'loading',
  error: '',
};

function getStats(repositories, profile) {
  const languages = new Set(
    repositories.map((repository) => repository.language).filter(Boolean),
  );

  return {
    repoCount: repositories.length || profile.publicRepos || 0,
    languageCount: languages.size,
    latestUpdate: repositories[0]?.updatedAt || profile.updatedAt || '',
    totalStars: repositories.reduce((total, repository) => total + repository.stars, 0),
  };
}

export function usePortfolioData() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    Promise.all([
      fetchGitHubProfile(controller.signal),
      fetchRepositories(controller.signal),
    ])
      .then(([profile, repositories]) => {
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setState({
            profile,
            repositories,
            featuredProjects: getFeaturedProjects(repositories),
            stats: getStats(repositories, profile),
            status: 'success',
            error: '',
          });
        });
      })
      .catch((error) => {
        if (!isMounted || controller.signal.aborted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          status: 'error',
          error: error.message,
        }));
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return state;
}

