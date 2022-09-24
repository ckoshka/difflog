// nothing creative here, just a todo-list app
import { pipe } from "https://esm.sh/ramda@0.28.0";
import { Logger } from "../log.ts";
import { prettify } from "../pretty.ts";

type TodoItem = {
    name: string;
    when: Date;
    estimatedMinutes: number;
    subtasks: Record<string, TodoItem>;
}

type TodoList = {
    name: string;
    tasks: TodoItem[];
};

// we'll just call the root of the dot-path "app",
// and we'll pipe the prettified output into console.log
const loggingFn = pipe(prettify("app"), console.log);

// with an initial state:
const state = <TodoList>{
    name: `Cat's to-do list`,
    tasks: []
}

// now we can create our logger
const L = Logger(loggingFn)({} as TodoList);

// first on the agenda...
state.tasks.push({
    name: "chase_some_birds",
    when: new Date(),
    estimatedMinutes: 10,
    subtasks: {}
});

L.update(state);

