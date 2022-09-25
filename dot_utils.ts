// deno-lint-ignore-file no-explicit-any
import { produce } from "./deps.ts";
import { Dot, RecordKeyType } from "./dot_type.ts";

export const PropertyNotFound = Symbol("property_not_found");
export type PropertyNotFound = typeof PropertyNotFound;

export const extract = <T, S extends RecordKeyType[]>(path: S) =>
	(obj: T): Dot<T, S> | PropertyNotFound =>
		path.reduce(
			(prev, curr) =>
				prev === PropertyNotFound
					? PropertyNotFound
					: prev[curr] === undefined
					? PropertyNotFound
					: prev[curr],
			obj as any,
		);

export const change = <T>() =>
	<S extends RecordKeyType[]>(path: S) =>
		(fn: (a0: Dot<T, S>) => Dot<T, S>, replacement: () => Dot<T, S>) =>
			(obj: T) => {
				return produce(obj, (draft: T) => {
					const pathParts = [...path];
					const last = pathParts.pop() || "";
					let extractedProperty = extract<T, S>(pathParts as S)(
						draft,
					);
					if (extractedProperty === PropertyNotFound) {
						extractedProperty = replacement();
					}
					const result = fn(extractedProperty);
					const parentProperty = pathParts.reduce(
						(prev, curr) => prev[curr],
						draft as any,
					);
					parentProperty[last] = result;
				});
			};
