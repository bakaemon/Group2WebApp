const lib = require("./libraries");
const hbs = lib.hbs;
module.exports = () => {
    //allow to use custom ifCond similar to native if structure, with further improvement
    hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            case "of":
                return v1.some(r => v2.includes(r)) ? options.fn(this) : options.inverse(this);
            case "in":
                return (v2.includes(v1)) ? options.fn(this) : options.inverse(this);
        }
    });
    hbs.registerHelper("math", function (v1, operator, v2, options) {
        v1 = parseFloat(v1);
        v2 = parseFloat(v2);

        return {
            "+": v1 + v2,
            "-": v1 - v2,
            "*": v1 * v2,
            "/": v1 / v2,
            "%": v1 % v2
        }[operator];
    });
    //added isdefined structure that check if the variable is empty or not, return true or false boolean
    hbs.registerHelper('isdefined', function (value, options) {
        return (value !== undefined) ? options.fn(this) : options.inverse(this);
    });
    //register hbs partial
    hbs.registerPartials('views/partials');
    //set encapsulated root variable
    hbs.registerHelper("set", (v1, v2, options) => {
        options.data.root[v1] = v2;
    })
}
