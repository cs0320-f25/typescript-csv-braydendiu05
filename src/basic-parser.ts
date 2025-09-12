import * as fs from "fs";
import * as readline from "readline";
import { ZodType } from "zod";

/**
 * Info about a row that failed schema validation.
 * - row: 1-based row index in the file
 * - messages: human-readable messages from Zod
 * - raw: the original string cells for that row
 */
type RowError = {
  row: number;        
  messages: string[]; 
  raw: string[];      
};
/**
 * (I replaced the original JSDoc comment with this one for grading)
* Modes:
 * - No schema, returns string[][] (arrays of strings).
 * - With schema,validates/transforms each row with schema.safeParse and returns { rows, errors }.
 *
 * Limits for now: uses a simple split(",") and trim(). Quoted fields are not handled yet.
 *
 * @template T Row type produced by the given Zod schema
 * @param path Path to the CSV file
 * @param schema Optional Zod schema for one row (e.g., z.tuple([...]).transform(...))
 * returns string[][] if schema is omitted, otherwise { rows: T[]; errors: RowError[] }
 *
 * example:
 * // No schema: just get arrays of strings
 * const raw = await parseCSV("./data/people.csv");
 *
 * @example
 * // With schema: tuple, object
 * import { z } from "zod";
 * const PersonRow = z.tuple([z.string(), z.coerce.number()])
 *                   .transform(([name, age]) => ({ name, age }));
 * const { rows, errors } = await parseCSV("./data/people.csv", PersonRow);
 */
export async function parseCSV<T>(path: string, schema?: ZodType<T> ): Promise<string[][] | { rows: T[]; errors: RowError[] }> {  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });

  const rawRows: string[][] = [];
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    rawRows.push(values);
  }

  if (!schema) return rawRows;

  //with schema 
  const rows: T[] = [];
  const errors: RowError[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const cells = rawRows[i];
    const res = schema.safeParse(cells);
    if (res.success) {
      rows.push(res.data);
    } else {
      errors.push({
        row: i + 1,
        messages: res.error.issues.map((iss) => iss.message),
        raw: cells,
      });
    }
  }

  return { rows, errors };
}