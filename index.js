const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const router = require("./routes/index.routes");

require("./db");

const initialize = require("./db");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// apply routers
app.use("/api", router);

app.listen(PORT, () => {
  initialize();
  console.log(`listening to http://localhost:${PORT}`);
});
