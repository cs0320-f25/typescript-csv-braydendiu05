# Sprint 1: TypeScript CSV

### Task B: Proposing Enhancement

- #### Step 1: Brainstorm on your own.

- #### Step 2: Use an LLM to help expand your perspective.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

My 4 enhancements:
Functionality
As a developer using the CSV parser, I can parse fields that contain commas, double quotes, and newlines when they’re enclosed in quotes, so real-world CSVs (Excel/Sheets exports) load correctly without manual cleanup.

Functionality:
As a developer, I get precise errors for malformed CSV such as unbalanced quotes, stray quotes, or bad escapes with row/column locations and a short preview so I can quickly pinpoint and fix bad source rows or choose to exit processing.

Extensibility:
As a developer, I can consume rows as an async stream and stop early (e.g., after N rows or when a predicate is met), so I can process very large CSVs efficiently without loading the entire file into memory.

Extensibility (Came from both LLM and I):
As a developer, I can treat the first row as headers and have them normalized (trimmed, case-normalized, spaces→underscores) with automatic de-duplication and optional mapping to canonical keys, so downstream code can rely on stable, conflict-free field names.

Notes:
handle quoted fields correctly (commas/newlines inside quotes, doubled quotes), add column-count checks, support streaming for big files, and provide schema/validation with strict vs. lenient error modes. Prompt A pushed robustness items—CRLF line endings, BOM stripping, encoding quirks, and explicit delimiter/quote options. Prompt B focused on developer ergonomics—structured row/column errors, header normalization/mapping, and a clear policy for null/empty cells. What stuck: fix quoted fields first, add streaming, and emit actionable errors.
### Design Choices

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  
