import Queue from './index.js';

let count = 0;

const pressure = new Queue;

setTimeout(() => {
  pressure.splice(0);
  console.log('done');
}, 1000);

(async function test(items) {
  for await (const item of items) {
    console.log(item);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
  }
}(pressure));

(function more() {
  if (count++ === 10) return;
  pressure.push(count);
  queueMicrotask(more);
}());
