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
  C: '#555555',
  Go: '#00ADD8',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Default: '#8b5cf6',
};

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch strictly real public repositories from GitHub REST API.
 * NO fallback or mock projects.
 */
export async function fetchUserRepositories(username = 'Chathuranga23603172') {
  const cacheKey = `gh_repos_real_${username.toLowerCase()}`;
  const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(cacheKey) : null;

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && Array.isArray(parsed.data)) {
        return {
          repos: parsed.data,
          totalCount: parsed.totalCount || parsed.data.length,
          fromCache: true,
          error: null,
        };
      }
    } catch {
      // cache read failed, continue to network fetch
    }
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        throw new Error('GitHub API rate limit reached. Please try again shortly.');
      } else if (response.status === 404) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format from GitHub API');
    }

    // Filter out the profile readme repo itself (named after username)
    const validRepos = data.filter(
      (r) => r.name.toLowerCase() !== username.toLowerCase()
    );

    // Strictly map actual repositories returned from the GitHub REST API
    const formattedRepos = validRepos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'Public GitHub repository.',
      html_url: repo.html_url,
      homepage: repo.homepage || '',
      language: repo.language || 'Code',
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      updated_at: repo.updated_at,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      isFork: repo.fork,
    }));

    // Cache valid response
    if (typeof localStorage !== 'undefined') {
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
        // localStorage may be disabled or quota exceeded
      }
    }

    return {
      repos: formattedRepos,
      totalCount: data.length,
      fromCache: false,
      error: null,
    };
  } catch (err) {
    console.warn('GitHub API fetch failed:', err.message);

    // Strictly return empty repos list with error message — NO MOCK OR FALLBACK DATA
    return {
      repos: [],
      totalCount: 0,
      fromCache: false,
      error: err.message,
    };
  }
}
