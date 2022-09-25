// slightly more effort: contextual logging
import { pipe } from "https://esm.sh/ramda@0.28.0";
import { prettify } from "../pretty.ts";
import { Free } from "https://cdn.jsdelivr.net/gh/ckoshka/free/mod.ts";
// you might be wondering what this mysterious import is
// 

// mock using free

// this time, we'll go for something more complex - a discord bot!
// this discord bot exists to help english speakers 
// who want to learn toki pona.

// users can submit sentences and their translations into toki pona
// other users can provide corrective feedback, 
// and upvote those translations.


const loggingFn = pipe(prettify("bot"), console.log);