const lib = require("./libraries"); //get exported variables from this module
const util = require("./tools")
const app = lib.express();
const mongoose = lib.mongoose;
const bodyParser = lib.bodyParser;
const Role = require("./models/role.model");
const routes = require("./routes/");


/* Middlewares */
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// set view engine for view
// app.engine( 'hbs', hbs( {
//     extname: 'hbs',
//     // defaultLayout: 'main',
//     partialsDir: __dirname + '/views/partials/'
// }));
app.set("view engine", "hbs");
app.use(lib.express.static(lib.path.join(__dirname, '/')));

const uri = "mongodb+srv://admin2009:binhminh2001@cluster0.zb7re.mongodb.net/cms"; //URI connected to database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => { //execute on success
    console.log("Connected to database successfully.");
    await roleInitialize();
}).catch((e) => { //execute on error, print error on console and exit
    console.log(e);
    process.exit();
})

// Routes
routes.auth(app);
routes.home(app);

/* 404 handling */
app.use((req, res, next) => {
    res.status(404).redirect("/404");
})

app.listen(3000);

/**
 * Auto-generate roles after successfully connected to db
 */
const roleInitialize = async () => {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await Role.create({name: "admin"}); //create role
            console.log("Roles admin is added.")

            await Role.create({name: "staff"});
            console.log("Roles staff is added.")

            await Role.create({name: "trainer"});
            console.log("Roles trainer is added.")

            await Role.create({name: "trainee"});
            console.log("Roles trainee is added.")

        }
    } catch (e) {
        console.log(e)
    }
}
