const lib = require("./libraries"); //get exported variables from this module
const app = lib.express();
const mongoose = lib.mongoose;
const bodyParser = lib.bodyParser;
const controller = require("./controllers")

/* Middlewares */
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
var uri = ""; //URI connected to database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { //execute on success
    console.log("Connected to db successfully.");
}).catch((e) => { //execute on error, print error on console and exit
    console.log(e);
    process.exit();
})

/* Access */
app.get("/user/all")
app.post("user/all")
