import { diff, Packr, produce } from "./deps.ts";
import { RecordKeyType } from "./dot_type.ts";
import { Dot } from "./dot_type.ts";
import { change, extract, PropertyNotFound } from "./dot_utils.ts";

export type DiffLogger<T> = {
	// deno-lint-ignore no-explicit-any
	edit: (mutatingFn: (a0: T) => any) => void;
	map: (mappingFn: (a0: T) => T) => void;
	update: (replacement: T) => T;
};

export type WithSelector<T> = {
    select: <SelectorPath extends RecordKeyType[]>(selector: SelectorPath, replacement: () => Dot<T, SelectorPath>) => DiffLogger<Dot<T, SelectorPath>>;
}


export type DiffLoggerConfig<T> = {
	writeDiffs: (output: ReturnType<typeof diff>) => void | Promise<void>;
	writeState?: (state: T) => void | Promise<void>;
};

// impl select, then fork

export const DiffLogger = <T>(
	{ writeDiffs, writeState }: DiffLoggerConfig<T>,
) => <T>(state: T): DiffLogger<T> & WithSelector<T> => {
	let innerObj = state;
    const writeStateFn = writeState ?? (() => {});

	const logNewObj = (_newObj: T) => {
		const diffBtwn = diff(innerObj, _newObj);
		if (diffBtwn.length > 0) {
			const packr = new Packr({ structuredClone: true });
			const serialized = packr.pack(_newObj);
			const newObj = packr.unpack(serialized);
            writeDiffs(diffBtwn);
            writeStateFn(newObj);
			innerObj = newObj;
		}
        return _newObj;
	};

    const methods: DiffLogger<T> = {
        edit: (fn) => {
			const newObj = produce(innerObj, (t) => {
				fn(t as T);
			});
			logNewObj(newObj);
		},
		map: (fn) => {
			const newObj = produce(innerObj, fn);
			logNewObj(newObj);
		},
		update: (newObj) => {
			return logNewObj(newObj);
		},
    }

	const selector: WithSelector<T> = {
        select: (path, replacement) => {
            let selectedProp = extract<T, typeof path>(path)(innerObj);
            if (selectedProp === PropertyNotFound) {
                selectedProp = replacement();
            }
            return DiffLogger<Dot<T, typeof path>>({
                writeDiffs: () => {},
                writeState: (k) => methods.map(obj =>
                    change<T>()(path)(() => k, replacement)(obj)
                )
            })(selectedProp)
        }
	};

    return {
        ...methods,
        ...selector
    }
};
