
export type RecordKeyType = string | number | symbol;

export type Dot<T, S extends RecordKeyType[]> = S extends [] ? T 
    : S extends [infer K0, infer K1] ? 
        K0 extends keyof T ?
            Dot<NonNullable<T[K0]>, [K1 & RecordKeyType]>
            : unknown
    : S extends [infer K1] ?
        K1 extends keyof T ?
            T[K1]
        : unknown
    : unknown;