import "./typings";
declare type options = {
    seek?: boolean;
    exhaustive?: boolean;
};
export declare const bjorn: (sequence: any[], options?: options) => (...patterns: any[][]) => any;
export {};
