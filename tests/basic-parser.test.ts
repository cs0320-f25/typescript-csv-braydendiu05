import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import * as fs from "fs"; 

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
test("quoted comma stays in one field (should FAIL now)", async () => {
  const p = path.join(__dirname, "tmp-quoted-comma.csv");
  fs.writeFileSync(p, 'first,notes\nCaesar,"veni, vidi, vici"\n', "utf8");

  const rows = await parseCSV(p);
  expect(rows).toEqual([
    ["first", "notes"],
    ["Caesar", "veni, vidi, vici"],
  ]);
});

test('doubled quotes unescape to a single quote (should FAIL now)', async () => {
  const p = path.join(__dirname, "tmp-doubled-quotes.csv");
  fs.writeFileSync(p, 'quote,age\n"She said ""hi""",42\n', "utf8");

  const rows = await parseCSV(p);
  expect(rows).toEqual([
    ["quote", "age"],
    ['She said "hi"', "42"],
  ]);
});

test("empty fields (including trailing empty) are preserved", async () => {
  const p = path.join(__dirname, "tmp-empty-fields.csv");
  fs.writeFileSync(p, "a,b,c,d\n1,2,,4\n5,,,\n", "utf8");

  const rows = await parseCSV(p);
  expect(rows).toEqual([
    ["a", "b", "c", "d"],
    ["1", "2", "", "4"],
    ["5", "", "", ""],
  ]);
});