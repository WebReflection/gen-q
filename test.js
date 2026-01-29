import Queue from './index.js';

// forever waiting for pushes
// it exits on explicit queue reset: splice(0)
async function test(items) {
  for await (const item of items)
    console.log(item);
  console.log('done');
}

const numbers = new Queue(1, 2, 3);
console.assert(Object.prototype.toString.call(numbers) === '[object Queue]');
test(numbers);

// it fails if it was not consumed/resetted
try {
  await test(numbers);
  console.assert(false, 'should have thrown an error');
}
catch {}

// exit the test (after 3 seconds)
setTimeout(() => {
  numbers.splice(0);
}, 3000);

setTimeout((...args) => {
  // nobody will see these items ...
  // pushed but then synchronously removed via splice
  numbers.push(...args);

  // drop all items from the queue, like map and other
  // methods it returns a new Queue itself
  console.assert(numbers.splice(0) instanceof Queue);

  // push and then loop again
  setTimeout(async () => {
    numbers.push(...args);
    await test(numbers);
    // will exit in a second
  }, 1000);
}, 1000, 4, 5, 6);
