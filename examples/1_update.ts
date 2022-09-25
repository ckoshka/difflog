// the lowest effort way to use this module in an existing app
import { pipe } from "https://esm.sh/ramda@0.28.0";
import { DiffLogger } from "../log.ts";
import { prettify } from "../pretty.ts";

// modify this to take log as an effect, so it can be written to a string or logged 
// explain the imports

type TodoItem = {
	name: string;
	when: Date;
	estimatedMinutes: number;
	subtasks: Record<string, TodoItem>;
};

type TodoList = {
	name: string;
	tasks: TodoItem[];
};

// we'll just call the root of the dot-path "app",
// and we'll pipe the prettified output into console.log
const loggingFn = pipe(prettify("app"), console.log);

// with an initial state:
const state = <TodoList> {
	name: `Cat's to-do list`,
	tasks: [],
};

// now we can create our logger
const L = DiffLogger({
	writeDiffs: loggingFn,
})({} as TodoList);

// first on the agenda...
state.tasks.push({
	name: "chase some birds",
	when: new Date(),
	estimatedMinutes: 10,
	subtasks: {},
});

L.update(state);

// but before that:
state.tasks[0].subtasks["nap"] = {
	name: "power nap first to conserve energy",
	when: new Date(),
	estimatedMinutes: 600,
	subtasks: {},
};

L.update(state);

// okay, maybe 600 minutes isn't enough
state.tasks[0].subtasks["nap"].estimatedMinutes += 600;

L.update(state);

//now we're done, so:
delete state.tasks[0].subtasks["nap"];

L.update(state);

export default { L, state };