/// <reference types="node" />
export declare class Handler {
    config: any;
    private client;
    constructor(config?: any);
    get(key: string, callback: Function): void;
    set(key: string, value: Buffer, header: any, rawUrl: string, expire?: number, callback?: Function): void;
    del(key: string): void;
    delGroup(group: string): void;
}
