/** @template T */
export default class Queue<T> extends Array<any> {
    /** @param {...T} items */
    constructor(...items: T[]);
    /**
     * Add items to the queue and wake up the iterator if needed.
     * @override
     * @param  {...T} items
     * @returns {number}
     */
    override push(...items: T[]): number;
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
    override splice(start: number, deleteCount?: number, ...items: T[]): Queue<T>;
    get [Symbol.toStringTag](): string;
    /** @returns {AsyncGenerator<T>} */
    [Symbol.asyncIterator](): AsyncGenerator<T>;
    #private;
}
