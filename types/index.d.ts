/**
 * @template T
 */
export default class Queue<T> extends Array<any> {
    /**
     * @param {...T} items
     */
    constructor(...items: T[]);
    /**
     * @override
     * @param  {...T} items
     * @returns {number}
     */
    override push(...items: T[]): number;
    /**
     * @param {number} start
     * @param {number} [deleteCount=this.length]
     * @param  {...T} [items]
     * @returns {Queue<T>[]}
     */
    splice(start: number, deleteCount?: number, ...items?: T[]): Queue<T>[];
    get [Symbol.toStringTag](): string;
    /**
     * @returns {AsyncGenerator<T>}
     */
    [Symbol.asyncIterator](): AsyncGenerator<T>;
    #private;
}
