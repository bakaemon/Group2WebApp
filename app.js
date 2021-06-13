const lib = require("./libraries"); //get exported variables from this module
const app = lib.express();
const mongoose = lib.mongoose;
const bodyParser = lib.bodyParser;

const routes = require("./routes/");
const configs = require("./configs");



/* Middlewares */
// express session initialization
app.use(lib.session({
  resave: true,
  saveUninitialized: true,
  secret: 'extremelysecret',
  cookie: { maxAge: 600000 }
}));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view options', { layout: '/layouts/main' });
app.set("view engine", ".hbs");
app.use(lib.express.static(lib.path.join(__dirname, '/public')));
//register hbs functionalities
require('./handlebars')();

//connect to MongoDB
const uri = "mongodb+srv://admin2009:binhminh2001@cluster0.zb7re.mongodb.net/cms"; //URI connected to database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => { //execute on success
  console.log("Connected to database successfully.");
  await configs.roles.roleInitialize();
}).catch((e) => { //execute on error, print error on console and exit
  console.log(e);
  process.exit();
})

// Routes
routes.auth(app);
routes.home(app);
routes.test(app);
routes.admin(app);
routes.coursecontrol(app);

/* 404 handling */
app.use((req, res, next) => {
  res.render("404", { title: "Not found!", user: req.session.User });
})
var port = process.env.PORT || 3000; //use port 3000 unless there are preconfigured ports
app.listen(port);

