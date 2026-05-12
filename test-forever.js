import Queue from './index.js';
import { forever } from './utils.js';

const numbers = new Queue(1, 2, 3);

// This one will never exit, and it owns the queue.
(async function test(items) {
  for await (const item of forever(items))
    console.log(item);
}(numbers));

setTimeout(() => {
  console.log('splice(0)');
  numbers.splice(0);
}, 1000);

setTimeout(() => {
  numbers.push(4, 5, 6);
}, 2000);

setTimeout(console.log, 3000, 'done');
