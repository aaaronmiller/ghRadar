
    ## GitMiner: Automatic GitHub Search Tool

    https://raw.githubusercontent.com/khast3x/Offensive-Dockerfiles/main/gitminer/README.md

    ```
    ██████╗ ██╗████████╗███╗   ███╗██╗███╗   ██╗███████╗██████╗
    ██╔════╝ ██║╚══██╔══╝████╗ ████║██║████╗  ██║██╔════╝██╔══██╗
    ██║  ███╗██║   ██║   ██╔████╔██║██║██╔██╗ ██║█████╗  ██████╔╝
    ██║   ██║██║   ██║   ██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ██╔══██╗
    ╚██████╔╝██║   ██║   ██║ ╚═╝ ██║██║██║ ╚████║███████╗██║  ██║
     ╚═════╝ ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ v1.1
     Automatic search for GitHub.

     + Autor: Danilo Vaz a.k.a. UNK
     + Blog: http://unk-br.blogspot.com
     + Github: http://github.com/danilovazb
     + Gr33tz: l33t0s, RTFM

     +[WARNING]------------------------------------------+
     | DEVELOPERS ASSUME NO LIABILITY AND ARE NOT        |
     | RESPONSIBLE FOR ANY MISUSE OR DAMAGE CAUSED BY    |
     | THIS PROGRAM                                      |
     +---------------------------------------------------+


           [-h] [-q 'filename:shadow path:etc']
           [-m wordpress] [-o result.txt]
           [-c pAAAhPOma9jEsXyLWZ-16RTTsGI8wDawbNs4]

    optional arguments:
      -h, --help            show this help message and exit
      -q 'filename:shadow path:etc', --query 'filename:shadow path:etc'
                            Specify search term
      -m wordpress, --module wordpress
                            Specify the search module
      -o result.txt, --output result.txt
                            Specify the output file where it will be
                            saved
      -c pAAAhPOma9jEsXyLWZ-16RTTsGI8wDawbNs4, --cookie pAAAhPOma9jEsXyLWZ-16RTTsGI8wDawbNs4
                            Specify the cookie for your github
    ```

    ## GitHub API User and Repo Query Endpoints

    https://raw.githubusercontent.com/prkumar/uplink/main/examples/github-api/README.md

    ```
    Get a list of users who have committed in repos matching the keyword since oldest-age weeks ago
    /users?keyword=<keyword>[?oldest-age=<age in weeks>]

    Get a list of users who have committed in the given repo since oldest-age weeks ago
    /users/<user>/repo/<repo_name>[?oldest-age=<age in weeks>]

    Get a list of repos matching the keyword
    /repos?keyword=<keyword>
    ```

    ## GraphQL Query for GitHub Repository Statistics

    https://raw.githubusercontent.com/grafana/grafana-infinity-datasource/main/docs/sources/examples/github.md

    ```
    {
      repositoryOwner(login: "$GithubUser") {
        repositories(first: 100) {
          data: nodes {
            name
            stargazers {
              totalCount
            }
            openissues: issues(states: OPEN) {
              totalCount
            }
            openpr: pullRequests(states: OPEN) {
              totalCount
            }
          }
        }
      }
    }
    ```

    ## List Activities in GitHub Repository using Octokit

    https://raw.githubusercontent.com/octokit/plugin-rest-endpoint-methods.js/main/docs/repos/listActivities.md

    ```
    octokit.rest.repos.listActivities({
      owner,
      repo,
    });
    ```

    ## Fetch Repository Commit Activity with PHP GitHub API

    https://raw.githubusercontent.com/KnpLabs/php-github-api/main/doc/repos.md

    ```
    $activity = $client->api('repo')->activity('ornicar', 'php-github-api');
    ```

    ## GitMiner: Advanced Search Tool Using lxml and requests

    https://raw.githubusercontent.com/UnkL4b/GitMiner/main/README.md

    ```
    lxml
    requests
    argparse
    json
    re
    ```

    ## Fetch GitHub Data with get_github_data Function

    https://raw.githubusercontent.com/unytics/bigfunctions/main/use_cases/get_github_data.md

    ```
    SELECT bigfunctions.us.get_github_data('dbt-labs/dbt-core', 'my_project.github_data', 'stargazers, commits,
    releases');
    ```

    ## Implements GitHub Search Engine in Engine Implementation Template

    https://raw.githubusercontent.com/bisohns/search-engine-parser/main/.github/PULL_REQUEST_TEMPLATE/engine_impleme
    ntation.md

    ```
    Ex. I added the GitHub engine, `github.py` to the `search_engine_parser/core/engines` directory and made the
    necessary imports.
    This engine integrates GitHub search capabilities and returns stars, repository info, descriptions, links and
    titles.
    ```

    ## GraphQL Search for Repository Details

    https://raw.githubusercontent.com/simonw/til/main/github/dependencies-graphql-api.md

    ```
    {
      search(type:REPOSITORY query:"datasette" first:10) {
        repositoryCount
        edges {
          node {
            __typename
            ... on Repository {
              nameWithOwner
              description
            }
    ```



⏺ Great brief. I’ve:

  - Explored the ghRadar project (done).
  - Started drafting the PRD you asked for (in progress).

  Below is a concise but dense PRD aligned with your requirements and ghRadar’s existing architecture. If you’d like,
   next step I can split this into implementation tasks.

  ---
  PRD: ghRadar Next-Gen GitHub Discovery + Agentic Intelligence

  1. Product Summary

  Build an advanced GitHub intelligence layer on top of ghRadar that:

  - Finds and ranks high-signal repositories and ecosystems (e.g. “agent frameworks”) using rich, composable
  criteria.
  - Supports both:
    - Structured filters (commits, contributors, activity, size, topics, etc.).
    - Natural language queries mapped to opinionated search recipes.
  - Periodically ingests and stores metadata to:
    - Enable time-series analysis, momentum/trend detection, and comparisons.
    - Power agentic workflows via Claude Code CLI + hooks, MCP, and skill/agent files.
  - Exposes this via:
    - An “Update/Scan” trigger in the UI (button; extendable to scheduled runs).
    - Visual and textual insights (scores, charts, comparisons, recommendations).
    - Machine-consumable outputs for agentic models.

  Primary use case: “Show me the current, actively evolving, credible, cutting-edge projects for X (e.g., ‘agentic
  orchestration layers’), and help me understand and compare them.”

  ---
  2. Core Use Cases

  1. Power-user repository discovery
    - As a researcher, I can search GitHub for:
        - Repos with ≥5 commits in last 30 days
      1 contributor
      - “agent” (case-insensitive, partial match) in:
            - name
        - description
        - topics
        - README text
    - So that I get a curated list of serious, active “agent” projects.
  2. Multi-signal project surfacing
    - As a user, I can apply multi-dimensional filters:
        - Activity, momentum, maintenance quality, community, popularity, size, maturity.
    - So that low-signal/noise projects are filtered out.
  3. Trend and momentum intelligence
    - As a user, I can:
        - See which repos are:
            - Emerging (fast recent growth from low baseline)
        - Sustained (long-term consistent activity)
        - Peaking/declining
    - So I can identify truly “current” and “up-and-coming” projects.
  4. Deep dive comparison of candidate repos
    - Given a result set (e.g., 15 repos), I can:
        - Select a subset and ask questions like:
            - “Which is the best orchestration layer for framework-neutral agents?”
        - “Which has the highest sustained commit velocity, frequent releases, responsive maintainers?”
        - “Which is maintained by historically strong developers/orgs?”
    - And receive:
        - Ranked recommendations with transparent rationale.
  5. Persistent dataset + historical insights
    - As a power user, I can:
        - Click “Update” to refresh global/project category snapshots into a local DB.
      - Access historical snapshots to:
            - Avoid re-querying GitHub for every analysis.
        - See how rankings, momentum, and ecosystems change over time.
  6. Agentic integration
    - As an operator, I can:
        - Expose the curated datasets and criteria via:
            - Headless Claude Code CLI
        - Hooks
        - .claude config
        - MCP servers
        - Agent/skills definitions
      - So that LLM agents:
            - Use the stored intelligence as context.
        - Continuously refine queries, weights, and recipes.
        - Compare themselves and their configs to “exemplar” projects.

  ---
  3. Functional Requirements

  3.1 Advanced Search Inputs

  Support two complementary modes.

  A) Structured filters panel
  - Key dimensions (all combinable):
    - Text/domain:
        - Keyword in: name, description, topics, README (“agent” etc.; case-insensitive; partial).
      - Topics contains (e.g. “agents”, “orchestration”, “llm”, “framework”).
    - Activity:
        - Commits in last N days/weeks/months.
      - Push frequency (e.g. pushed:>2025-10-10).
      - Commit regularity vs bursts.
    - Contributors:
        - Unique contributors in last N days.
      - Bus factor proxies (top contributor share).
    - Popularity:
        - Stars (absolute, growth over time, stars/day).
      - Forks.
      - Watchers.
    - Quality & maintenance:
        - Recent releases count and recency.
      - Open vs closed issues ratio.
      - Median issue/PR response time.
      - Release cadence stability.
      - Has README, license, contributing guide, tests.
    - Codebase:
        - Primary language(s).
      - Repo size bounds.
      - Monorepo detection (optional).
    - Status:
        - Not archived.
      - Not disabled.
      - Optional: exclude forks.
    - Ownership:
        - By creator/owner/org or set of them.
    - Ecosystem:
        - Has workflows, packages, or integrations indicative of serious usage.

  B) Natural language queries
  - Examples:
    - “Best emerging agent orchestration frameworks, framework-neutral, active this quarter.”
    - “Battle-tested production agent frameworks with strong community and docs.”
  - Map to:
    - Predefined, explainable filter/weight “recipes.”
    - Editable so power users can tune.

  Deliverables:
  - Query builder that compiles:
    - GitHub Search / GraphQL queries.
    - Plus additional enrichment calls (commits, contributors, releases, issues).
  - Display the final evaluated query/recipe for transparency.

  3.2 Ranking and Scoring Engine

  Introduce a unified scoring system with multiple components:

  - Activity Score:
    - Recent commits, pushes, release activity.
    - Smooth over last 30/90/180 days.
  - Momentum Score:
    - Derivative of stars, commits, contributors over time.
    - Emphasize accelerating growth vs one-time spikes.
  - Quality/Maintainability Score:
    - Docs presence, tests indicators, CI, release hygiene.
    - Issue/PR responsiveness.
  - Community Score:
    - Stars, forks, watchers, distinct contributors.
    - Diversity of contributors.
  - Relevance Score:
    - Semantic/textual match to query (name/desc/README/topics/code indicators).
  - Reputation Score:
    - “Rockstar” heuristic:
        - Owners/contributors with strong track record:
            - Popular prior repos
        - Sustained activity across projects
    - Org reputation (optional/heuristic).

  Requirements:
  - Weights:
    - Default curated profiles (e.g. “Cutting-edge”, “Stable & mature”, “Fast movers”).
    - User-adjustable via UI sliders.
  - Output:
    - Overall score 0–100 with breakdown.
    - Explanations: “High momentum due to X; docked for no recent releases.”

  3.3 Data Ingestion and Storage

  Implement a durable data layer (local DB or lightweight backend) to:

  - Store:
    - Repository snapshots:
        - Core metadata + all metrics above.
    - Time-series:
        - Stars, forks, commits, contributors, releases, issues, PRs (aggregated).
    - Query recipes:
        - Named search profiles for NL intents (e.g., “top-agent-frameworks”).
    - “Exemplar” project lists:
        - Manually or automatically curated repos to track closely.
  - Support:
    - “Update” / “Rescan” button:
        - Re-fetch data for:
            - Tracked queries
        - Exemplar lists
      - Diff vs previous snapshot.
    - Rate-limit aware batching:
        - Queue + progress UI.
  - Expose:
    - Programmatic read API for agents (local endpoint or MCP server).

  3.4 Comparative Intelligence

  On any result set or saved list:

  - Enable multi-repo comparison:
    - Side-by-side table and visualizations:
        - Activity curves.
      - Momentum curves.
      - Issue/PR health, docs, CI.
      - “Rockstar”/reputation indicators.
  - Natural language Q&A:
    - Take:
        - Selected repos + stored metrics.
    - Answer:
        - “Which is best for X and why?”
      - “Which is stagnating?”
      - “Which is highest risk/most experimental?”
    - Always grounded in stored metrics and transparent.

  3.5 Agentic & Claude Code Integration

  - Provide:
    - Machine-readable views (JSON/CSV endpoints or files) of:
        - Latest ranked lists.
      - Historical trend summaries.
      - Exemplar repositories and their agent/skills/.claude config patterns.
  - Integrate with:
    - Claude Code CLI headless + hooks:
        - Hook to refresh datasets before certain commands.
      - Hook to let agents pick candidate repos based on defined recipes.
    - MCP:
        - MCP tool: “query_ghRadar_intel” for:
            - NL queries → structured recipes → results.
  - Self-improving behavior:
    - Track which recipes and result sets are frequently used or upvoted.
    - Adjust default weights/recipes over time.

  ---
  4. Non-Functional Requirements

  - Performance:
    - Efficient batch GitHub API usage; use GraphQL where appropriate.
    - Cache results; avoid redundant fetches.
  - Reliability:
    - Handle rate limits gracefully with backoff and partial results.
  - Transparency:
    - Always show:
        - Data freshness timestamps.
      - Active filters/recipes.
      - Score breakdowns.
  - Extensibility:
    - New metrics or APIs can be added via config (weights, sources).
  - Security:
    - Use user-provided PAT; never ship tokens.
    - Respect GitHub ToS.

  ---
  5. External Inspirations / Reference Projects

  Use these as inspiration (do not replicate blindly):

  - GitHub Advanced Search + CLI/gh extensions:
    - For syntax, composition of filters.
  - Criticality score / OSSF:
    - For multi-factor health & importance scoring.
  - Starguard, GitHub trending dashboards:
    - For growth/momentum visualization.
  - Octocode / anyquery / search-engine parsers:
    - For structured query schemas and flexible search.
  - Agentic repos with rich .claude / skills / MCP setups:
    - Maintain curated watchlist to mine patterns for:
        - Good agent definitions
      - Good hooks and workflows.

  We should:
  - Maintain a “golden set” of high-quality agentic repos.
  - Continuously ingest:
    - Their configs, update frequency, file patterns.
  - Use that to:
    - Evolve default recipes.
    - Suggest improvements to user’s own agent setups.

  ---
  6. Phased Delivery

  Phase 1: Core discovery and scoring
  - Implement:
    - Structured filters (including your explicit baseline filters).
    - Basic scores (activity, momentum, popularity, quality).
    - “Update” button to fetch + cache.
    - Results UI integrated into ghRadar.
  - Output:
    - Reliable “top agent repos right now” list.

  Phase 2: Persistence, trends, and comparison
  - Add:
    - Local DB / backend for snapshot storage.
    - Time-series + delta views.
    - Multi-repo comparison UI.
    - Export endpoints for agents.

  Phase 3: Agentic intelligence and self-improvement
  - Add:
    - NL → recipe mapping.
    - Agent-facing APIs/MCP tools.
    - “Exemplar” tracker + learning from external projects.
    - Adaptive default recipes based on usage and outcomes.

  ---
  If this direction matches your intent, next I recommend:

  1. Breaking this into implementation tasks mapped to your stack.
  2. Designing the query/recipe schema and scoring model precisely.
  3. Choosing where to host the persistent data (local-only vs lightweight backend).
  
  original user request:
  <start>
  use the explore agents to assess the current project; then create a prd document to integrate the ability to query
  github by search term as well as creator. Specifically i want ot be able to query for all projects with 5 or more
  commits in the last month, more than 1 contributor, and with the keyword "agent" in whole or partO( no
  capitailization requirement) in the project description (also enable searching the readme). Integarte many more
  search criteria (as many as possible, organize intellegently) such as size, activity, momentum, etc. Especially
  preferred are queries making use of several filters or elements that indicate more powerful information (ie showing
  the projects which are actively being developed, in process of being created, and representing the cutting edge of
  current app development. Trend analysis enables this (analyzing all projects and grouping and making insights based
  on the results). ENable a methodlogy to create large databases of such information; and then feed that information to
   agentic models via claude code cli headless + hooks for information retrieval and skills, .claude file, prompting,
  mcp and agent folder contents to make intelllegent groupings of such criteria and then put the most useful criteria
  groupings (represening an intellegent search critera for certain natrualk language terms, ie best , popular or
  current). Have the project enable this research via a button for now (update or somesuch), catalog prior data in a
  database, and use changes in the data for further informational utility (thus not needing to query projects on their
  commits etc.) . also enable comparisons of projects based on deeper analaysis (ie each project determine commit
  history, push and issue information, etc. ; so that if the above search for the current , best popular agent repos;
  when it retruns 10-15 or more projects; they can be selected and then deeper quereied (via naturual language) for
  something like "which of these projects is the best orchestration layer for agentic behavior in a framework neutral
  (ie using any cli interface) manner; and has the best and most frequent updates that are actively improvoing the
  program (also give bonuses for projects from "rockstar" developers, ie winning once might indicate likelyhoiod to win
   mroe). these are all terms that don't represent the limits of the software that i want; they represent the minimums.
   I want each idea expanded and built upon to make a powerful; useful utility for finding the best projects in github;
   and use the existing projects visual + verbal manner of conveying information buy build and oimprove on that as well
   (novel visualizatoin methods etc). make sure that the search critereia are self improving; and that the agentic
  natural langauge components of the software are able to be iteratively improved by comparing their current form with
  other simialr projects and then improviging (maybe keep a list of projects to "match" or good projects that have
  agent files worthy of attention. the frequency of their update is a powerful utility in finding these types of
  projects; ie an agent definition file updated 15 times over 3 weeks is very likely to be better than one than has
  beenupdated once). Make searches online to build and imporve on this idea; and create a prd that fulfils all of these
   issues; references projects that provide utility when building the project as examples; and theorizes additional
  ways to improve furhtur once the primary goals have been achieved. ultra think
  <end>