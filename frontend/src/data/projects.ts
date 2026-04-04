import { SITE_CONFIG } from '../../../config/site.ts';

const configuredGitHubHandle = import.meta.env.VITE_GITHUB_HANDLE?.trim();
const GITHUB_HANDLE = configuredGitHubHandle || SITE_CONFIG.username;

function githubPreview(repoName) {
  return `https://opengraph.githubassets.com/1/${GITHUB_HANDLE}/${repoName}`;
}

export const portfolioProfile = {
  handle: GITHUB_HANDLE,
  name: SITE_CONFIG.username,
  title: 'Developer / Product-minded Engineer',
  location: 'United States',
  avatarUrl: `https://github.com/${GITHUB_HANDLE}.png`,
  githubUrl:
    GITHUB_HANDLE === SITE_CONFIG.username ? SITE_CONFIG.github : `https://github.com/${GITHUB_HANDLE}`,
  repositoriesUrl: `https://github.com/${GITHUB_HANDLE}?tab=repositories`,
  tagline:
    'Building polished tools, map-first products, and experimental platforms one release at a time.',
  summary:
    `${SITE_CONFIG.username} builds product-style software with a focus on strong interfaces, practical backend systems, and ambitious side projects that keep expanding in scope.`,
  heroIntro:
    'From geospatial dashboards to custom language runtimes, the work here is shaped around shipping ideas that feel real, useful, and ready for the public web.',
  availability: 'Available for product-focused frontend, full-stack, and developer tooling work.',
  about: [
    `I am ${SITE_CONFIG.username}, a developer based in the United States building out a serious public portfolio by shipping full products instead of one-off visuals.`,
    'Recent work spans geospatial intelligence, parking systems, emergency dispatch tooling, knowledge platforms, and language design experiments.',
    'The throughline is simple: take rough concepts and turn them into software that feels structured, interactive, and ready for the real world.',
  ],
  interests: [
    'Product-style frontend systems',
    'Realtime and map-driven interfaces',
    'Developer tooling and language experiments',
  ],
  skillGroups: [
    {
      title: 'Frontend',
      summary: 'UI systems shaped around responsiveness, product polish, and data-heavy interfaces.',
      items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Leaflet', 'Vite'],
    },
    {
      title: 'Backend',
      summary: 'APIs and data layers for live products, operational tools, and experimentation.',
      items: ['Node.js', 'Express', 'FastAPI', 'Socket.IO', 'Prisma', 'Supabase'],
    },
    {
      title: 'Tools',
      summary: 'Infrastructure and workflow choices that keep projects shippable.',
      items: ['GitHub', 'PostgreSQL', 'SQLite', 'Stripe', 'Tauri', 'REST APIs'],
    },
    {
      title: 'Languages',
      summary: 'Languages currently showing up across production work and learning projects.',
      items: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'HTML', 'CSS'],
    },
  ],
};

export const featuredProjectIds = [
  'magnificent-language',
  'abandonment-scanner',
  'mini-wiki',
  'spotiq',
];

export const projectCategoryMeta = {
  Frontend: {
    color: '#2997FF',
    soft: 'rgba(41,151,255,0.14)',
    border: 'rgba(41,151,255,0.3)',
    glow: 'rgba(41,151,255,0.2)',
  },
  Backend: {
    color: '#8B5CF6',
    soft: 'rgba(139,92,246,0.14)',
    border: 'rgba(139,92,246,0.3)',
    glow: 'rgba(139,92,246,0.2)',
  },
  'Full Stack': {
    color: '#38BDF8',
    soft: 'rgba(56,189,248,0.14)',
    border: 'rgba(56,189,248,0.3)',
    glow: 'rgba(56,189,248,0.2)',
  },
  Tooling: {
    color: '#F59E0B',
    soft: 'rgba(245,158,11,0.14)',
    border: 'rgba(245,158,11,0.3)',
    glow: 'rgba(245,158,11,0.2)',
  },
};

export const projectDefinitions = [
  {
    id: 'magnificent-language',
    repoName: 'magnificent-language',
    title: 'Magnificent Language',
    category: 'Tooling',
    role: 'Language Platform',
    description:
      'Typed programming language platform with a parser, interpreter, REPL, runtime analysis, and CLI workflows.',
    fullDescription:
      'Magnificent Language is a typed programming platform designed to feel structured like a systems language while staying approachable in day-to-day development. It includes a lexer, parser, interpreter, predictive execution tooling, runtime inspection, and command-line workflows that make it feel much closer to a real language product than a simple parser experiment.',
    techStack: ['JavaScript', 'CLI tooling', 'REPL', 'Runtime analysis', 'Rust interop'],
    features: [
      'Ships a lexer, AST parser, interpreter, and import-capable runtime.',
      'Supports predictive execution for outputs, branches, and memory behavior before runtime.',
      'Exposes developer-focused commands for analysis, testing, serving APIs, and diagnostics.',
      'Includes Rust interoperability and Linux or Unity-oriented build paths.',
    ],
    story: [
      {
        title: 'Language pipeline',
        body:
          'The project is built around a real parse-and-execute pipeline, giving the repo a product-like foundation instead of a one-file interpreter demo.',
      },
      {
        title: 'Developer workflow',
        body:
          'A REPL, CLI commands, and runtime inspection features make the language easier to explore without losing the sense of structure.',
      },
      {
        title: 'What it proves',
        body:
          'It shows how much quality in developer tooling comes from clarity of output, command ergonomics, and a system that invites experimentation.',
      },
    ],
    howItWorks: [
      {
        title: 'Parse input',
        body:
          'Source code is tokenized and transformed into an AST so the language can reason about structure before execution.',
      },
      {
        title: 'Execute and inspect',
        body:
          'The runtime can evaluate scripts, expose a REPL, and surface diagnostics that make language behavior easier to understand.',
      },
      {
        title: 'Extend with tooling',
        body:
          'Command-line workflows and analysis modes turn the repository into a real developer platform instead of a bare interpreter.',
      },
    ],
    images: [
      {
        src: githubPreview('magnificent-language'),
        alt: 'Magnificent Language GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a Node-based CLI tool with REPL and script execution support. This is the fastest route for exploring the language locally.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/magnificent-language.git`,
        'cd magnificent-language',
        'npm install',
        'npm run repl',
      ],
      notes: [
        'Use `npm start` to view the main CLI entrypoint.',
        'Use `npm test` for the smoke-test workflow included in the repository.',
      ],
    },
  },
  {
    id: 'find-the-bug',
    repoName: 'find-the-bug',
    title: 'Find the Bug',
    category: 'Full Stack',
    role: 'Security Training Platform',
    description:
      'Local-only security training platform with separate frontend and backend workspaces.',
    fullDescription:
      'Find the Bug is a controlled training platform for exploring vulnerable patterns, remediation flows, and safe security education in a local-only environment. It is structured like a real learning product instead of a throwaway challenge page.',
    techStack: ['JavaScript', 'React', 'Node.js', 'Express', 'Security labs'],
    features: [
      'Structured labs covering common vulnerability classes in a contained sandbox.',
      'Guided challenge mode, analysis mode, and remediation-oriented fix mode.',
      'Separate frontend and backend workspaces for a more realistic application shape.',
      'Explicit safety boundaries designed for local training only.',
    ],
    story: [
      {
        title: 'Controlled environment',
        body:
          'The project intentionally stays local-first so the learning experience remains useful without becoming unsafe.',
      },
      {
        title: 'Real app shape',
        body:
          'Splitting frontend and backend workspaces gives the labs a more realistic surface than a single-page playground.',
      },
      {
        title: 'Product discipline',
        body:
          'The interface focuses on safe guidance and remediation, which keeps the repo grounded in education instead of gimmicks.',
      },
    ],
    howItWorks: [
      {
        title: 'Load the lab',
        body:
          'Each challenge starts in a contained local workspace so vulnerable behavior can be examined without public exposure.',
      },
      {
        title: 'Inspect the issue',
        body:
          'The user can move between challenge mode and analysis mode to understand why a bug exists and how it behaves.',
      },
      {
        title: 'Apply the fix',
        body:
          'Remediation guidance turns the exercise into a full learning loop rather than a one-time challenge.',
      },
    ],
    images: [
      {
        src: githubPreview('find-the-bug'),
        alt: 'Find the Bug GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a local-only training environment with separate frontend and backend workspaces started together from the root package.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/find-the-bug.git`,
        'cd find-the-bug',
        'npm install',
        'npm run dev',
      ],
      notes: [
        'The backend and frontend are started together through npm workspaces.',
        'Keep this project local only, exactly as the repository warns.',
      ],
    },
  },
  {
    id: 'abandonment-scanner',
    repoName: 'Abandonment-Scanner',
    title: 'Abandonment Scanner',
    category: 'Full Stack',
    role: 'Geospatial Intelligence',
    description:
      'Map-first geospatial intelligence platform for discovering and routing to potentially abandoned properties.',
    fullDescription:
      'Abandonment Scanner is a geospatial intelligence product for discovering, analyzing, and routing to potentially abandoned properties. It pairs a polished map-first dashboard with backend scanning, enrichment, and optional desktop packaging paths.',
    techStack: ['React', 'Leaflet', 'Express', 'SQLite', 'Tauri'],
    features: [
      'Map workspace with click-to-scan behavior and radius-based property discovery.',
      'Heatmaps, route previews, and field-signal submission for investigation workflows.',
      'Area enrichment from public geospatial services and analyzer-backed scoring.',
      'Supports both web deployment and Windows desktop packaging through Tauri.',
    ],
    story: [
      {
        title: 'Mapping first',
        body:
          'The interface treats the map as the product surface, not a decorative widget, which keeps the workflow grounded in real operations.',
      },
      {
        title: 'Signal enrichment',
        body:
          'Backend analysis and public geospatial data are combined to make every scan feel informed instead of random.',
      },
      {
        title: 'Field usability',
        body:
          'Routing and desktop packaging turn the project into something that feels closer to a deployable tool than a concept.',
      },
    ],
    howItWorks: [
      {
        title: 'Scan an area',
        body:
          'The user selects a location and radius so the app can discover properties and build a working investigation map.',
      },
      {
        title: 'Enrich the findings',
        body:
          'Additional scoring and contextual overlays help surface stronger candidates directly inside the workspace.',
      },
      {
        title: 'Route the field work',
        body:
          'Routing, notes, and desktop packaging keep the project usable beyond an isolated web page.',
      },
    ],
    images: [
      {
        src: githubPreview('Abandonment-Scanner'),
        alt: 'Abandonment Scanner GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a workspace-based full-stack application with optional desktop tooling. The web workflow is the fastest way to explore it locally.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/Abandonment-Scanner.git`,
        'cd Abandonment-Scanner',
        'npm install',
        'cp .env.example .env',
        'npm run dev',
      ],
      notes: [
        'Use `npm run desktop:dev` if you want to test the Tauri desktop shell after the web app is working.',
      ],
    },
  },
  {
    id: 'spotiq',
    repoName: 'SpotIQ',
    title: 'SpotIQ',
    category: 'Full Stack',
    role: 'Parking Intelligence Platform',
    description:
      'Smart parking platform combining maps, predictive availability, payments, and realtime updates.',
    fullDescription:
      'SpotIQ is a smart parking platform that combines real-time maps, predictive availability, Stripe-backed session payments, and developer-facing API access. It is structured like a product platform rather than a single demo endpoint.',
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'React', 'Stripe', 'Socket.IO'],
    features: [
      'Nearby search, street rule lookups, price filters, and detailed spot views.',
      'Prediction engine informed by historical patterns, time, and live availability signals.',
      'Real-time heatmap updates and reservation state streaming through Socket.IO.',
      'Stripe Checkout flows, webhooks, and developer API key onboarding support.',
    ],
    story: [
      {
        title: 'Operational visibility',
        body:
          'The app treats parking as a product system with inventory, payments, and live updates rather than a simple map overlay.',
      },
      {
        title: 'Realtime layer',
        body:
          'Socket-driven updates keep the experience alive, which is critical when availability changes quickly.',
      },
      {
        title: 'Monetization built in',
        body:
          'Payments and API access make the repository feel much closer to a platform business than a side demo.',
      },
    ],
    howItWorks: [
      {
        title: 'Find a spot',
        body:
          'Search and map filters narrow the most useful locations while availability signals keep the list feeling current.',
      },
      {
        title: 'Predict demand',
        body:
          'Historical and live data combine to estimate likely availability instead of relying on static rules.',
      },
      {
        title: 'Reserve and pay',
        body:
          'Stripe-backed payment flows connect the frontend experience to a monetizable backend system.',
      },
    ],
    images: [
      {
        src: githubPreview('SpotIQ'),
        alt: 'SpotIQ GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a Node-based full-stack app with a separate web interface and Prisma-backed data layer.',
      requirements: ['Node.js 18+', 'npm', 'PostgreSQL if you want the full data flow'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/SpotIQ.git`,
        'cd SpotIQ',
        'npm install',
        'npm run prisma:generate',
        'npm run dev',
      ],
      notes: [
        'Use `npm run dev:web` if you only want the Vite interface after the backend setup is in place.',
      ],
    },
  },
  {
    id: 'mini-wiki',
    repoName: 'mini-wiki',
    title: 'Mini Wiki',
    category: 'Full Stack',
    role: 'Knowledge Platform',
    description:
      'Structured publishing and search platform with moderation, role-based editing, and a live public deployment.',
    fullDescription:
      'Mini Wiki is a production-minded knowledge platform centered on structured publishing, search, and cleaner content workflows. It includes a live deployment and a build shape that leans into moderation, personalization, and release readiness.',
    techStack: ['TypeScript', 'Vite', 'Tailwind CSS', 'Search', 'PostgreSQL-ready APIs'],
    demoUrl: 'https://mini-wiki-drab.vercel.app',
    supportsEmbed: true,
    features: [
      'Article creation, editing, recommendations, and fuzzy search suggestions.',
      'Role-based permissions with admin review and a dedicated Apply to Edit workflow.',
      'Production-safe input handling, rate limiting, and deployment-minded structure.',
      'Includes a public live deployment that can be explored directly from the portfolio.',
    ],
    story: [
      {
        title: 'Publishing system',
        body:
          'The project treats content as a real product surface, with moderation and permissions built into the core model.',
      },
      {
        title: 'Search experience',
        body:
          'Search and recommendations are designed to guide exploration instead of acting like an afterthought bolted onto article pages.',
      },
      {
        title: 'Release readiness',
        body:
          'The repository balances polish and operational concerns, which is why it works well as a live demo candidate inside the portfolio.',
      },
    ],
    howItWorks: [
      {
        title: 'Create and review',
        body:
          'Content flows through an authored experience with moderation paths that keep publishing standards intact.',
      },
      {
        title: 'Search and discover',
        body:
          'Fuzzy search and recommendations help users move through the knowledge base naturally.',
      },
      {
        title: 'Scale safely',
        body:
          'Rate limits, roles, and deployment-minded defaults give the project a stronger production feel.',
      },
    ],
    images: [
      {
        src: githubPreview('mini-wiki'),
        alt: 'Mini Wiki GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a Vite-powered frontend with backend-ready structure. The public deployment is available, but local development is straightforward too.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/mini-wiki.git`,
        'cd mini-wiki',
        'npm install',
        'npm run dev',
      ],
      notes: [
        'Check `.env.example` before wiring any backend or database services locally.',
      ],
    },
  },
  {
    id: 'firecomm-os',
    repoName: 'Firecomm-OS',
    title: 'FireComm OS',
    category: 'Full Stack',
    role: 'Realtime Operations Platform',
    description:
      'LAN-first emergency dispatch and situational awareness platform with realtime coordination and mapping.',
    fullDescription:
      'FireComm OS is a LAN-first emergency dispatch and situational awareness platform built around real-time coordination, mapping, and offline-friendly operational tooling for station environments.',
    techStack: ['TypeScript', 'React', 'Socket.IO', 'Leaflet', 'Tauri'],
    features: [
      'Real-time station chat with priority and emergency alert handling.',
      'Incident workflows with assignments, timelines, and map pins.',
      'Unit status tracking with offline queueing and connection monitoring.',
      'Optional desktop packaging path for station-side deployment.',
    ],
    story: [
      {
        title: 'Clarity under pressure',
        body:
          'The interface hierarchy stays focused on signal over ornament because emergency software has to stay readable in stressful moments.',
      },
      {
        title: 'Realtime coordination',
        body:
          'Chat, assignments, and map awareness are treated as one operational surface instead of separate tools.',
      },
      {
        title: 'Local resilience',
        body:
          'LAN-first design and desktop packaging give the project a stronger deployment story than a browser-only concept.',
      },
    ],
    howItWorks: [
      {
        title: 'Manage incidents',
        body:
          'The product keeps unit status, assignment updates, and incident context visible in one place.',
      },
      {
        title: 'Coordinate in realtime',
        body:
          'Realtime communication channels help the station stay synchronized without context switching.',
      },
      {
        title: 'Stay usable offline',
        body:
          'The local-network-first model makes the product more resilient in environments with imperfect connectivity.',
      },
    ],
    images: [
      {
        src: githubPreview('Firecomm-OS'),
        alt: 'FireComm OS GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as separate frontend and backend applications, with helper scripts in the root package for installing and starting each side.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/Firecomm-OS.git`,
        'cd Firecomm-OS',
        'npm install',
        'npm run install:all',
        'npm run dev:backend',
        'npm run dev:frontend',
      ],
      notes: [
        'Start the backend and frontend in separate terminals for the cleanest local workflow.',
      ],
    },
  },
  {
    id: 'steel-lang',
    repoName: 'Steel-lang',
    title: 'Steel Lang',
    category: 'Tooling',
    role: 'Interpreter Experiment',
    description:
      'Custom interpreted language focused on clean syntax, fast experimentation, and a live public demo.',
    fullDescription:
      'Steel Lang is a custom interpreted language focused on clean syntax, minimal complexity, and fast experimentation. It pairs a lightweight interpreter with example programs and an external live demo surface.',
    techStack: ['JavaScript', 'Interpreter', 'CLI tooling', 'Language design'],
    demoUrl: 'https://steel-lang.base44.app',
    supportsEmbed: true,
    features: [
      'Custom JavaScript interpreter focused on a small, approachable syntax.',
      'Example programs and a runnable CLI entrypoint.',
      'Language-oriented repository structure for experiments and extensions.',
      'Public live demo referenced directly in the repository description.',
    ],
    story: [
      {
        title: 'Fast experimentation',
        body:
          'The project keeps the syntax small so new ideas can be tested quickly without a heavy compile chain.',
      },
      {
        title: 'Runtime feedback',
        body:
          'A lightweight interpreter lets the repository stay highly exploratory while still feeling intentional.',
      },
      {
        title: 'Public surface',
        body:
          'The live demo makes it easier to move from reading the repo to actually interacting with the language.',
      },
    ],
    howItWorks: [
      {
        title: 'Parse and execute',
        body:
          'Programs are interpreted directly through a custom runtime, which keeps the language loop tight and exploratory.',
      },
      {
        title: 'Run sample programs',
        body:
          'Examples in the repo help explain the syntax and make the language easier to test locally.',
      },
      {
        title: 'Extend the experiment',
        body:
          'The language is intentionally compact, leaving room for features and syntax evolution over time.',
      },
    ],
    images: [
      {
        src: githubPreview('Steel-lang'),
        alt: 'Steel Lang GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a JavaScript interpreter experiment with a lightweight local workflow.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/Steel-lang.git`,
        'cd Steel-lang',
        'npm install',
        'npm start',
      ],
      notes: [
        'The public demo is available if you want to evaluate the language before cloning the repo.',
      ],
    },
  },
  {
    id: 'rapidlink',
    repoName: 'RapidLink',
    title: 'RapidLink',
    category: 'Backend',
    role: 'API Service',
    description:
      'Python service project with a documented virtualenv workflow and a FastAPI-style runtime path.',
    fullDescription:
      'RapidLink is a backend-oriented project built around a documented Python service workflow. It stands out because the repository already exposes a clean local run path, making it useful as a backend-focused portfolio case study.',
    techStack: ['Python', 'FastAPI', 'Uvicorn', 'API design'],
    features: [
      'Python service structure with a documented virtual environment setup.',
      'Simple requirements-driven local installation flow.',
      'Clear app boot command through Uvicorn for local testing.',
      'Backend-first repository that is easy to evaluate quickly.',
    ],
    story: [
      {
        title: 'Backend focus',
        body:
          'The project emphasizes service structure and runtime clarity instead of a heavy frontend presentation.',
      },
      {
        title: 'Local-first setup',
        body:
          'The repository provides a straightforward way to get the API running quickly, which makes it easier to inspect the architecture.',
      },
      {
        title: 'Portfolio role',
        body:
          'It broadens the portfolio beyond frontend polish by showing service-side thinking and Python workflow fluency.',
      },
    ],
    howItWorks: [
      {
        title: 'Install dependencies',
        body:
          'A Python virtual environment and requirements file provide the cleanest way to reproduce the service locally.',
      },
      {
        title: 'Run the API',
        body:
          'Uvicorn starts the service in development mode, keeping the feedback loop simple for testing endpoints.',
      },
      {
        title: 'Extend the backend',
        body:
          'The repository structure is small enough to audit quickly while still leaving room for service growth.',
      },
    ],
    images: [
      {
        src: githubPreview('RapidLink'),
        alt: 'RapidLink GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a lightweight Python service with a virtual environment and Uvicorn development server.',
      requirements: ['Python 3+', 'pip'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/RapidLink.git`,
        'cd RapidLink',
        'python -m venv .venv',
        'source .venv/bin/activate  # Windows: .venv\\Scripts\\activate',
        'pip install -r requirements.txt',
        'uvicorn app.main:app --reload',
      ],
      notes: [
        'Check the repository README for any environment variables or service-specific configuration.',
      ],
    },
  },
  {
    id: 'harvesthub',
    repoName: 'HarvestHub',
    title: 'HarvestHub',
    category: 'Full Stack',
    role: 'Marketplace Prototype',
    description:
      'Full-stack marketplace prototype split into client and server applications.',
    fullDescription:
      'HarvestHub is a marketplace-style full-stack prototype with a separate client and server architecture. It works well as a portfolio example because it shows practical application structure without hiding behind a single-page frontend shell.',
    techStack: ['React', 'Vite', 'Express', 'SQLite', 'Marketplace flows'],
    features: [
      'Split client and server applications with their own package configurations.',
      'Marketplace-oriented product structure that feels broader than a simple landing page.',
      'Vite frontend workflow and an Express-style backend service shape.',
      'Good candidate for explaining end-to-end product architecture in a portfolio context.',
    ],
    story: [
      {
        title: 'Client and server split',
        body:
          'The project reflects a more realistic application structure by keeping frontend and backend concerns separated.',
      },
      {
        title: 'Product framing',
        body:
          'A marketplace format helps the repo demonstrate user flows, data handling, and application structure together.',
      },
      {
        title: 'Portfolio value',
        body:
          'It gives the portfolio another example of applied full-stack thinking beyond dashboards and tools.',
      },
    ],
    howItWorks: [
      {
        title: 'Start the server',
        body:
          'The backend handles data and application behavior separately from the user interface.',
      },
      {
        title: 'Run the client',
        body:
          'The frontend consumes the server-side functionality through a dedicated Vite application.',
      },
      {
        title: 'Test the flow',
        body:
          'Together the split architecture makes it easier to reason about how user journeys map to the underlying codebase.',
      },
    ],
    images: [
      {
        src: githubPreview('HarvestHub'),
        alt: 'HarvestHub GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a split client/server application, making it useful for exploring full-stack flow in two terminals.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/HarvestHub.git`,
        'cd HarvestHub',
        'npm install',
        'cd server && npm install',
        'cd ../client && npm install',
      ],
      notes: [
        'Start the server and client in separate terminals after installing dependencies in each workspace.',
      ],
    },
  },
  {
    id: 'social-app',
    repoName: 'social-app',
    title: 'Social App',
    category: 'Full Stack',
    role: 'Community Platform',
    description:
      'Social platform repository with Node, Express, and Supabase-backed local development.',
    fullDescription:
      'Social App is a community-oriented full-stack build with a Node and Express backend path plus Supabase-oriented infrastructure. It helps round out the portfolio with a more socially driven product model.',
    techStack: ['Node.js', 'Express', 'Supabase', 'React', 'Community features'],
    features: [
      'Node and Express service setup for application logic.',
      'Supabase-backed data and auth patterns referenced in the repository.',
      'Community-oriented user flow rather than a dashboard-only interface.',
      'Useful as a portfolio example of another common product category.',
    ],
    story: [
      {
        title: 'Social interaction model',
        body:
          'The repository explores how user-generated content and community features shape application architecture.',
      },
      {
        title: 'Service integration',
        body:
          'Supabase-style infrastructure adds practical backend concerns like data access and authentication.',
      },
      {
        title: 'Portfolio breadth',
        body:
          'It broadens the portfolio with a product type that depends on user interaction rather than operational data alone.',
      },
    ],
    howItWorks: [
      {
        title: 'Configure the backend',
        body:
          'Environment variables and service configuration connect the application to the data layer.',
      },
      {
        title: 'Run the app',
        body:
          'The development server starts the interface and backend workflow through the repository scripts.',
      },
      {
        title: 'Explore interactions',
        body:
          'Community product flows make the codebase useful for studying state, data, and user experience together.',
      },
    ],
    images: [
      {
        src: githubPreview('social-app'),
        alt: 'Social App GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'Runs as a Node-based application with environment variables required for the complete backend flow.',
      requirements: ['Node.js 18+', 'npm'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/social-app.git`,
        'cd social-app',
        'npm install',
        'cp .env.example .env',
        'npm run dev',
      ],
      notes: [
        'Expect backend credentials or Supabase configuration before the full experience works locally.',
      ],
    },
  },
  {
    id: 'project-launch-kit',
    repoName: 'project-launch-kit',
    title: 'Project Launch Kit',
    category: 'Frontend',
    role: 'Landing Page System',
    description:
      'Static landing page starter focused on customization and launch-ready frontend structure.',
    fullDescription:
      'Project Launch Kit is a frontend-oriented landing page system built with a straightforward static stack. It stands out by being immediately readable, customizable, and useful as a reference for launch-style marketing surfaces.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Landing page'],
    features: [
      'Beginner-friendly HTML, CSS, and JavaScript customization workflow.',
      'Fast static setup path with no heavy runtime requirements.',
      'Useful as a reference for launch and marketing page structure.',
      'A lighter project that balances the heavier app and backend entries in the portfolio.',
    ],
    story: [
      {
        title: 'Fast launch surface',
        body:
          'The project focuses on speed and clarity, which makes it useful as a practical static frontend reference.',
      },
      {
        title: 'Customization first',
        body:
          'The structure is easy to adapt, helping it function as a toolkit instead of a one-off page.',
      },
      {
        title: 'Portfolio role',
        body:
          'It rounds out the portfolio with a lighter, launch-oriented frontend build alongside the heavier application work.',
      },
    ],
    howItWorks: [
      {
        title: 'Edit the content',
        body:
          'The static structure makes it easy to adjust copy, layout, and visual treatment without a build-heavy workflow.',
      },
      {
        title: 'Serve locally',
        body:
          'A simple local server is enough to preview the page and confirm behavior before deployment.',
      },
      {
        title: 'Ship quickly',
        body:
          'The whole point is to give a faster path from concept to public-facing launch page.',
      },
    ],
    images: [
      {
        src: githubPreview('project-launch-kit'),
        alt: 'Project Launch Kit GitHub repository preview',
      },
    ],
    localSetup: {
      summary:
        'This is best treated as a static web project. A simple local server gives the cleanest preview experience.',
      requirements: ['A web browser', 'Python 3+ for a quick local server'],
      commands: [
        `git clone https://github.com/${GITHUB_HANDLE}/project-launch-kit.git`,
        'cd project-launch-kit',
        'python -m http.server 4173',
      ],
      notes: ['You can also open `index.html` directly if the project is fully static.'],
    },
  },
];

export const projectCatalog = Object.fromEntries(
  projectDefinitions.map((project) => [project.id, project]),
);

export const projectCatalogByRepoName = Object.fromEntries(
  projectDefinitions.map((project) => [project.repoName, project]),
);
