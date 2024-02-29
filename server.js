const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const cookie = require("cookie-parser");
const category = require("./models/categoryModel");
//bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//setting view engine
app.set("view engine", "ejs");
//setting view path
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
//mongodb
const mongoose = require("mongoose");
db = mongoose.connect("mongodb://127.0.0.1:27017/furni_ecommerce");
//morgan
const morgan = require("morgan");
app.use(morgan("dev"));
//requiring routes
const user_route = require("./routes/userRoute");
const admin_route = require("./routes/adminRoute");
app.listen(5000, (req, res) => console.log(`Server started running`));

// Use the session middleware
app.use(
  session({
    secret: "your-secret-key", // Change this to a random string
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", user_route);
app.use("/admin", admin_route);
