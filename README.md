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

# Reflection Questions

1) A CSV parser is “correct” if it turns a CSV file into the same rows and cells you’d expect every time. Same input, same output; row order and column order are preserved. Newlines end rows unless they’re inside quotes. Commas only split fields when they’re not inside quotes. A doubled quote "" becomes a single ". Empty fields (including trailing ones) stay as empty strings. The parser shouldn’t guess types, everything is strings unless the caller supplies a schema, and with a schema it shouldn’t throw. It should return typed rows plus a clear list of validation errors where rows + errors = total input rows, with row numbers you can map back to the file.

2) If I had a random CSV generator, I’d use it for property-style checks. I’d generate out random tables (sizes, weird characters, quoted/unquoted, doubled quotes), stringify them by the appendix rules, and require that parse(stringify(table)) round-trips cell-for-cell. I’d also check that parsing A then B and concatenating equals parsing A++B. For negative tests, I’d inject unbalanced/stray quotes or ragged rows and assert no throws, correct 1-based row numbers in errors, and preserved order for the good rows. I’d seed the generator so failures are reproducible.

3) Compared to past assignments, this one had less concrete direction and a more design freedom as I wasn’t starting from concepts I already knew well. The biggest surprise was the header row failing a tuple schema, which made me treat schema mode as “data rows only” and never throw on validation. As for the bugs, I changed parseCSV’s signature and broke run-parser.ts (fixed by updating the call and handling the union); my first error reporting was too vague, so I switched to {row, messages, raw}; and I hit one path issue in tests fixed by writing files with path.join(__dirname, …). Avoiding as casts, not logging from the parser, and keeping tests tiny and focused kept the rest under control.
### Design Choices
For this sprint, my main design choice was to keep the parser simple and flexible while separating concerns. The parser itself only handles splitting rows and cells, leaving validation and type conversion entirely to the caller through a Zod schema. This way, the parser remains agnostic to the actual data format and different callers can supply schemas suited to their needs. I also chose to return structured error objects instead of throwing exceptions so that parsing can continue even if some rows fail validation. Finally, I preserved the original behavior of returning string[][] when no schema is provided, ensuring backward compatibility while adding schema support as an optional feature.

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests: 
My test suite covers three main areas. First, there are baseline checks to confirm that parseCSV correctly reads rows into arrays of strings and that each row is an array. Second, Task A adds tests for CSV specification edge cases such as quoted commas, doubled quotes, and empty fields. Two of these tests (quoted commas and doubled quotes) are expected to fail in this spring since the parser doesn’t yet handle quoting. These failures are intentional to show missing functionality that will be fixed later. Finally, Task C introduces schema validation and transformation with Zod. Here, tests check that valid rows are transformed into typed objects, invalid rows are reported in the errors array (without exceptions), and the legacy behavior of returning string[][] without a schema is still preserved.
#### How To…
To run the tests, install dependencies with npm install and then run npm test from the project root. This will execute all Jest tests, including the parser tests. If you only want to run the parser tests specifically, you can use npx jest basic-parser.test.ts. The tests make use of both the provided data/people.csv file and small temporary CSV files generated during the run.
#### Team members and contributions (include cs logins): N/A

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI): used copilot for the enhancement ideas (cited above which one)
#### Total estimated time it took to complete project: 5 hours
#### Link to GitHub Repo: https://github.com/cs0320-f25/typescript-csv-braydendiu05
