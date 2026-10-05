import { fallbackProjects } from '../data/portfolioData';

export const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  'C#': '#178600',
  Go: '#00ADD8',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Default: '#8b5cf6',
};

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function fetchUserRepositories(username = 'Chathuranga23603172') {
  const cacheKey = `gh_repos_${username.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && parsed.data?.length > 0) {
        return {
          repos: parsed.data,
          totalCount: parsed.totalCount || parsed.data.length,
          fromCache: true,
          error: null,
        };
      }
    } catch {
      // cache read failed, continue to network
    }
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error('GitHub API rate limit reached. Displaying featured repositories.');
      } else if (response.status === 404) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format from GitHub API');
    }

    // Filter out forks if plenty, prioritize repos with descriptions or code
    const ownRepos = data.filter((r) => !r.fork);
    const candidateRepos = ownRepos.length >= 4 ? ownRepos : data;

    // Filter out the profile readme repository itself (named after username)
    const validRepos = candidateRepos.filter(
      (r) => r.name.toLowerCase() !== username.toLowerCase()
    );

    // Format and clean repos
    const formattedRepos = validRepos.slice(0, 6).map((repo) => {
      // Match with fallback details if description is missing
      const fallback = fallbackProjects.find((f) => f.name.toLowerCase() === repo.name.toLowerCase());

      return {
        id: repo.id,
        name: repo.name,
        description:
          repo.description ||
          fallback?.description ||
          `Open source software repository by ${username}. Built with ${repo.language || 'modern technologies'}.`,
        html_url: repo.html_url,
        homepage: repo.homepage || fallback?.homepage || '',
        language: repo.language || fallback?.language || 'JavaScript',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics && repo.topics.length > 0 ? repo.topics : fallback?.topics || ['software-engineering', 'full-stack'],
        isFork: repo.fork,
      };
    });

    // Save to cache
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: formattedRepos,
          totalCount: data.length,
          timestamp: Date.now(),
        })
      );
    } catch {
      // localStorage may be disabled or full
    }

    return {
      repos: formattedRepos,
      totalCount: data.length,
      fromCache: false,
      error: null,
    };
  } catch (err) {
    console.warn('GitHub API fetch failed or rate limited:', err.message);

    // If username is the owner, return the rich fallback projects
    if (username.toLowerCase() === 'chathuranga23603172') {
      return {
        repos: fallbackProjects,
        totalCount: 16,
        fromCache: false,
        error: err.message,
      };
    }

    return {
      repos: [],
      totalCount: 0,
      fromCache: false,
      error: err.message,
    };
  }
}
