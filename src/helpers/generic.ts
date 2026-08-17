export function assertsNonNullable<T>(val: T, msg = "should not be null or undefined"): asserts val is NonNullable<T> {
    if (val === null || val === undefined) {
        throw new Error(msg);
    }
}


export function assertsIsNumber(val: number): asserts val is number {
    if (typeof val !== "number" || Number.isNaN(val)) {
        throw new Error(`${val} should be a number`);
    }
}