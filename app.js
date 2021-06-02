const lib = require("./libraries"); //get exported variables from this module
const util = require("./tools")
const app = lib.express();
const mongoose = lib.mongoose;
const bodyParser = lib.bodyParser;
const Role = require("./models/role.model");
const routes = require("./routes/");

const hbs = lib.hbs


hbs.registerHelper('ifequal', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

/* Middlewares */
// express session initialization
app.use(lib.session({
  resave: true,
  saveUninitialized: true,
  secret: 'extremelysecret',
  cookie: {maxAge: 3600000}
}));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// hbs helper logic operation
// const hbs = handlebars.create({
//   // Specify helpers which are only registered on this instance.
//   helpers: {
//     if_equal: function(a, b, opts) {
//       if (a === b) {
//         return opts.fn(this)
//       } else {
//         return opts.inverse(this)
//       }
//     }
//   }
// });

// set view engine for view
// app.engine('hbs', handlebars({
//   extname: '.hbs',
//   // defaultLayout: 'main',
//   partialsDir: __dirname + '/views/partials/'
// }));
hbs.registerPartials('views/partials');
app.set('view options', { layout: '/layouts/main' });
app.set("view engine", ".hbs");

app.use(lib.express.static(lib.path.join(__dirname, '/public')));

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
routes.test(app);
routes.admin(app);

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
