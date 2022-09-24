import { diff, produce } from "./deps.ts";

export type Logger<T> = {
	// deno-lint-ignore no-explicit-any
	modify: (change: (a0: T) => any) => void;
    replace: (change: (a0: T) => T) => void;
};

// deno-lint-ignore no-explicit-any
export const Logger = (sink: (msg: any) => void | Promise<void>) =>
	<T>(obj: T): Logger<T> => {
		let innerObj = obj;

        const logNewObj = (newObj: T) => {
            const diffBtwn = diff(innerObj, newObj);
            if (diffBtwn.length > 0) {
                sink(diffBtwn); 
            }
            innerObj = newObj;
        }
		return {
			modify: (fn) => {
					const newObj = produce(innerObj, (t) => {
                        fn(t as T);
                    });
					logNewObj(newObj)
				},
            replace: (fn) => {
                const newObj = produce(innerObj, fn);
                logNewObj(newObj)
            },
		};
	};

