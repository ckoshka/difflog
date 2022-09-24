import { colors, diff } from "./deps.ts";

export const prettify = (objName: string) =>
	(obj: ReturnType<typeof diff>) => {
		// deno-lint-ignore no-explicit-any
		return obj.map((changes: any) => {
			const type = changes.type === "CHANGE"
				? colors.cyan.bold("Δ CHANGED")
				: changes.type === "CREATE"
				? colors.green.bold("+ CREATED")
				: colors.red.bold("🚫 REMOVED");

			return `${type} ${
				colors.italic.yellow(objName + "." + changes.path.join("."))
			} ${colors.gray("|")} ${
				changes.value !== undefined
					? JSON.stringify(changes.oldValue, null, 2) +
						" ➜ " +
						JSON.stringify(changes.value, null, 2)
					: ""
			}`;
		}).join("\n") + colors.gray(` at ${new Date().toLocaleTimeString()}`);
	};
