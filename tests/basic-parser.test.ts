import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import * as fs from "fs"; 
import { z } from "zod";
const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});


// TASK A TESTS
test("quoted comma stays in one field", async () => {
  const p = path.join(__dirname, "tmp-quoted-comma.csv");
  fs.writeFileSync(p, 'first,notes\nCaesar,"veni, vidi, vici"\n', "utf8");

  const rows = await parseCSV(p);
  expect(rows).toEqual([
    ["first", "notes"],
    ["Caesar", "veni, vidi, vici"],
  ]);
});

test('doubled quotes unescape to a single quote', async () => {
  const p = path.join(__dirname, "tmp-doubled-quotes.csv");
  fs.writeFileSync(p, 'quote,age\n"She said ""hi""",42\n', "utf8");

  const rows = await parseCSV(p);
  expect(rows).toEqual([
    ["quote", "age"],
    ['She said "hi"', "42"],
  ]);
});

test("empty fields preserved", async () => {
  const p = path.join(__dirname, "tmp-empty-fields.csv");
  fs.writeFileSync(p, "a,b,c,d\n1,2,,4\n5,,,\n", "utf8");

  const rows = await parseCSV(p);
  expect(rows).toEqual([
    ["a", "b", "c", "d"],
    ["1", "2", "", "4"],
    ["5", "", "", ""],
  ]);
});

// TASK C TESTS
// 1) With a schema: rows are validated/transformed; errors collected (no throws)

test("validates & transforms rows with Zod schema", async () => {
  const PersonRow = z
    .tuple([z.string(), z.coerce.number()])
    .transform(([name, age]) => ({ name, age }));

  const result = await parseCSV(PEOPLE_CSV_PATH, PersonRow);

  // typed objects in order (header + Bob('thirty') become errors)
  expect(result.rows).toEqual([
    { name: "Alice", age: 23 },
    { name: "Charlie", age: 25 },
    { name: "Nim", age: 22 },
  ]);

  // row indices are 1-based: header=1, Alice=2, Bob=3, Charlie=4, Nim=5
  expect(result.errors.map(e => e.row)).toEqual([1, 3]);
  expect(result.errors.every(e => Array.isArray(e.messages))).toBe(true);
});

// 2) without a schema: legacy string[][]
test("omitting schema returns string[][]", async () => {
  const res = await parseCSV(PEOPLE_CSV_PATH);

  // narrow the union without casts
  expect(Array.isArray(res)).toBe(true);
  if (!Array.isArray(res)) throw new Error("expected string[][]");

  expect(res[0]).toEqual(["name", "age"]);
  expect(res[1]).toEqual(["Alice", "23"]);
});