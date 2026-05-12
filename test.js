import Queue from './index.js';

// Keep waiting for pushes forever.
// It exits on an explicit queue reset: splice(0).
async function test(items) {
  for await (const item of items)
    console.log(item);
  console.log('done');
}

const numbers = new Queue(1, 2, 3);
console.assert(Object.prototype.toString.call(numbers) === '[object Queue]');
test(numbers);

// It fails if it was not consumed or reset.
try {
  await test(numbers);
  console.assert(false, 'should have thrown an error');
}
catch {}

// Exit the test after 3 seconds.
setTimeout(() => {
  console.assert(numbers.splice(0) instanceof Queue);
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

    setTimeout(() => {
      console.log('testing forever');
      import('./test-forever.js');
    }, 1000);
  }, 1000);
}, 1000, 4, 5, 6);
