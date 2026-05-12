# gen-q

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/gen-q/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/gen-q?branch=main)

<sup>**Social Media Photo by [Meizhi Lang](https://unsplash.com/@meizhilang) on [Unsplash](https://unsplash.com/)**</sup>


Highliy inspired by *Refillable Generators post* (now 401 🤷), this module uses a modern *JS* approach through a class that doesn't need to provide "*error prone*" utilities around, as [explained in my reply](https://medium.com/p/6ea999513c91).

**[Live Demo](https://codepen.io/WebReflection/pen/zxBRYby?editors=1010)**

```js
import Queue from 'https://esm.run/gen-q';

// Keep waiting for pushes forever.
// It exits on an explicit queue reset: splice(0).
async function test(items) {
  for await (const item of items)
    console.log(item);
  console.log('done');
}

const numbers = new Queue(1, 2, 3);
test(numbers);

// It fails if it was not consumed or reset.
try {
  await test(numbers);
  console.assert(false, 'should have thrown an error');
}
catch {}

// Exit the test after 3 seconds.
setTimeout(() => {
  numbers.splice(0);
}, 3000);

setTimeout((...args) => {
  // Nobody will see these items:
  // they are pushed, then synchronously removed via splice.
  numbers.push(...args);

  // Drop all items from the queue. Like map and other
  // methods, it returns a new Queue.
  console.assert(numbers.splice(0) instanceof Queue);

  // Push and then loop again.
  setTimeout(async () => {
    numbers.push(...args);
    await test(numbers);
    // This will exit in a second.
  }, 1000);
}, 1000, 4, 5, 6);

// output
// 1
// 2
// 3
// done
// 4
// 5
// 6
// done
```

### Introducing `gen-q/utils`

```js
import Queue from 'https://esm.run/gen-q';
import { forever } from 'https://esm.run/gen-q/utils';

const numbers = new Queue(1, 2, 3);

// This one will never exit, and it owns the queue.
(async function test(items) {
  for await (const item of forever(items))
    console.log(item);
}(numbers));

// Any attempt to loop over the queue will fail,
// but the anonymous loop will keep going.

// Exit the test after 3 seconds.
setTimeout(() => {
  numbers.splice(0);
}, 3000);

setTimeout((...args) => {
  // Nobody will see these items:
  // they are pushed, then synchronously removed via splice.
  numbers.push(...args);

  // Drop all items from the queue. Like map and other
  // methods, it returns a new Queue.
  console.assert(numbers.splice(0) instanceof Queue);

  // Push later; `test` is still running.
  setTimeout(async () => {
    numbers.push(...args);
  }, 1000);
}, 1000, 4, 5, 6);

// output
// 1
// 2
// 3
// 4
// 5
// 6
```
