// @ts-check

/** @type {<T,R>(self: Queue<T>, value: R) => R} */
let awake;

const wake = () => {};

/** @template T */
export default class Queue extends Array {
  static {
    awake = (self, value) => {
      if (self.#iterating) self.#wake();
      return value;
    };
  }

  #iterating = false;

  #wake = wake;

  /** @param {...T} items */
  constructor(...items) {
    // @ts-ignore
    super().push(...items);
  }

  /**
   * Add items to the queue and wake up the iterator if needed.
   * @override
   * @param  {...T} items
   * @returns {number}
   */
  push(...items) {
    return awake(this, super.push(...items));
  }

  /**
   * Remove items from the queue and wake up the iterator if needed.
   * The returned value is a new instance of the same class.
   * If all items are removed while iterating and no more items are added,
   * the iterator will exit.
   * @override
   * @param {number} start
   * @param {number} [deleteCount=this.length]
   * @param  {...T} items
   * @returns {Queue<T>}
   */
  splice(start, deleteCount = this.length, ...items) {
    return /** @type {Queue<T>} */(awake(this, super.splice(start, deleteCount, ...items)));
  }

  get [Symbol.toStringTag]() {
    return 'Queue';
  }

  /** @returns {AsyncGenerator<T>} */
  async *[Symbol.asyncIterator]() {
    // Only the queue owner should be able to iterate over this reference once.
    // This error won't break the loop anyway.
    if (this.#iterating) throw new Error('Queue is already iterating');
    this.#iterating = true;
    while (this.#iterating) {
      // If there are no items, wait until push calls wake().
      if (!this.length) await new Promise(
        wake => (this.#wake = /** @type {() => void} */(wake))
      );

      // If wake was called but there are no items left, break the loop.
      // This effectively allows reset and iteration again with splice(0).
      // ⚠️ If no reset is meant, do not fully splice the queue!
      if (this.length) yield this.shift();
      else this.#iterating = false;
    }
  }
}
