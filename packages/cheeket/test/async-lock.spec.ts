/* eslint-disable no-plusplus,@typescript-eslint/no-loop-func */

import AsyncLock from "../lib/async-lock";

describe("AsyncLock", () => {
  const lock = new AsyncLock();

  test("acquire", async () => {
    const key = "test";
    const size = 100;

    const results: number[] = [];
    let counter = 0;
    for (let i = 0; i < size; i++) {
      lock.acquire(key, async () => {
        results.push(i);
        await (async () => {
          counter++;
          expect(results.pop()).toEqual(i);
        })();
      });
    }

    await lock.acquire(key, async () => {});
    expect(counter).toEqual(size);
  });
});
