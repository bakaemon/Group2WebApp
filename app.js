const lib = require("./libraries"); //get exported variables from this module
const app =  lib.express();
const mongoose = lib.mongoose;
const bodyParser = lib.bodyParser;
const controller = require("./controllers")

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to db successfully.");
  })
  .catch((e) => {
    console.log(e);
    process.exit();
  })

app.get("/user/all")
app.post("user/all")
