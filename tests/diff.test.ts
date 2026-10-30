import assert from "node:assert/strict";
import test from "node:test";
import { parseFrontierCollisions } from "../scripts/diff/frontier.js";

test("parses numbered frontier collisions and all source links", () => {
  const collisions = parseFrontierCollisions(`
- **#1** \`in_game/common/example.txt\`:
  [First](../sources/first/in_game/common/example.txt),
  [Second](../sources/second/in_game/common/example.txt)

Explanation.

- **#2** \`in_game/common/other.txt\`:
  [First](../sources/first/in_game/common/other.txt),
  [Second](../sources/second/in_game/common/other.txt),
  [Third](../sources/third/in_game/common/other.txt)
`);

  assert.deepEqual(collisions.get(1), {
    id: 1,
    outputPath: "in_game/common/example.txt",
    sources: [
      {
        label: "First",
        link: "../sources/first/in_game/common/example.txt",
      },
      {
        label: "Second",
        link: "../sources/second/in_game/common/example.txt",
      },
    ],
  });
  assert.equal(collisions.get(2)?.sources.length, 3);
});

test("parses profile-scoped frontier source links", () => {
  const collisions = parseFrontierCollisions(`
- **#1** \`in_game/common/example.txt\`:
  [First](../../../sources/first/in_game/common/example.txt),
  [Second](../../../sources/second/in_game/common/example.txt)
`);
  assert.equal(
    collisions.get(1)?.sources[0].link,
    "../../../sources/first/in_game/common/example.txt",
  );
});

test("rejects frontier collisions without both source links", () => {
  assert.throws(
    () =>
      parseFrontierCollisions(`
- **#1** \`in_game/common/example.txt\`:
  [Only](../sources/first/in_game/common/example.txt)
`),
    /must link at least two source files/,
  );
});
