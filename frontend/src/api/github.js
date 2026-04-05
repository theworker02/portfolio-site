import {
  featuredProjectIds,
  portfolioProfile,
  projectCatalog,
  projectCatalogByRepoName,
  projectCategoryMeta,
} from '../data/projects.ts';
import { SITE_CONFIG } from '../config/site.ts';

const configuredGitHubHandle = import.meta.env.VITE_GITHUB_HANDLE?.trim();
const GITHUB_HANDLE = configuredGitHubHandle || portfolioProfile.handle || SITE_CONFIG.username;
const USER_ENDPOINT = `https://api.github.com/users/${GITHUB_HANDLE}`;
const REPOSITORIES_ENDPOINT = `${USER_ENDPOINT}/repos?sort=updated&direction=desc&per_page=100&type=owner`;
const CACHE_TTL = 1000 * 60 * 10;
const USER_CACHE_KEY = `portfolio-user:${GITHUB_HANDLE}:v2`;
const REPOSITORY_CACHE_KEY = `portfolio-repositories:${GITHUB_HANDLE}`;

function slugifyProjectName(projectName) {
  return projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeHomepage(homepage) {
  if (!homepage) {
    return '';
  }

  const trimmedHomepage = homepage.trim();

  if (!trimmedHomepage) {
    return '';
  }

  if (trimmedHomepage.startsWith('http://') || trimmedHomepage.startsWith('https://')) {
    return trimmedHomepage;
  }

  return `https://${trimmedHomepage}`;
}

function readCachedValue(cacheKey, allowStale = false) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cachedValue = window.localStorage.getItem(cacheKey);

    if (!cachedValue) {
      return null;
    }

    const parsed = JSON.parse(cachedValue);
    const isFresh = Date.now() - parsed.timestamp < CACHE_TTL;

    if (isFresh || allowStale) {
      return parsed.data;
    }

    window.localStorage.removeItem(cacheKey);
    return null;
  } catch {
    return null;
  }
}

function writeCachedValue(cacheKey, data) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // Ignore storage failures and fall back to network-only behavior.
  }
}

function getKeywordStack(description) {
  const keywords = [
    ['react', 'React'],
    ['next.js', 'Next.js'],
    ['nextjs', 'Next.js'],
    ['express', 'Express'],
    ['socket', 'Socket.IO'],
    ['leaflet', 'Leaflet'],
    ['supabase', 'Supabase'],
    ['fastapi', 'FastAPI'],
    ['sqlite', 'SQLite'],
    ['postgres', 'PostgreSQL'],
    ['stripe', 'Stripe'],
    ['tauri', 'Tauri'],
    ['prisma', 'Prisma'],
    ['vite', 'Vite'],
    ['tailwind', 'Tailwind CSS'],
  ];

  const stack = [];
  const normalizedDescription = (description || '').toLowerCase();

  keywords.forEach(([keyword, label]) => {
    if (normalizedDescription.includes(keyword)) {
      stack.push(label);
    }
  });

  return stack;
}

function deriveTechStack(repository) {
  const stack = new Set();

  if (repository.language) {
    stack.add(repository.language);
  }

  getKeywordStack(repository.description).forEach((item) => stack.add(item));

  if (repository.homepage) {
    stack.add('Live deployment');
  }

  return Array.from(stack).slice(0, 6);
}

function deriveFeatures(repository) {
  const features = [];
  const normalizedDescription = (repository.description || '')
    .replace(/\|\|/g, '. ')
    .split('.')
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  normalizedDescription.forEach((sentence) => {
    if (features.length < 2) {
      features.push(sentence.replace(/^[a-z]/, (match) => match.toUpperCase()));
    }
  });

  if (repository.homepage) {
    features.push('Includes a public project page or live deployment link.');
  }

  if (repository.has_issues) {
    features.push('Public issue tracking is enabled for the repository.');
  }

  if (repository.language) {
    features.push(`${repository.language} is the primary implementation language.`);
  }

  return Array.from(new Set(features)).slice(0, 4);
}

function deriveCategory(repository, catalogEntry) {
  if (catalogEntry?.category) {
    return catalogEntry.category;
  }

  const description = (repository.description || '').toLowerCase();
  const techStack = deriveTechStack(repository).map((item) => item.toLowerCase());
  const toolingKeywords = ['language', 'interpreter', 'cli', 'runtime', 'tool', 'compiler'];
  const frontendKeywords = ['react', 'next.js', 'tailwind css', 'leaflet', 'vite', 'frontend', 'ui'];
  const backendKeywords = [
    'express',
    'fastapi',
    'postgresql',
    'supabase',
    'prisma',
    'socket.io',
    'node.js',
    'sqlite',
    'backend',
    'api',
  ];

  const hasTooling = toolingKeywords.some(
    (keyword) => description.includes(keyword) || techStack.some((item) => item.includes(keyword)),
  );

  if (hasTooling) {
    return 'Tooling';
  }

  const hasFrontend = frontendKeywords.some(
    (keyword) => description.includes(keyword) || techStack.some((item) => item.includes(keyword)),
  );
  const hasBackend = backendKeywords.some(
    (keyword) => description.includes(keyword) || techStack.some((item) => item.includes(keyword)),
  );

  if (hasFrontend && hasBackend) {
    return 'Full Stack';
  }

  if (hasBackend) {
    return 'Backend';
  }

  if (hasFrontend) {
    return 'Frontend';
  }

  return 'Frontend';
}

function deriveRole(repository) {
  const description = (repository.description || '').toLowerCase();

  if (description.includes('map') || description.includes('geospatial')) {
    return 'Mapping Product';
  }

  if (description.includes('backend') || description.includes('api')) {
    return 'Backend System';
  }

  if (description.includes('language') || description.includes('interpreter')) {
    return 'Developer Tooling';
  }

  if (description.includes('platform')) {
    return 'Product Platform';
  }

  return 'Open Source Build';
}

export function getCategoryMeta(category) {
  return projectCategoryMeta[category] || projectCategoryMeta['Full Stack'];
}

export function getTechCategory(label) {
  const normalizedLabel = label.toLowerCase();

  if (
    ['react', 'next.js', 'tailwind css', 'leaflet', 'vite', 'html', 'css'].some((keyword) =>
      normalizedLabel.includes(keyword),
    )
  ) {
    return 'Frontend';
  }

  if (
    [
      'express',
      'fastapi',
      'postgresql',
      'supabase',
      'prisma',
      'socket.io',
      'node.js',
      'sqlite',
      'serverless',
      'api',
      'python',
      'uvicorn',
    ].some((keyword) => normalizedLabel.includes(keyword))
  ) {
    return 'Backend';
  }

  if (
    ['cli', 'repl', 'runtime', 'analysis', 'rust', 'tooling', 'interpreter'].some((keyword) =>
      normalizedLabel.includes(keyword),
    )
  ) {
    return 'Tooling';
  }

  return 'Full Stack';
}

function buildDefaultStory(repository, category, role) {
  const language = repository.language || 'Multi-language';

  return [
    {
      title: 'Why it exists',
      body: `This repository is best read as a ${role.toLowerCase()} shaped around practical experimentation and public shipping instead of a one-off mockup.`,
    },
    {
      title: 'How it is built',
      body: `The implementation is anchored in ${language} with a ${category.toLowerCase()}-leaning structure that supports iteration, documentation, and future expansion.`,
    },
    {
      title: 'What it shows',
      body:
        'More than anything, it shows a consistent habit of turning rough ideas into repositories that have clearer purpose, better structure, and a stronger presentation layer over time.',
    },
  ];
}

function buildDefaultLocalSetup(repository, derivedTechStack) {
  const repoUrl = repository.html_url;
  const language = repository.language || '';
  const normalizedDescription = (repository.description || '').toLowerCase();

  if (
    language === 'Python' ||
    derivedTechStack.includes('FastAPI') ||
    normalizedDescription.includes('fastapi')
  ) {
    return {
      summary:
        'This project looks like a Python service. A virtual environment plus the bundled requirements file is the safest local path.',
      requirements: ['Python 3+', 'pip'],
      commands: [
        `git clone ${repoUrl}.git`,
        `cd ${repository.name}`,
        'python -m venv .venv',
        'source .venv/bin/activate  # Windows: .venv\\Scripts\\activate',
        'pip install -r requirements.txt',
        'uvicorn app.main:app --reload',
      ],
      notes: [
        'If the app entrypoint differs, check the repository README after installing dependencies.',
      ],
    };
  }

  if (language === 'HTML' || language === 'CSS') {
    return {
      summary:
        'This is best treated as a static web project. A simple local server will give you the cleanest preview experience.',
      requirements: ['A web browser', 'Python 3+ for a local static server'],
      commands: [
        `git clone ${repoUrl}.git`,
        `cd ${repository.name}`,
        'python -m http.server 4173',
      ],
      notes: ['You can also open `index.html` directly if the project is fully static.'],
    };
  }

  return {
    summary:
      'This repository appears to follow a Node-based workflow. Installing dependencies and starting the dev script is the fastest local route.',
    requirements: ['Node.js 18+', 'npm'],
    commands: [`git clone ${repoUrl}.git`, `cd ${repository.name}`, 'npm install', 'npm run dev'],
    notes: ['Check the repository README for any environment variables or service dependencies.'],
  };
}

function getDemoMode(demoUrl, catalogEntry) {
  if (!demoUrl) {
    return 'local';
  }

  if (typeof catalogEntry?.supportsEmbed === 'boolean') {
    return catalogEntry.supportsEmbed ? 'embed' : 'redirect';
  }

  return 'redirect';
}

function resolveCatalogEntry(repository) {
  const slug = slugifyProjectName(repository.name);
  return projectCatalog[slug] || projectCatalogByRepoName[repository.name] || null;
}

function mapRepository(repository) {
  const slug = slugifyProjectName(repository.name);
  const catalogEntry = resolveCatalogEntry(repository);
  const derivedTechStack = deriveTechStack(repository);
  const category = deriveCategory(repository, catalogEntry);
  const role = catalogEntry?.role || deriveRole(repository);
  const demoUrl =
    catalogEntry?.demoUrl || normalizeHomepage(repository.homepage) || '';
  const story = catalogEntry?.story || buildDefaultStory(repository, category, role);
  const images = catalogEntry?.images?.length
    ? catalogEntry.images
    : [
        {
          src: `https://opengraph.githubassets.com/1/${GITHUB_HANDLE}/${repository.name}`,
          alt: `${repository.name} GitHub repository preview`,
        },
      ];

  return {
    id: repository.id,
    slug,
    name: repository.name,
    title: catalogEntry?.title || repository.name,
    description:
      catalogEntry?.description ||
      repository.description?.trim() ||
      'Open-source project published on GitHub.',
    language: repository.language || 'Multi-language',
    stars: repository.stargazers_count,
    repoUrl: repository.html_url,
    homepageUrl: normalizeHomepage(repository.homepage),
    demoUrl,
    demoMode: getDemoMode(demoUrl, catalogEntry),
    supportsEmbed: getDemoMode(demoUrl, catalogEntry) === 'embed',
    updatedAt: repository.updated_at,
    createdAt: repository.created_at,
    fullDescription:
      catalogEntry?.fullDescription ||
      repository.description?.trim() ||
      'Open-source project published on GitHub.',
    features: catalogEntry?.features || deriveFeatures(repository),
    techStack: catalogEntry?.techStack || derivedTechStack,
    category,
    role,
    story,
    howItWorks: catalogEntry?.howItWorks || story,
    localSetup: catalogEntry?.localSetup || buildDefaultLocalSetup(repository, derivedTechStack),
    images,
    previewImages: images.map((image) => image.src),
    detailsPath: `/projects/${slug}`,
    demoPath: `/demo/${slug}`,
  };
}

async function getGitHubResponse(response) {
  if (response.ok) {
    return response.json();
  }

  let responseMessage = 'Unable to load GitHub data right now.';

  try {
    const errorBody = await response.json();

    if (errorBody?.message) {
      responseMessage = errorBody.message;
    }
  } catch {
    // Fall back to the default message.
  }

  if (response.status === 404) {
    responseMessage = `GitHub user "${GITHUB_HANDLE}" was not found.`;
  }

  if (response.status === 403) {
    responseMessage =
      'GitHub API rate limit reached. Try again shortly, or route requests through a server-side proxy later.';
  }

  throw new Error(responseMessage);
}

export async function fetchGitHubProfile(signal) {
  const cachedProfile = readCachedValue(USER_CACHE_KEY);

  if (cachedProfile) {
    return {
      ...cachedProfile,
      name: portfolioProfile.name,
      handle: GITHUB_HANDLE,
      githubUrl: portfolioProfile.githubUrl,
      repositoriesUrl: portfolioProfile.repositoriesUrl,
    };
  }

  try {
    const response = await fetch(USER_ENDPOINT, {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    const user = await getGitHubResponse(response);

    const liveProfile = {
      ...portfolioProfile,
      githubName: user.name || '',
      avatarUrl: user.avatar_url || portfolioProfile.avatarUrl,
      location: user.location || portfolioProfile.location,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      updatedAt: user.updated_at || '',
      createdAt: user.created_at || '',
    };

    writeCachedValue(USER_CACHE_KEY, liveProfile);
    return liveProfile;
  } catch (error) {
    const staleProfile = readCachedValue(USER_CACHE_KEY, true);

    if (staleProfile) {
      return staleProfile;
    }

    throw error;
  }
}

export async function fetchRepositories(signal) {
  const cachedRepositories = readCachedValue(REPOSITORY_CACHE_KEY);

  if (cachedRepositories) {
    return cachedRepositories;
  }

  try {
    const response = await fetch(REPOSITORIES_ENDPOINT, {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    const repositories = await getGitHubResponse(response);

    const mappedRepositories = repositories
      .filter(
        (repository) =>
          !repository.fork && !repository.archived && repository.name !== GITHUB_HANDLE,
      )
      .sort(
        (currentRepository, nextRepository) =>
          new Date(nextRepository.updated_at) - new Date(currentRepository.updated_at),
      )
      .map(mapRepository);

    writeCachedValue(REPOSITORY_CACHE_KEY, mappedRepositories);
    return mappedRepositories;
  } catch (error) {
    const staleRepositories = readCachedValue(REPOSITORY_CACHE_KEY, true);

    if (staleRepositories) {
      return staleRepositories;
    }

    throw error;
  }
}

export function getFeaturedProjects(repositories) {
  const selectedProjects = featuredProjectIds
    .map((projectId) => repositories.find((repository) => repository.slug === projectId))
    .filter(Boolean);

  if (selectedProjects.length >= 4) {
    return selectedProjects;
  }

  const fallbackProjects = repositories.filter(
    (repository) => !selectedProjects.some((project) => project.id === repository.id),
  );

  return [...selectedProjects, ...fallbackProjects].slice(0, 4);
}

export function sortRepositories(repositories, sortMode) {
  const repositoriesCopy = [...repositories];

  if (sortMode === 'stars') {
    return repositoriesCopy.sort((currentRepository, nextRepository) => {
      if (nextRepository.stars === currentRepository.stars) {
        return new Date(nextRepository.updatedAt) - new Date(currentRepository.updatedAt);
      }

      return nextRepository.stars - currentRepository.stars;
    });
  }

  return repositoriesCopy.sort(
    (currentRepository, nextRepository) =>
      new Date(nextRepository.updatedAt) - new Date(currentRepository.updatedAt),
  );
}

export function getProjectBySlug(repositories, slug) {
  return repositories.find((repository) => repository.slug === slug) || null;
}

export function getProjectPath(project) {
  return `/projects/${project.slug}`;
}

export function getProjectDemoPath(project) {
  return `/demo/${project.slug}`;
}

export { portfolioProfile };
