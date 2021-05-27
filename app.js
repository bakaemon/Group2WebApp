let lib = require("./libraries"); //get exported variables from this module
let util = require("./tools");
let app = lib.express();
let ar = [1, 4, 3, 2];
console.log(util.qsort(ar));
